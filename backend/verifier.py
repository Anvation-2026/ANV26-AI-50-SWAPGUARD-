import cv2
import numpy as np


# ============================================================
# IMAGE LOADING
# ============================================================

def load_image(image_bytes):
    array = np.frombuffer(
        image_bytes,
        dtype=np.uint8
    )

    image = cv2.imdecode(
        array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise ValueError("Unable to read image")

    return image


# ============================================================
# IMAGE PREPARATION
# ============================================================

def prepare_image(image):
    max_size = 1400

    height, width = image.shape[:2]

    scale = min(
        max_size / width,
        max_size / height,
        1.0
    )

    if scale < 1.0:
        image = cv2.resize(
            image,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_AREA
        )

    return image


# ============================================================
# PRODUCT / FOREGROUND MASK
# ============================================================

def create_product_mask(image):
    """
    Estimate the main product region.

    This reduces the influence of common backgrounds such as
    tables, walls and floors.
    """

    height, width = image.shape[:2]

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    edges = cv2.Canny(
        blurred,
        50,
        150
    )

    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE,
        (7, 7)
    )

    edges = cv2.dilate(
        edges,
        kernel,
        iterations=2
    )

    edges = cv2.morphologyEx(
        edges,
        cv2.MORPH_CLOSE,
        kernel,
        iterations=3
    )

    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(
        edges,
        connectivity=8
    )

    mask = np.zeros(
        (height, width),
        dtype=np.uint8
    )

    image_center_x = width / 2.0
    image_center_y = height / 2.0
    image_area = float(width * height)

    best_label = -1
    best_score = -1.0

    for label in range(1, num_labels):

        x, y, w, h, area = stats[label]

        if area < image_area * 0.005:
            continue

        if area > image_area * 0.75:
            continue

        center_x, center_y = centroids[label]

        distance = np.sqrt(
            ((center_x - image_center_x) / width) ** 2
            +
            ((center_y - image_center_y) / height) ** 2
        )

        center_score = max(
            0.0,
            1.0 - distance * 2.5
        )

        area_ratio = area / image_area

        area_score = min(
            area_ratio / 0.20,
            1.0
        )

        score = (
            center_score * 0.65
            +
            area_score * 0.35
        )

        if score > best_score:
            best_score = score
            best_label = label

    if best_label != -1:

        mask[labels == best_label] = 255

        expand_kernel = cv2.getStructuringElement(
            cv2.MORPH_ELLIPSE,
            (21, 21)
        )

        mask = cv2.dilate(
            mask,
            expand_kernel,
            iterations=2
        )

        mask = cv2.morphologyEx(
            mask,
            cv2.MORPH_CLOSE,
            expand_kernel,
            iterations=3
        )

    # Fallback if segmentation is unreliable.
    mask_pixels = cv2.countNonZero(mask)

    if mask_pixels < image_area * 0.03:

        mask = np.zeros(
            (height, width),
            dtype=np.uint8
        )

        x1 = int(width * 0.12)
        y1 = int(height * 0.10)

        x2 = int(width * 0.88)
        y2 = int(height * 0.90)

        mask[y1:y2, x1:x2] = 255

    return mask


# ============================================================
# FEATURE EXTRACTION
# ============================================================

def extract_features(image):

    image = prepare_image(image)

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    gray = clahe.apply(gray)

    product_mask = create_product_mask(
        image
    )

    sift = cv2.SIFT_create(
        nfeatures=2500,
        contrastThreshold=0.035,
        edgeThreshold=10,
        sigma=1.6
    )

    keypoints, descriptors = sift.detectAndCompute(
        gray,
        product_mask
    )

    return (
        keypoints,
        descriptors,
        product_mask,
        image.shape
    )


# ============================================================
# FEATURE MATCHING
# ============================================================

def get_good_matches(
    original_descriptors,
    return_descriptors
):

    if (
        original_descriptors is None
        or return_descriptors is None
    ):
        return []

    if (
        len(original_descriptors) < 2
        or len(return_descriptors) < 2
    ):
        return []

    matcher = cv2.BFMatcher(
        cv2.NORM_L2,
        crossCheck=False
    )

    matches = matcher.knnMatch(
        original_descriptors,
        return_descriptors,
        k=2
    )

    good_matches = []

    for pair in matches:

        if len(pair) < 2:
            continue

        first = pair[0]
        second = pair[1]

        # Strict Lowe ratio.
        if first.distance < 0.68 * second.distance:
            good_matches.append(first)

    return good_matches


# ============================================================
# RANSAC GEOMETRIC VERIFICATION
# ============================================================

def calculate_homography(
    original_keypoints,
    return_keypoints,
    good_matches
):

    if len(good_matches) < 4:

        return {
            "homography_found": False,
            "inliers": 0,
            "inlier_ratio": 0.0,
            "inlier_mask": None
        }

    original_points = np.float32([
        original_keypoints[m.queryIdx].pt
        for m in good_matches
    ]).reshape(-1, 1, 2)

    return_points = np.float32([
        return_keypoints[m.trainIdx].pt
        for m in good_matches
    ]).reshape(-1, 1, 2)

    try:

        homography, mask = cv2.findHomography(
            original_points,
            return_points,
            cv2.RANSAC,
            4.0
        )

    except cv2.error:

        return {
            "homography_found": False,
            "inliers": 0,
            "inlier_ratio": 0.0,
            "inlier_mask": None
        }

    if (
        homography is None
        or mask is None
    ):

        return {
            "homography_found": False,
            "inliers": 0,
            "inlier_ratio": 0.0,
            "inlier_mask": None
        }

    inlier_mask = mask.ravel().astype(bool)

    inliers = int(
        np.sum(inlier_mask)
    )

    inlier_ratio = (
        inliers /
        max(len(good_matches), 1)
    )

    return {
        "homography_found": True,
        "inliers": inliers,
        "inlier_ratio": float(inlier_ratio),
        "inlier_mask": inlier_mask
    }


# ============================================================
# SPATIAL DISTRIBUTION
# ============================================================

def calculate_spatial_distribution(
    original_keypoints,
    good_matches,
    inlier_mask,
    image_shape
):

    if (
        inlier_mask is None
        or len(good_matches) == 0
    ):
        return {
            "coverage": 0.0,
            "grid_cells": 0
        }

    height, width = image_shape[:2]

    points = []

    for index, match in enumerate(good_matches):

        if not inlier_mask[index]:
            continue

        x, y = original_keypoints[
            match.queryIdx
        ].pt

        points.append(
            (
                x / max(width, 1),
                y / max(height, 1)
            )
        )

    if len(points) < 4:

        return {
            "coverage": 0.0,
            "grid_cells": 0
        }

    occupied = set()

    for x, y in points:

        cell_x = min(
            int(x * 4),
            3
        )

        cell_y = min(
            int(y * 4),
            3
        )

        occupied.add(
            (cell_x, cell_y)
        )

    grid_cells = len(occupied)

    coverage = grid_cells / 16.0

    return {
        "coverage": float(coverage),
        "grid_cells": grid_cells
    }


# ============================================================
# SCORE CALCULATION
# ============================================================

def calculate_score(
    good_match_count,
    inliers,
    inlier_ratio,
    spatial_coverage,
    original_feature_count,
    return_feature_count
):

    if (
        original_feature_count == 0
        or return_feature_count == 0
    ):
        return 0

    if good_match_count < 6:
        return 0

    # Strong geometric inliers.
    inlier_score = min(
        inliers / 60.0,
        1.0
    ) * 100

    # Percentage of good matches that survived RANSAC.
    geometry_score = (
        inlier_ratio * 100
    )

    # Number of reliable local matches.
    match_score = min(
        good_match_count / 80.0,
        1.0
    ) * 100

    # Are matches spread across the product?
    coverage_score = (
        spatial_coverage * 100
    )

    score = (
        inlier_score * 0.40
        +
        geometry_score * 0.30
        +
        match_score * 0.10
        +
        coverage_score * 0.20
    )

    # Very few inliers = unreliable.
    if inliers < 8:
        score *= 0.20

    elif inliers < 15:
        score *= 0.45

    elif inliers < 25:
        score *= 0.70

    # Poor geometric consistency.
    if inlier_ratio < 0.15:
        score *= 0.35

    elif inlier_ratio < 0.25:
        score *= 0.65

    # Matches concentrated in a tiny region are suspicious.
    if spatial_coverage < 0.10:
        score *= 0.30

    elif spatial_coverage < 0.20:
        score *= 0.60

    return int(
        max(
            0,
            min(
                round(score),
                100
            )
        )
    )


# ============================================================
# SINGLE IMAGE COMPARISON
# ============================================================

def compare_images(
    original_bytes,
    return_bytes
):

    original = load_image(
        original_bytes
    )

    returned = load_image(
        return_bytes
    )

    (
        original_keypoints,
        original_descriptors,
        original_mask,
        original_shape
    ) = extract_features(
        original
    )

    (
        return_keypoints,
        return_descriptors,
        return_mask,
        return_shape
    ) = extract_features(
        returned
    )

    original_feature_count = (
        0
        if original_descriptors is None
        else len(original_descriptors)
    )

    return_feature_count = (
        0
        if return_descriptors is None
        else len(return_descriptors)
    )

    # --------------------------------------------------------
    # Not enough features
    # --------------------------------------------------------

    if (
        original_descriptors is None
        or return_descriptors is None
    ):

        return {
            "score": 0,
            "good_matches": 0,
            "inliers": 0,
            "inlier_ratio": 0,
            "spatial_coverage": 0,
            "original_features": original_feature_count,
            "return_features": return_feature_count,
            "status": "mismatch"
        }

    # --------------------------------------------------------
    # Match features
    # --------------------------------------------------------

    good_matches = get_good_matches(
        original_descriptors,
        return_descriptors
    )

    good_match_count = len(
        good_matches
    )

    # --------------------------------------------------------
    # RANSAC
    # --------------------------------------------------------

    geometry = calculate_homography(
        original_keypoints,
        return_keypoints,
        good_matches
    )

    inliers = geometry[
        "inliers"
    ]

    inlier_ratio = geometry[
        "inlier_ratio"
    ]

    # --------------------------------------------------------
    # Spatial distribution
    # --------------------------------------------------------

    spatial = calculate_spatial_distribution(
        original_keypoints,
        good_matches,
        geometry["inlier_mask"],
        original_shape
    )

    spatial_coverage = spatial[
        "coverage"
    ]

    # --------------------------------------------------------
    # Score
    # --------------------------------------------------------

    score = calculate_score(
        good_match_count,
        inliers,
        inlier_ratio,
        spatial_coverage,
        original_feature_count,
        return_feature_count
    )

    # --------------------------------------------------------
    # Classification
    # --------------------------------------------------------

    if (
        inliers >= 30
        and inlier_ratio >= 0.30
        and spatial_coverage >= 0.25
        and score >= 55
    ):

        status = "strong_match"

    elif (
        inliers >= 18
        and inlier_ratio >= 0.22
        and spatial_coverage >= 0.18
        and score >= 40
    ):

        status = "possible_match"

    else:

        status = "mismatch"

    return {
        "score": score,
        "good_matches": good_match_count,
        "inliers": inliers,
        "inlier_ratio": round(
            inlier_ratio * 100,
            2
        ),
        "spatial_coverage": round(
            spatial_coverage * 100,
            2
        ),
        "original_features": original_feature_count,
        "return_features": return_feature_count,
        "status": status
    }


# ============================================================
# SIX-ANGLE VERIFICATION
# ============================================================

def verify_product(
    original_images,
    return_images
):

    if len(original_images) != len(return_images):

        raise ValueError(
            "Original and return image counts must match"
        )

    if len(original_images) == 0:

        return {
            "final_score": 0,
            "average_score": 0,
            "lowest_angle_score": 0,
            "strong_angles": 0,
            "failed_angles": 0,
            "decision": "MISMATCH",
            "angles": []
        }

    angle_names = [
        "Front",
        "Back",
        "Left",
        "Right",
        "Top",
        "Bottom"
    ]

    angle_results = []

    # --------------------------------------------------------
    # Compare all angles
    # --------------------------------------------------------

    for index in range(
        len(original_images)
    ):

        result = compare_images(
            original_images[index],
            return_images[index]
        )

        if index < len(angle_names):

            result["angle"] = (
                angle_names[index]
            )

        else:

            result["angle"] = (
                f"Angle {index + 1}"
            )

        angle_results.append(
            result
        )

    # --------------------------------------------------------
    # Scores
    # --------------------------------------------------------

    scores = [
        item["score"]
        for item in angle_results
    ]

    if not scores:

        return {
            "final_score": 0,
            "average_score": 0,
            "lowest_angle_score": 0,
            "strong_angles": 0,
            "failed_angles": 0,
            "decision": "MISMATCH",
            "angles": []
        }

    average_score = float(
        np.mean(scores)
    )

    lowest_score = min(
        scores
    )

    # --------------------------------------------------------
    # Count strong / failed angles
    # --------------------------------------------------------

    strong_angles = sum(
        1
        for item in angle_results
        if item["status"] == "strong_match"
    )

    failed_angles = sum(
        1
        for item in angle_results
        if item["status"] == "mismatch"
    )

    weak_angles = sum(
        1
        for item in angle_results
        if item["score"] < 45
    )

    # --------------------------------------------------------
    # Final score
    #
    # The weakest angle gets 50% weight.
    # This prevents one missing/different product view
    # from being hidden by good background matches.
    # --------------------------------------------------------

    final_score = (
        average_score * 0.50
        +
        lowest_score * 0.50
    )

    final_score = round(
        final_score
    )

    # --------------------------------------------------------
    # Catastrophic mismatch
    # --------------------------------------------------------

    catastrophic_mismatch = any(
        (
            item["inliers"] < 8
            or item["score"] < 25
            or item["spatial_coverage"] < 8
        )
        for item in angle_results
    )

    # --------------------------------------------------------
    # FINAL DECISION
    #
    # For a MATCH:
    #
    # - all six angles must be strong
    # - no failed angles
    # - no weak angles
    # - no catastrophic mismatch
    # - weakest angle >= 55
    # - final score >= 65
    #
    # This makes the system deliberately strict.
    # --------------------------------------------------------

    if (
        len(angle_results) >= 6
        and strong_angles >= 6
        and failed_angles == 0
        and weak_angles == 0
        and not catastrophic_mismatch
        and lowest_score >= 55
        and final_score >= 65
    ):

        decision = "MATCH"

    else:

        decision = "MISMATCH"

    return {
        "final_score": final_score,
        "average_score": round(
            average_score
        ),
        "lowest_angle_score": lowest_score,
        "strong_angles": strong_angles,
        "failed_angles": failed_angles,
        "decision": decision,
        "angles": angle_results
    }