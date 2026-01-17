"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyTokenPayload extends JwtPayload {
  userId: string;
}

export const getId = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("auth_token")?.value;

  if (!cookie) {
    throw new Error("No auth token found");
  }

  // Tell TS that decoded is of type MyTokenPayload
  const decoded = jwt.verify(cookie, process.env.JWT_SECRET!) as MyTokenPayload;

  if (!decoded || !decoded.userId) {
    throw new Error("Invalid auth token");
  }

  return decoded;
};