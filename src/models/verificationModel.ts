export interface Verification {
  verificationId: string;
  userId: string;
  businessId: string;
  documentType: string;
  trustScore?: number;
  status: "pending" | "verified" | "rejected";
  createdAt: Date;
}