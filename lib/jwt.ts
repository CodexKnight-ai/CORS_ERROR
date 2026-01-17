import { SignJWT, jwtVerify } from 'jose';

export async function signToken(userId: string): Promise<string> {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('Please define the JWT_SECRET environment variable');
  }
  
  const encodedSecret = new TextEncoder().encode(secret);
  
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedSecret);
}

export async function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return null;
    }
    
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    return null;
  }
}
