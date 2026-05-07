import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

interface Props {
  initialDomain: string
  onAnalyse: (domain: string) => void
  error: string | null
}

export function InputStep({ initialDomain, onAnalyse, error }: Props) {
  const [value, setValue] = useState(initialDomain)

  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed.length < 4) return
    onAnalyse(trimmed)
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-5 py-20 sm:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[640px] max-w-[1180px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,113,227,0.22), transparent 65%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[920px] text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9fd0ff]">
          <Sparkles size={13} strokeWidth={2} />
          SEO Potential Analyser
        </span>

        <h1
          className="mt-7 text-ink"
          style={{
            fontSize: 'clamp(38px, 6.4vw, 84px)',
            lineHeight: 1.02,
            fontWeight: 300,
            letterSpacing: '-0.025em',
          }}
        >
          Where's your website?
        </h1>

        <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-[1.55] text-ink/64 sm:text-[17px]">
          One domain. Ninety seconds. The number on the table from search you're not capturing.
        </p>

        <form onSubmit={handle} className="mx-auto mt-10 w-full max-w-[640px]">
          <div className="relative flex w-full flex-col gap-3 rounded-[28px] border border-white/15 bg-white/[0.04] p-2 shadow-[0_28px_70px_-34px_rgba(0,113,227,0.55),0_1px_0_rgba(255,255,255,0.08)_inset] sm:flex-row sm:items-center sm:rounded-pill sm:p-2">
            <input
              type="text"
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              placeholder="meinrestaurant-koeln.de"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Website domain"
              className="flex-1 rounded-2xl bg-transparent px-5 py-4 text-[18px] text-ink placeholder-ink/35 outline-none sm:rounded-pill sm:py-3.5 sm:text-[19px]"
            />
            <button
              type="submit"
              disabled={value.trim().length < 4}
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-[#0071E3] px-7 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0077ED] hover:shadow-[0_14px_34px_-10px_rgba(0,113,227,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Analyse
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {error ? (
          <p
            role="alert"
            className="mx-auto mt-5 max-w-[520px] rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-[13px] leading-[1.5] text-red-200"
          >
            {error}
          </p>
        ) : (
          <p className="mt-5 text-[12px] uppercase tracking-[0.14em] text-ink/40">
            Real PageSpeed signals · Industry-standard CTR maths · 8 free runs/day per visitor
          </p>
        )}
      </motion.div>
    </motion.section>
  )
}
