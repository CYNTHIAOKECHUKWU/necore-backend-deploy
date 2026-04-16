import { Request, Response } from "express";
import { connectDB } from "../config/mongodb";
import { uploadDocument, submitKYC } from "../services/necoreClient";
import { v4 as uuidv4 } from "uuid";

type MulterRequest = Request & {
  file?: any;
};





// =============================
// START VERIFICATION
// =============================
export const startVerification = async (req: Request, res: Response) => {
  try {

    const { userId, businessId, documentType } = req.body;

    if (!userId || !businessId || !documentType) {
      return res.status(400).json({
        success: false,
        message: "userId, businessId and documentType required"
      });
    }

    const verificationId = uuidv4();

    const db = await connectDB();

    await db.collection("verifications").insertOne({
      verificationId,
      userId,
      businessId,
      documentType,
      status: "pending",
      createdAt: new Date()
    });
    

    return res.json({
      success: true,
      verificationId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to start verification"
    });

  }
};





// =============================
// UPLOAD DOCUMENT + SUBMIT KYC
// =============================
export const uploadAndVerify = async (req: MulterRequest, res: Response) => {
   console.log("Document upload request received");

  try {

    const file = req.file;
    const { verificationId } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const db = await connectDB();

    const verification: any = await db.collection("verifications").findOne({
      verificationId
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found"
      });
    }

    // STEP 1: Upload document to AI
    const docResult = await uploadDocument(
      file,
      verificationId,
      verification.documentType
    );

    console.log("DOCUMENT UPLOAD RESULT:", docResult);

    // STEP 2: Submit verification
    const submitResult = await submitKYC(
      verificationId,
      docResult.document_id,
      verification.documentType
    );

    console.log("SUBMIT RESULT:", submitResult);

    // STEP 3: Update DB status
    await db.collection("verifications").updateOne(
      { verificationId },
      {
        $set: {
          status: "processing",
          documentId: docResult.document_id,
          submittedAt: new Date()
        }
      }
    );

    return res.json({
      success: true,
      verificationId,
      documentId: docResult.document_id,
      status: "processing"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Document upload failed"
    });

  }
};





// =============================
// GET VERIFICATION RESULT
// =============================
export const getVerificationResult = async (req: Request, res: Response) => {

  
    console.log("getVerificationResult HIT:", req.params.id);

  try {

    const { id } = req.params;
      console.log("VERIFICATION ID:", id);

    const db = await connectDB();
     console.log("Connected to DB:", db.databaseName);

    let verification: any = await db.collection("verifications").findOne({
      verificationId: id
    });

    console.log("DB RESULT:", verification);

    if (!verification) {
      console.log("VERIFICATION NOT FOUND");
      return res.status(404).json({
        success: false,
        message: "Verification not found"
      });
    }

    // If still processing, simulate verification completion
    if (verification.status === "processing") {

      const trustScore = 85 + Math.floor(Math.random() * 10);

      console.log("GENERATED TRUST SCORE:", trustScore);

      await db.collection("verifications").updateOne(
        { verificationId: id },
        {
          $set: {
            status: "verified",
            trustScore,
            verifiedAt: new Date()
          }
        }
      );

      

      // Refresh updated record from DB
      verification = await db.collection("verifications").findOne({
        verificationId: id
      });

    }
     console.log("FINAL RESPONSE:", verification);

    return res.json({
      success: true,
      verificationId: verification.verificationId,
      status: verification.status,
      trustScore: verification.trustScore ?? null
    });

  } catch (error) {

    console.error("GET VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification result"
    });

  }
};