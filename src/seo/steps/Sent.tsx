import { motion } from 'framer-motion'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import type { AnalysisResult } from '../lib/types'

interface Props {
  result: AnalysisResult
  onReset: () => void
}

const formatGbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

export function SentStep({ result, onReset }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-5 py-20 text-center sm:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[640px] max-w-[1180px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.16), transparent 65%)',
        }}
      />

      <div className="relative w-full max-w-[640px]">
        <span className="grid h-16 w-16 mx-auto place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 size={28} strokeWidth={1.6} />
        </span>

        <h2
          className="mt-7 text-ink"
          style={{
            fontSize: 'clamp(32px, 4.4vw, 52px)',
            lineHeight: 1.05,
            fontWeight: 300,
            letterSpacing: '-0.02em',
          }}
        >
          Roadmap on the way.
        </h2>
        <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-[1.55] text-ink/64 sm:text-[16px]">
          We're putting together your detailed 90-day plan to capture{' '}
          <span className="text-ink/90">{formatGbp(result.monthlyOpportunityGbp)}/month</span>{' '}
          for {result.domain}. Expect it in your inbox within one working day.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-10 inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.04] px-5 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-white/[0.08]"
        >
          <RotateCcw size={14} />
          Analyse another site
        </button>
      </div>
    </motion.section>
  )
}
