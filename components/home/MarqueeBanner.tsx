export default function MarqueeBanner() {
  return (
    <div className="bg-tylon-secondary border-b border-tylon-border py-2.5 overflow-hidden">
      <div className="marquee-container">
        <div className="inline-block animate-marquee whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 mr-10 font-mono text-[9px] tracking-[0.35em] uppercase text-tylon-muted">
              TYLON <span className="text-army">◆</span>
              WEAR YOUR MISSION <span className="text-army">◆</span>
              NEW DROPS AVAILABLE <span className="text-army">◆</span>
              CASH ON DELIVERY <span className="text-army">◆</span>
              MADE IN SRI LANKA <span className="text-army">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
