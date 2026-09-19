/**
 * Receives a brief from the estimator and forwards it to Discord.
 *
 * The webhook URL lives in the DISCORD_WEBHOOK_URL environment variable on
 * Vercel. It must never ship in the client bundle: the repository is public,
 * and anyone holding the URL can post to the channel.
 */

const LIMITS = { name: 100, email: 200, phone: 40, short: 100, brief: 3000 }

const clean = (value, max) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Trimmed: a value pasted into the Vercel dashboard often carries a
  // trailing newline, which makes fetch() throw on an invalid URL.
  const webhook = (process.env.DISCORD_WEBHOOK_URL || '').trim()
  if (!webhook) {
    return res.status(500).json({ error: 'Notifications are not configured' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
  }
  body = body || {}

  // Honeypot: real visitors never see or fill this field.
  if (body.company) return res.status(200).json({ ok: true })

  const brief = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    phone: clean(body.phone, LIMITS.phone),
    projectType: clean(body.projectType, LIMITS.short),
    timeline: clean(body.timeline, LIMITS.short),
    budget: clean(body.budget, LIMITS.short),
    description: clean(body.description, LIMITS.brief),
  }

  if (!brief.name || !brief.email || !brief.description) {
    return res.status(400).json({ error: 'Name, email and brief are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)) {
    return res.status(400).json({ error: 'Email address looks invalid' })
  }

  const fields = [
    ['Name', brief.name],
    ['Email', brief.email],
    ['Phone', brief.phone],
    ['Project type', brief.projectType],
    ['Timeline', brief.timeline],
    ['Budget', brief.budget],
  ]
    .filter(([, value]) => value)
    .map(([name, value]) => ({ name, value, inline: true }))

  let discord
  try {
    discord = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        username: 'Portfolio Estimator',
        // Visitor text must not be able to ping @everyone, roles or users.
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: `New project brief from ${brief.name}`.slice(0, 256),
            description: brief.description,
            fields,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })
  } catch (error) {
    console.error('Discord request failed:', error)
    return res.status(502).json({ error: 'Could not reach the notification service' })
  }

  if (!discord.ok) {
    // Logged so the cause (revoked webhook, rate limit, bad payload) shows up
    // in the Vercel function logs; the visitor only gets a generic message.
    const detail = await discord.text().catch(() => '')
    console.error(`Discord rejected the brief: ${discord.status} ${detail.slice(0, 500)}`)
    return res.status(502).json({ error: 'Could not deliver the brief' })
  }

  return res.status(200).json({ ok: true })
}
