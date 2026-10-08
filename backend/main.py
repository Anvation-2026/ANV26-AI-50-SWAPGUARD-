from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from verifier import verify_product


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="SwapGuard Verification Engine",
    description="Computer vision engine for product return verification",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "message": "SwapGuard Verification Engine is running",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "engine": "OpenCV SIFT + RANSAC",
    }


# ============================================================
# IMAGE VERIFICATION
# ============================================================

@app.post("/verify")
async def verify_return(

    # --------------------------------------------------------
    # DELIVERY EVIDENCE
    # --------------------------------------------------------

    delivery_front: UploadFile = File(...),
    delivery_back: UploadFile = File(...),
    delivery_left: UploadFile = File(...),
    delivery_right: UploadFile = File(...),
    delivery_top: UploadFile = File(...),
    delivery_bottom: UploadFile = File(...),

    # --------------------------------------------------------
    # RETURN EVIDENCE
    # --------------------------------------------------------

    return_front: UploadFile = File(...),
    return_back: UploadFile = File(...),
    return_left: UploadFile = File(...),
    return_right: UploadFile = File(...),
    return_top: UploadFile = File(...),
    return_bottom: UploadFile = File(...),
):
    """
    Compare six original delivery images
    against six return images.

    Order:

    Front
    Back
    Left
    Right
    Top
    Bottom
    """

    try:

        # ====================================================
        # ORGANIZE DELIVERY FILES
        # ====================================================

        delivery_files = [
            delivery_front,
            delivery_back,
            delivery_left,
            delivery_right,
            delivery_top,
            delivery_bottom,
        ]

        # ====================================================
        # ORGANIZE RETURN FILES
        # ====================================================

        return_files = [
            return_front,
            return_back,
            return_left,
            return_right,
            return_top,
            return_bottom,
        ]

        # ====================================================
        # READ DELIVERY IMAGES
        # ====================================================

        original_images = []

        for image in delivery_files:

            data = await image.read()

            if not data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Empty delivery image: {image.filename}",
                )

            original_images.append(data)

        # ====================================================
        # READ RETURN IMAGES
        # ====================================================

        returned_images = []

        for image in return_files:

            data = await image.read()

            if not data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Empty return image: {image.filename}",
                )

            returned_images.append(data)

        # ====================================================
        # COMPUTER VISION
        # ====================================================

        result = verify_product(
            original_images,
            returned_images,
        )

        # ====================================================
        # RESPONSE
        # ====================================================

        return {
            "success": True,
            "engine": "OpenCV SIFT + RANSAC",
            "verification": result,
        }

    except HTTPException:
        raise

    except Exception as error:

        print("====================================")
        print("VERIFICATION ERROR:")
        print(error)
        print("====================================")

        raise HTTPException(
            status_code=500,
            detail=f"Image verification failed: {str(error)}",
        )