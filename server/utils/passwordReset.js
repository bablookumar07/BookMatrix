import crypto from "crypto";

// Generate a secure random reset token
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Hash reset token before storing it in MongoDB
export const hashResetToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};