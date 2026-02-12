import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth';

// Mocking process.env for JWT_SECRET
vi.stubEnv('JWT_SECRET', 'test-secret');

describe('Auth Utilities', () => {
    describe('Password Hashing', () => {
        it('should hash a password and verify it correctly', async () => {
            const password = 'mySecurePassword123';
            const hash = await hashPassword(password);
            expect(hash).not.toBe(password);

            const isValid = await verifyPassword(password, hash);
            expect(isValid).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const password = 'mySecurePassword123';
            const hash = await hashPassword(password);
            const isValid = await verifyPassword('wrong-password', hash);
            expect(isValid).toBe(false);
        });
    });

});
