import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

interface Props {
  domain: string
}

const LINES = [
  'Reading your homepage…',
  'Inferring industry and primary location…',
  'Running Google PageSpeed (mobile & desktop)…',
  'Measuring Core Web Vitals — LCP, CLS, INP…',
  'Auditing meta tags, headings, schema markup…',
  'Mapping high-intent search keywords…',
  'Estimating monthly search volumes…',
  'Calculating click-through rates by position…',
  'Crossing with industry conversion rates and AOV…',
  'Modelling 90-day projection curve…',
  'Compiling the opportunity number…',
] as const

export function AnalysingStep({ domain }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const stepDelay = 1100
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i < LINES.length - 1 ? i + 1 : i))
    }, stepDelay)
    return () => window.clearInterval(id)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-5 py-20 sm:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[640px] max-w-[1180px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,113,227,0.18), transparent 65%)',
        }}
      />

      <div className="relative w-full max-w-[680px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9fd0ff]">
          Analysing
        </p>
        <h2
          className="mt-3 break-words text-ink"
          style={{
            fontSize: 'clamp(28px, 4.4vw, 48px)',
            lineHeight: 1.05,
            fontWeight: 300,
            letterSpacing: '-0.02em',
          }}
        >
          {domain}
        </h2>

        <ul className="mt-10 space-y-3">
          {LINES.map((line, idx) => {
            const state: 'done' | 'active' | 'pending' =
              idx < activeIdx ? 'done' : idx === activeIdx ? 'active' : 'pending'
            return (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: state === 'pending' ? 0.3 : 1,
                  x: 0,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: idx * 0.06 }}
                className="flex items-center gap-3 text-[15px]"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                    state === 'done'
                      ? 'bg-[#0071E3]/20 text-[#5cb3ff]'
                      : state === 'active'
                        ? 'bg-white/10 text-[#9fd0ff]'
                        : 'bg-white/[0.04] text-ink/30'
                  }`}
                >
                  {state === 'done' ? (
                    <Check size={14} strokeWidth={2.4} />
                  ) : state === 'active' ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={
                    state === 'done'
                      ? 'text-ink/82'
                      : state === 'active'
                        ? 'text-ink'
                        : 'text-ink/40'
                  }
                >
                  {line}
                </span>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </motion.section>
  )
}
