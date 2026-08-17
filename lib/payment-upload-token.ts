import { SignJWT, jwtVerify } from 'jose'

const PAYMENT_UPLOAD_ISSUER = 'house-of-spices-payment-upload'
const PAYMENT_UPLOAD_AUDIENCE = 'house-of-spices-payment-upload'

function getSecret(): Uint8Array {
  const value = process.env.JWT_SECRET
  if (!value) throw new Error('JWT_SECRET is not configured')
  return new TextEncoder().encode(value)
}

export async function createPaymentUploadToken(orderId: string): Promise<string> {
  return new SignJWT({ purpose: 'payment-upload', orderId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(PAYMENT_UPLOAD_ISSUER)
    .setAudience(PAYMENT_UPLOAD_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(getSecret())
}

export async function verifyPaymentUploadToken(token: string, expectedOrderId: string): Promise<boolean> {
  if (!token || !expectedOrderId) return false

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: PAYMENT_UPLOAD_ISSUER,
      audience: PAYMENT_UPLOAD_AUDIENCE,
      algorithms: ['HS256'],
    })

    return payload.purpose === 'payment-upload' && payload.orderId === expectedOrderId
  } catch {
    return false
  }
}
