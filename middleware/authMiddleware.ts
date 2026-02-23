import { getTokenFromRequest, TokenPayload } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function authenticateUser(request: Request): Promise<{
  user: TokenPayload | null;
  error: NextResponse | null;
}> {
  const user = await getTokenFromRequest(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, error: null };
}

export async function authorizeRole(request: Request, roles: string[]): Promise<{
  user: TokenPayload | null;
  error: NextResponse | null;
}> {
  const { user, error } = await authenticateUser(request);
  if (error) return { user: null, error };
  if (!roles.includes(user!.role)) {
    return {
      user: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user, error: null };
}