import crypto from "crypto";

export function generateId() {
  return "ver_" + crypto.randomBytes(8).toString("hex");
}