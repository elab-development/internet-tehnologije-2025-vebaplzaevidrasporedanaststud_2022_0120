import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { JWTPayload } from "../shared/types";
import { signToken as signJwt, verifyToken as verifyJwt } from "./jwt";

const COOKIE_NAME = "auth_token";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signToken(payload: JWTPayload): Promise<string> {
    return signJwt(payload);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    return verifyJwt(token);
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false, // Disabled as per user request (HTTP only)
        sameSite: "lax", // Good balance for CSRF and compatibility
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export async function getAuthSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
