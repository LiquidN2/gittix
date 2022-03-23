import * as jose from 'jose';
import { createSecretKey } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME as string;

const secretKey = createSecretKey(JWT_SECRET, 'utf-8');

export interface UserPayLoad extends jose.JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export const generateUserJwt = async (userPayload: UserPayLoad) => {
  return await new jose.SignJWT(userPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(secretKey);
};

export const verifyUserJwt = async (
  jwt: string
): Promise<UserPayLoad | jose.JWTPayload> => {
  const { payload } = await jose.jwtVerify(jwt, secretKey, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  return payload;
};
