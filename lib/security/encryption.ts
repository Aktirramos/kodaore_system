import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { env } from "@/lib/env";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12;
const SUPPORTED_VERSION = "v1";

function getEncryptionKey() {
  // Derive a fixed 32-byte key from the configured secret.
  return createHash("sha256").update(env.ENCRYPTION_SECRET, "utf8").digest();
}

export function encryptSensitiveValue(plainText: string) {
  if (!plainText) {
    throw new Error("Cannot encrypt empty value.");
  }

  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    SUPPORTED_VERSION,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptSensitiveValue(encryptedPayload: string) {
  const [version, ivPart, authTagPart, encryptedPart] = encryptedPayload.split(".");

  if (!version || !ivPart || !authTagPart || !encryptedPart || version !== SUPPORTED_VERSION) {
    throw new Error("Invalid encrypted payload format.");
  }

  try {
    const decipher = createDecipheriv(
      ENCRYPTION_ALGORITHM,
      getEncryptionKey(),
      Buffer.from(ivPart, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPart, "base64url")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch {
    throw new Error("Unable to decrypt payload.");
  }
}

export function encryptIban(iban: string) {
  const normalizedIban = iban.replace(/\s+/g, "").toUpperCase();

  if (!normalizedIban) {
    throw new Error("Cannot encrypt empty IBAN.");
  }

  return encryptSensitiveValue(normalizedIban);
}

export function decryptIban(ibanEncrypted: string) {
  return decryptSensitiveValue(ibanEncrypted);
}
