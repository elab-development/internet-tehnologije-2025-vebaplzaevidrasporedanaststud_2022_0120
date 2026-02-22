import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from '../shared/types';

export async function signToken(payload: JWTPayload): Promise<string> {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}
