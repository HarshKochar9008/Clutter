/** Subtle contour-line texture for dark landing (matches brand style guide). */
const TopographicBg = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden
  >
    <svg
      className="h-full w-full opacity-[0.14]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#030303" />
      {[
        'M-50,120 Q200,80 450,130 T950,110',
        'M-50,200 Q180,160 420,210 T980,190',
        'M-50,280 Q220,240 460,290 T970,270',
        'M-50,360 Q160,320 400,370 T960,350',
        'M-50,440 Q240,400 480,450 T990,430',
        'M80,-20 Q120,200 100,500',
        'M320,-20 Q280,220 300,520',
        'M560,-20 Q520,240 540,520',
        'M800,-20 Q760,200 780,520',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {[
        'M-30,60 Q250,40 500,70 T1030,50',
        'M-30,520 Q200,500 480,530 T1020,510',
      ].map((d, i) => (
        <path
          key={`e-${i}`}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}
    </svg>
  </div>
)

export default TopographicBg
