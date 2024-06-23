import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Session = {
  userId: string;
  schoolId?: string;
  isStudent?: boolean;
  isAdmin?: boolean;
  expiresAt: Date;
};
const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24hr")
    .sign(key);
}
export async function decrypt(
  session: string | undefined = ""
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (error) {
    return null;
  }
}

export async function createSession({
  userId,
  schoolId,
  isStudent,
  isAdmin = false,
}: {
  userId: string;
  schoolId?: string;
  isStudent?: boolean;
  isAdmin?: boolean;
}) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000);

  const session = await encrypt({
    userId,
    schoolId,
    isStudent,
    isAdmin,
    expiresAt,
  });

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId,
    isAdmin: session?.isAdmin,
    isStudent: session.isStudent,
    schoolId: session?.schoolId,
  };
}

export async function updateSession() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export function deleteSession() {
  cookies().delete("session");
  redirect("/login");
}
