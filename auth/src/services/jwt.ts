import * as jose from 'jose';
import { createSecretKey } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME as string;

interface UserCredentials extends jose.JWTPayload {
  id: string;
  email: string;
}

const secretKey = createSecretKey(JWT_SECRET, 'utf-8');

export const generateUserJwt = async (userCredentials: UserCredentials) => {
  return await new jose.SignJWT(userCredentials)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(secretKey);
};

export const verifyUserJwt = async (jwt: string) => {
  const { payload } = await jose.jwtVerify(jwt, secretKey, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  return payload;
};
