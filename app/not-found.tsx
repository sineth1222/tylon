import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-tylon-bg">
      <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-6">— ERROR</p>
      <div className="font-display text-[12rem] font-bold text-tylon-card leading-none mb-4 tracking-wider">404</div>
      <h1 className="font-display text-4xl font-bold tracking-[0.08em] text-tylon-primary uppercase mb-4">
        SECTOR NOT FOUND
      </h1>
      <p className="font-body text-tylon-muted max-w-sm mb-10 leading-relaxed">
        This position has been eliminated from the field. Return to base.
      </p>
      <Link href="/"
        className="border border-army text-tylon-primary px-10 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army transition-colors">
        RETURN TO BASE →
      </Link>
    </div>
  )
}
