# 🛡️ SwapGuard

### AI-Powered Return Verification & Product Authenticity Investigation Platform

SwapGuard is a return-verification platform designed to help e-commerce businesses detect **product swapping, counterfeit returns, and mismatched products** by comparing delivery-time evidence with return-time evidence.

Instead of relying only on manual inspection, SwapGuard uses **computer vision-based image comparison** to identify whether the returned product matches the product originally delivered.

---

## 🚀 Problem Statement

Product replacement and counterfeit returns are major challenges for e-commerce businesses.

A customer may:

- Receive a genuine product
- Replace it with a replica or different product
- Initiate a return
- Send back the substituted product

Traditional return inspection is often:

- Manual
- Time-consuming
- Difficult to verify
- Dependent on human judgment
- Difficult to audit later

### SwapGuard solves this problem by creating a visual evidence trail.

---

## 💡 Solution

SwapGuard captures product images at two important stages:

### 1. Delivery Evidence

The delivery person captures six images of the product:

- Front
- Back
- Left
- Right
- Top
- Bottom

These images are stored as the **original delivery evidence**.

### 2. Return Evidence

When the customer requests a return, the delivery person captures the same six angles again.

The system compares the original and returned product images.

### 3. Verification

The backend performs computer-vision analysis to determine whether the returned product visually matches the original product.

```text
Original Delivery
       ↓
6 Product Images
       ↓
Evidence Stored
       ↓
Customer Requests Return
       ↓
6 Return Images
       ↓
Computer Vision Comparison
       ↓
MATCH / MISMATCH
       ↓
Investigation / Review
