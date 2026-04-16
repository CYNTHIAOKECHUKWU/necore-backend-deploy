import { connectDB } from "../config/mongodb";
import { Verification } from "../models/verificationModel";

export async function createVerification(data: Verification) {
  const db = await connectDB();

  const result = await db.collection("verifications").insertOne(data);

  return result.insertedId;
}

export async function getVerification(verificationId: string) {
  const db = await connectDB();

  const verification = await db.collection("verifications").findOne({
    verificationId
  });

  return verification;
}

export async function updateVerification(
  verificationId: string,
  update: Partial<Verification>
) {
  const db = await connectDB();

  await db.collection("verifications").updateOne(
    { verificationId },
    { $set: update }
  );
}