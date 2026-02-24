import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from '../shared/types';

export async function signToken(payload: JWTPayload): Promise<string> {
    const secretStr = process.env.JWT_SECRET;
    if (!secretStr) {
        throw new Error("JWT_SECRET environment variable is not set");
    }
    const secret = new TextEncoder().encode(secretStr);
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const secretStr = process.env.JWT_SECRET;
        if (!secretStr) {
            throw new Error("JWT_SECRET environment variable is not set");
        }
        const secret = new TextEncoder().encode(secretStr);
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}
