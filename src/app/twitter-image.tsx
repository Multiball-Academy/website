import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Multiball Academy - Flip. Tinker. Play.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '100px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            opacity: 0.3,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '120px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            opacity: 0.3,
            display: 'flex',
          }}
        />
        
        {/* Silverball icon */}
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #e2e8f0 0%, #94a3b8 50%, #64748b 100%)',
            marginBottom: '40px',
            boxShadow: '0 0 60px rgba(148, 163, 184, 0.4)',
            display: 'flex',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          Multiball Academy
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '30px',
            display: 'flex',
          }}
        >
          Flip. Tinker. Play.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            display: 'flex',
          }}
        >
          Youth pinball + maker space · Memphis, TN
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
