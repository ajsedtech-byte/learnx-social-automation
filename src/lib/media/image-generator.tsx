import { ImageResponse } from '@vercel/og'

export type TemplateName = 'data-drop' | 'confession' | 'wrapped' | 'whatsapp-card'

export interface DataDropData {
  stat: string
  context: string
  punchline: string
}

export interface ConfessionData {
  number: number
  text: string
}

export interface WrappedData {
  title: string
  mainStat: string
  subtitle: string
  cheekyLine: string
}

export interface WhatsAppCardData {
  headline: string
  body: string
  footer?: string
}

export type TemplateData = DataDropData | ConfessionData | WrappedData | WhatsAppCardData

// ── Template renderers ──────────────────────────────────

function renderDataDrop(data: DataDropData) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '1080px',
        background: '#060a14',
        padding: '80px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* LearnX watermark */}
      <div style={{ display: 'flex', position: 'absolute', top: '40px', left: '50px', fontSize: '18px', color: '#475569', fontWeight: 700, letterSpacing: '2px' }}>
        LEARNX
      </div>

      {/* Big stat */}
      <div style={{ display: 'flex', fontSize: '140px', fontWeight: 900, color: '#ffffff', lineHeight: 1, textAlign: 'center', marginBottom: '24px' }}>
        {data.stat}
      </div>

      {/* Context line */}
      <div style={{ display: 'flex', fontSize: '28px', color: '#94a3b8', textAlign: 'center', lineHeight: 1.4, maxWidth: '800px', marginBottom: '40px' }}>
        {data.context}
      </div>

      {/* Punchline */}
      <div style={{ display: 'flex', fontSize: '32px', fontWeight: 700, color: '#2dd4bf', textAlign: 'center', lineHeight: 1.3, maxWidth: '800px' }}>
        {data.punchline}
      </div>

      {/* Bottom bar */}
      <div style={{ display: 'flex', position: 'absolute', bottom: '40px', width: '200px', height: '4px', background: 'linear-gradient(90deg, #2dd4bf, #6366f1)', borderRadius: '2px' }} />
    </div>
  )
}

function renderConfession(data: ConfessionData) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '1080px',
        background: 'linear-gradient(135deg, #0f0b2e, #1e1145)',
        padding: '80px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Confession number */}
      <div style={{ display: 'flex', position: 'absolute', top: '50px', left: '50px', fontSize: '14px', color: '#6366f1', fontWeight: 700, letterSpacing: '3px' }}>
        CONFESSION #{data.number}
      </div>

      {/* LearnX watermark */}
      <div style={{ display: 'flex', position: 'absolute', top: '50px', right: '50px', fontSize: '16px', color: '#4338ca', fontWeight: 700, letterSpacing: '2px' }}>
        LEARNX
      </div>

      {/* Quote marks */}
      <div style={{ display: 'flex', fontSize: '120px', color: '#6366f1', opacity: 0.3, lineHeight: 0.5, marginBottom: '20px' }}>
        &ldquo;
      </div>

      {/* Confession text */}
      <div style={{ display: 'flex', fontSize: '36px', fontWeight: 600, color: '#e2e8f0', textAlign: 'center', lineHeight: 1.5, maxWidth: '850px' }}>
        {data.text.length > 200 ? data.text.slice(0, 200) + '...' : data.text}
      </div>

      {/* Anonymous tag */}
      <div style={{ display: 'flex', position: 'absolute', bottom: '50px', fontSize: '14px', color: '#475569', fontWeight: 600, letterSpacing: '2px' }}>
        — ANONYMOUS STUDENT
      </div>
    </div>
  )
}

function renderWrapped(data: WrappedData) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '1080px',
        background: 'linear-gradient(135deg, #0c0c1d, #1a0a2e)',
        padding: '80px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', fontSize: '20px', color: '#ec4899', fontWeight: 700, letterSpacing: '4px', marginBottom: '40px' }}>
        {data.title.toUpperCase()}
      </div>

      {/* Main stat */}
      <div style={{ display: 'flex', fontSize: '120px', fontWeight: 900, color: '#ffffff', lineHeight: 1, textAlign: 'center', marginBottom: '20px' }}>
        {data.mainStat}
      </div>

      {/* Subtitle */}
      <div style={{ display: 'flex', fontSize: '26px', color: '#94a3b8', textAlign: 'center', lineHeight: 1.4, maxWidth: '750px', marginBottom: '40px' }}>
        {data.subtitle}
      </div>

      {/* Cheeky line */}
      <div style={{ display: 'flex', fontSize: '28px', fontWeight: 700, color: '#ec4899', textAlign: 'center', lineHeight: 1.3, maxWidth: '800px' }}>
        {data.cheekyLine}
      </div>

      {/* LearnX branding */}
      <div style={{ display: 'flex', position: 'absolute', bottom: '50px', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', fontSize: '16px', color: '#475569', fontWeight: 700, letterSpacing: '2px' }}>
          LEARNX WRAPPED
        </div>
      </div>
    </div>
  )
}

function renderWhatsAppCard(data: WhatsAppCardData) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1080px',
        height: '1080px',
        background: '#060a14',
        padding: '60px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* WhatsApp green bar */}
      <div style={{ display: 'flex', width: '100%', height: '6px', background: '#25D366', borderRadius: '3px', marginBottom: '50px' }} />

      {/* Forward icon area */}
      <div style={{ display: 'flex', fontSize: '14px', color: '#25D366', fontWeight: 700, letterSpacing: '3px', marginBottom: '40px' }}>
        FORWARD TO PARENTS
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', fontSize: '52px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '30px', maxWidth: '900px' }}>
        {data.headline}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', fontSize: '24px', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '900px', flex: 1 }}>
        {data.body.length > 300 ? data.body.slice(0, 300) + '...' : data.body}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '24px' }}>
        <div style={{ display: 'flex', fontSize: '16px', color: '#475569', fontWeight: 600 }}>
          {data.footer || '~ LearnX'}
        </div>
        <div style={{ display: 'flex', fontSize: '14px', color: '#25D366', fontWeight: 700, letterSpacing: '2px' }}>
          LEARNX.APP
        </div>
      </div>
    </div>
  )
}

// ── Main generator ──────────────────────────────────────

export function generateImage(template: TemplateName, data: TemplateData): ImageResponse {
  let element: JSX.Element

  switch (template) {
    case 'data-drop':
      element = renderDataDrop(data as DataDropData)
      break
    case 'confession':
      element = renderConfession(data as ConfessionData)
      break
    case 'wrapped':
      element = renderWrapped(data as WrappedData)
      break
    case 'whatsapp-card':
      element = renderWhatsAppCard(data as WhatsAppCardData)
      break
    default:
      throw new Error(`Unknown template: ${template}`)
  }

  return new ImageResponse(element, {
    width: 1080,
    height: 1080,
  })
}
