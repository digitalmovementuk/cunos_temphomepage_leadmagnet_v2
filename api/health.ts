import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    ok: true,
    nodeVersion: process.version,
    hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    anthropicKeyPrefix: process.env.ANTHROPIC_API_KEY?.slice(0, 12) ?? null,
    hasPagespeedKey: Boolean(process.env.PAGESPEED_API_KEY),
    timestamp: new Date().toISOString(),
  })
}
