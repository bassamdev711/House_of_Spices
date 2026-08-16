import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#394915" width="32" height="32" style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' }}>
          <path d="M12 2L13.5 8L19.5 6L16 11.5L21.5 15L15 15.5L16.5 21L12 17L7.5 21L9 15.5L2.5 15L8 11.5L4.5 6L10.5 8L12 2Z" />
          <circle cx="12" cy="12" r="2.5" fill="#B2CCA2" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
