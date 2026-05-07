import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Loader2, RotateCcw, TrendingUp } from 'lucide-react'
import type { AnalysisResult, KeywordRow } from '../lib/types'

interface Props {
  result: AnalysisResult
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  sending: boolean
  captureError: string | null
  onReset: () => void
}

const RANK_LABEL: Record<KeywordRow['currentRankBand'], string> = {
  top3: 'Top 3',
  page1: 'Page 1',
  'page2-3': 'Page 2–3',
  page4plus: 'Page 4+',
  unranked: 'Not ranking',
}

const RANK_COLOUR: Record<KeywordRow['currentRankBand'], string> = {
  top3: '#22c55e',
  page1: '#5cb3ff',
  'page2-3': '#f59e0b',
  page4plus: '#ef4444',
  unranked: '#6e6e73',
}

const formatGbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)

export function ResultsStep({ result, onSubmit, sending, captureError, onReset }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <Reveal result={result} />
      <Breakdown result={result} />
      <Capture
        result={result}
        onSubmit={onSubmit}
        sending={sending}
        captureError={captureError}
      />
      <div className="mx-auto flex w-full max-w-[1180px] justify-center px-5 pb-20 sm:px-8">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/55 transition-colors hover:text-ink"
        >
          <RotateCcw size={14} />
          Run another analysis
        </button>
      </div>
    </motion.section>
  )
}

/* --------------------------------- REVEAL --------------------------------- */

function Reveal({ result }: { result: AnalysisResult }) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? result.monthlyOpportunityGbp : 0)
  const [showMaths, setShowMaths] = useState(false)

  useEffect(() => {
    if (reduce) {
      setDisplay(result.monthlyOpportunityGbp)
      return
    }
    const start = performance.now()
    const duration = 1800
    const target = result.monthlyOpportunityGbp
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [result.monthlyOpportunityGbp, reduce])

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[680px] max-w-[1180px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,113,227,0.28), transparent 62%)',
        }}
      />
      <div className="relative mx-auto flex w-full max-w-[1080px] flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9fd0ff]">
          <TrendingUp size={13} strokeWidth={2} />
          {result.domain} · {result.inferredIndustry} · {result.inferredLocation}
        </span>

        <p className="mt-8 text-[13px] uppercase tracking-[0.16em] text-ink/55">
          Estimated revenue you're missing per month
        </p>

        <div
          className="mt-3 text-ink"
          style={{
            fontSize: 'clamp(64px, 13vw, 180px)',
            lineHeight: 0.96,
            fontWeight: 200,
            letterSpacing: '-0.04em',
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}
        >
          {formatGbp(display)}
        </div>
        <p className="mt-2 text-[15px] text-ink/55">/ month in untapped search demand</p>

        <button
          type="button"
          onClick={() => setShowMaths((v) => !v)}
          className="mt-6 text-[12px] uppercase tracking-[0.14em] text-[#9fd0ff] transition-colors hover:text-ink"
        >
          {showMaths ? 'Hide' : 'How we calculated this'}
        </button>

        {showMaths && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5 max-w-[700px] rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left text-[13px] leading-[1.6] text-ink/72"
          >
            <p>
              Sum across keywords of: <em>monthly searches × CTR at target position × industry
              conversion rate × industry AOV</em>, minus current estimated value at current
              position.
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                · CTR curve source: <span className="text-ink/90">{result.calculation.ctrCurveSource}</span>
              </li>
              <li>
                · Industry conversion rate used:{' '}
                <span className="text-ink/90">
                  {(result.calculation.industryConversionRate * 100).toFixed(1)}%
                </span>
              </li>
              <li>
                · Industry AOV used:{' '}
                <span className="text-ink/90">{formatGbp(result.calculation.industryAovGbp)}</span>
              </li>
            </ul>
            <p className="mt-3 text-ink/55">{result.calculation.notes}</p>
          </motion.div>
        )}

        <div className="mt-12 w-full max-w-[860px]">
          <NinetyDayCurve
            currentValue={result.current.estMonthlyTrafficValueGbp}
            projectedValue={result.projected.estMonthlyTrafficValueGbp}
            timelineDays={result.projected.timelineDays}
          />
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- 90-DAY CURVE ------------------------------- */

function NinetyDayCurve({
  currentValue,
  projectedValue,
  timelineDays,
}: {
  currentValue: number
  projectedValue: number
  timelineDays: number
}) {
  const reduce = useReducedMotion()
  const w = 860
  const h = 240
  const padX = 56
  const padY = 36

  const range = Math.max(projectedValue - currentValue, 1)
  const yFor = (v: number) => {
    const minY = padY
    const maxY = h - padY
    const t = (v - currentValue) / range
    return maxY - t * (maxY - minY)
  }
  const xFor = (day: number) => padX + (day / timelineDays) * (w - padX * 2)

  const samples = 24
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= samples; i++) {
    const day = (i / samples) * timelineDays
    const t = i / samples
    const eased = 1 - Math.pow(1 - t, 1.7)
    const v = currentValue + eased * range
    pts.push([xFor(day), yFor(v)])
  }
  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const areaD = `${pathD} L${xFor(timelineDays).toFixed(1)},${(h - padY).toFixed(1)} L${xFor(0).toFixed(1)},${(h - padY).toFixed(1)} Z`

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/55">
          90-day projection
        </p>
        <p className="text-[12px] text-ink/55">Today → Day {timelineDays}</p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" role="img" aria-label="90-day projection">
        <defs>
          <linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0071E3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0071E3" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={padX}
            x2={w - padX}
            y1={padY + p * (h - padY * 2)}
            y2={padY + p * (h - padY * 2)}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 5"
          />
        ))}

        <motion.path
          d={areaD}
          fill="url(#curve-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 0.6 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke="#5cb3ff"
          strokeWidth={2.2}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
        />

        <circle cx={xFor(0)} cy={yFor(currentValue)} r={5} fill="#9fd0ff" />
        <text
          x={xFor(0) - 8}
          y={yFor(currentValue) + 22}
          textAnchor="end"
          fill="rgba(244,238,251,0.7)"
          fontSize="11"
        >
          Today · {formatGbp(currentValue)}/mo
        </text>

        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduce ? 0 : 1.7 }}
        >
          <circle cx={xFor(timelineDays)} cy={yFor(projectedValue)} r={6} fill="#5cb3ff" />
          <circle cx={xFor(timelineDays)} cy={yFor(projectedValue)} r={12} fill="#5cb3ff" fillOpacity="0.18" />
          <text
            x={xFor(timelineDays) - 8}
            y={yFor(projectedValue) - 14}
            textAnchor="end"
            fill="#f4eefb"
            fontSize="13"
            fontWeight="500"
          >
            Day {timelineDays} · {formatGbp(projectedValue)}/mo
          </text>
        </motion.g>
      </svg>
    </div>
  )
}

/* -------------------------------- BREAKDOWN ------------------------------- */

type Tab = 'rankings' | 'money' | 'blockers'

function Breakdown({ result }: { result: AnalysisResult }) {
  const [tab, setTab] = useState<Tab>('rankings')

  return (
    <div className="relative bg-[#f7f9fc] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1080px] px-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0071E3]">
          The breakdown
        </p>
        <h3
          className="mt-2 max-w-[640px] text-[#1d1d1f]"
          style={{
            fontSize: 'clamp(28px, 3.4vw, 44px)',
            lineHeight: 1.08,
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          Why that number isn't made up.
        </h3>

        <div className="mt-7 inline-flex flex-wrap gap-1.5 rounded-pill border border-black/[0.08] bg-white p-1 shadow-[0_1px_2px_rgba(15,15,30,0.04)]">
          <TabButton id="rankings" current={tab} onClick={setTab}>
            Where you rank now
          </TabButton>
          <TabButton id="money" current={tab} onClick={setTab}>
            Money on the table
          </TabButton>
          <TabButton id="blockers" current={tab} onClick={setTab}>
            What's blocking you
          </TabButton>
        </div>

        <div className="mt-7">
          {tab === 'rankings' && <RankingsView result={result} />}
          {tab === 'money' && <MoneyView result={result} />}
          {tab === 'blockers' && <BlockersView result={result} />}
        </div>
      </div>
    </div>
  )
}

function TabButton({
  id,
  current,
  onClick,
  children,
}: {
  id: Tab
  current: Tab
  onClick: (t: Tab) => void
  children: React.ReactNode
}) {
  const active = id === current
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`rounded-pill px-4 py-2 text-[13px] font-medium transition-colors ${
        active ? 'bg-[#0071E3] text-white' : 'text-[#1d1d1f] hover:bg-black/[0.04]'
      }`}
    >
      {children}
    </button>
  )
}

function RankingsView({ result }: { result: AnalysisResult }) {
  return (
    <ul className="space-y-3">
      {result.keywords.map((k, idx) => (
        <motion.li
          key={k.keyword}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
          className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[15px] font-medium text-[#1d1d1f]">{k.keyword}</span>
            <span className="text-[12px] font-medium text-[#6e6e73]">
              {k.monthlySearches.toLocaleString('en-GB')} searches/mo
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: RANK_COLOUR[k.currentRankBand] }}
                initial={{ width: 0 }}
                animate={{ width: rankWidth(k.currentRankBand) }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + idx * 0.05 }}
              />
            </div>
            <span
              className="rounded-pill px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{
                backgroundColor: `${RANK_COLOUR[k.currentRankBand]}1f`,
                color: RANK_COLOUR[k.currentRankBand],
              }}
            >
              {RANK_LABEL[k.currentRankBand]}
            </span>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

function rankWidth(band: KeywordRow['currentRankBand']) {
  switch (band) {
    case 'top3':
      return '100%'
    case 'page1':
      return '78%'
    case 'page2-3':
      return '38%'
    case 'page4plus':
      return '12%'
    case 'unranked':
      return '4%'
  }
}

function MoneyView({ result }: { result: AnalysisResult }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#fbfbfd] text-[11px] uppercase tracking-[0.1em] text-[#86868b]">
              <th className="px-5 py-3 font-semibold">Keyword</th>
              <th className="px-5 py-3 text-right font-semibold">Searches/mo</th>
              <th className="px-5 py-3 text-right font-semibold">Now</th>
              <th className="px-5 py-3 text-right font-semibold">If Page 1</th>
              <th className="px-5 py-3 text-right font-semibold">£/mo</th>
            </tr>
          </thead>
          <tbody>
            {result.keywords.map((k) => (
              <tr key={k.keyword} className="border-b border-black/[0.04] last:border-b-0">
                <td className="px-5 py-3.5 text-[#1d1d1f]">{k.keyword}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[#6e6e73]">
                  {k.monthlySearches.toLocaleString('en-GB')}
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[#6e6e73]">
                  {k.estCurrentClicks} clicks
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums text-[#6e6e73]">
                  {k.estPage1Clicks} clicks
                </td>
                <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-[#0071E3]">
                  {formatGbp(k.estMonthlyValueGbp)}
                </td>
              </tr>
            ))}
            <tr className="bg-[#eef5ff]">
              <td colSpan={4} className="px-5 py-3.5 text-right font-semibold text-[#1d1d1f]">
                Total monthly opportunity
              </td>
              <td className="px-5 py-3.5 text-right tabular-nums text-[15px] font-semibold text-[#0071E3]">
                {formatGbp(result.monthlyOpportunityGbp)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BlockersView({ result }: { result: AnalysisResult }) {
  const impactStyle = {
    high: { bg: '#fef2f2', text: '#b91c1c', label: 'High impact' },
    medium: { bg: '#fff7ed', text: '#c2410c', label: 'Medium impact' },
    low: { bg: '#f0f9ff', text: '#0369a1', label: 'Low impact' },
  } as const
  return (
    <ul className="space-y-3">
      {result.blockers.map((b, idx) => {
        const s = impactStyle[b.impact]
        return (
          <motion.li
            key={b.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="rounded-2xl border border-black/[0.06] bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-medium text-[#1d1d1f]">{b.title}</span>
              <span
                className="rounded-pill px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                {s.label}
              </span>
            </div>
            <p className="mt-2 text-[13.5px] leading-[1.55] text-[#6e6e73]">{b.detail}</p>
          </motion.li>
        )
      })}
    </ul>
  )
}

/* --------------------------------- CAPTURE -------------------------------- */

function Capture({
  result,
  onSubmit,
  sending,
  captureError,
}: {
  result: AnalysisResult
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  sending: boolean
  captureError: string | null
}) {
  const formRef = useRef<HTMLDivElement>(null)
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <>
      <div className="relative bg-black py-20" ref={formRef} id="capture">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-[1180px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(0,113,227,0.18), transparent 65%)',
          }}
        />
        <div className="relative mx-auto w-full max-w-[680px] px-5 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9fd0ff]">
            The 90-day roadmap
          </p>
          <h3
            className="mt-3 text-ink"
            style={{
              fontSize: 'clamp(28px, 3.6vw, 44px)',
              lineHeight: 1.08,
              fontWeight: 300,
              letterSpacing: '-0.02em',
            }}
          >
            Want the full roadmap?
          </h3>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-[1.55] text-ink/64">
            The detailed plan to capture this {formatGbp(result.monthlyOpportunityGbp)}/month — keyword by keyword, blocker by blocker, in 90 days.
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 w-full max-w-[460px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left"
          >
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/55">
                Name
              </span>
              <input
                name="name"
                required
                placeholder="Your full name"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-ink placeholder-ink/30 outline-none transition-colors focus:border-[#5cb3ff]/60 focus:bg-white/[0.08]"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/55">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[15px] text-ink placeholder-ink/30 outline-none transition-colors focus:border-[#5cb3ff]/60 focus:bg-white/[0.08]"
              />
            </label>

            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            {captureError && (
              <div
                role="alert"
                className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-200"
              >
                {captureError}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-pill bg-[#0071E3] px-6 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:bg-[#0077ED] hover:shadow-[0_14px_34px_-10px_rgba(0,113,227,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send me the roadmap
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-ink/40">
              No spam. We email it once and follow up only if you ask.
            </p>
          </form>
        </div>
      </div>

      <StickyCta opportunity={result.monthlyOpportunityGbp} onScrollToForm={scrollToForm} />
    </>
  )
}

function StickyCta({
  opportunity,
  onScrollToForm,
}: {
  opportunity: number
  onScrollToForm: () => void
}) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const halfwayDown = window.scrollY > window.innerHeight * 0.6
      const nearForm = (() => {
        const el = document.getElementById('capture')
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      })()
      setShown(halfwayDown && !nearForm)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ y: shown ? 0 : 120, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4"
    >
      <button
        type="button"
        onClick={onScrollToForm}
        className="pointer-events-auto inline-flex items-center gap-3 rounded-pill border border-white/10 bg-[#0b1220]/90 px-4 py-3 text-[13px] font-medium text-ink shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)] backdrop-blur transition-all hover:bg-[#0b1220]"
      >
        <span className="text-ink/60">Capture {formatGbp(opportunity)}/mo</span>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-[#0071E3] px-3 py-1.5 text-white">
          Get the roadmap
          <ArrowRight size={13} />
        </span>
      </button>
    </motion.div>
  )
}
