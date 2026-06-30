import { scrypt as _scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { db } from "../drizzle";
import { accounts, users } from "../tables";
import { prompt, promptHidden } from "./prompt-user";

const scrypt = promisify(_scrypt);
const KEY_LENGTH = 64;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

async function seedAdmin() {
  try {
    const name = await prompt("Name: ");
    if (!name) throw new Error("Name is required");

    const email = await prompt("Email: ");
    if (!isValidEmail(email)) throw new Error("Invalid email address");

    const password = await promptHidden("Password: ");
    if (password.length < 8)
      throw new Error("Password must be at least 8 characters");

    const confirmPassword = await promptHidden("Confirm password: ");
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const hashedPassword = await hashPassword(password);

    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          name,
          email,
          emailVerified: true,
        })
        .returning();

      if (!user) throw new Error("User not created");

      await tx.insert(accounts).values({
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        role: "admin",
        password: hashedPassword,
      });
    });

    console.log(`[✓] Admin user seeded`);
    process.exit(0);
  } catch (err) {
    console.error(
      "[✗] Failed to seed admin user:",
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  }
}

seedAdmin();
