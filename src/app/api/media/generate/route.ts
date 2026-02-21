import { NextRequest, NextResponse } from 'next/server'
import { generateImage, type TemplateName, type TemplateData } from '@/lib/media/image-generator'

const VALID_TEMPLATES: TemplateName[] = ['data-drop', 'confession', 'wrapped', 'whatsapp-card']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template, data } = body as { template: string; data: TemplateData }

    if (!template || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: template, data' },
        { status: 400 }
      )
    }

    if (!VALID_TEMPLATES.includes(template as TemplateName)) {
      return NextResponse.json(
        { error: `Invalid template. Valid options: ${VALID_TEMPLATES.join(', ')}` },
        { status: 400 }
      )
    }

    const imageResponse = generateImage(template as TemplateName, data)

    // Return the image directly
    return new Response(imageResponse.body, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('[media/generate] Error:', err)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
