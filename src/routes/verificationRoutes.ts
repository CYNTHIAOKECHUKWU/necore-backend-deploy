import express from "express";
import multer from "multer";
import * as vc from "../controllers/verificationController";
import { apiKeyAuth } from "../middleware/apiKeyAuth";

console.log(vc);

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Start verification
router.post("/start", apiKeyAuth, vc.startVerification);

// Upload document
router.post(
  "/upload",
  apiKeyAuth,
  upload.single("file"),
  vc.uploadAndVerify
);

// Get verification result
router.get("/:id", vc.getVerificationResult);


export default router;