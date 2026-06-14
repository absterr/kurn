import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";
import type { z } from "zod";
import { makeDB } from "@/db";
import { oneWeekAgo } from "@/utils/date";
import type { requestAccessSchema } from "../auth.v1.schema";

const UNIQUE_VIOLATION = "23505" as const;

export const requestAccessHandler = async (
  data: z.infer<typeof requestAccessSchema>,
) => {
  const { email, name } = data;

  const foundUser = await makeDB()
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();

  if (foundUser)
    throw new HTTPException(409, {
      message: "A user with this email already exists",
    });

  const rejectedRequest = await makeDB()
    .selectFrom("accessRequests")
    .where("email", "=", email)
    .where("status", "=", "rejected")
    .where("updatedAt", ">", oneWeekAgo())
    .selectAll()
    .executeTakeFirst();

  if (rejectedRequest)
    throw new HTTPException(429, {
      message: "You request was recently rejected",
    });

  try {
    await makeDB()
      .insertInto("accessRequests")
      .values({ email, name, status: "pending" })
      .execute();

    return { message: "Access request submitted successfully" };
  } catch (err) {
    if (err instanceof DatabaseError && err.code === UNIQUE_VIOLATION) {
      throw new HTTPException(409, {
        message: "An active request for this email already exists",
      });
    }

    throw err;
  }
};
