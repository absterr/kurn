import { scrypt as _scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt}:${hash.toString("hex")}`;
}

export async function comparePassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(hash, Buffer.from(key, "hex"));
}
