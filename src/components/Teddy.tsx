type TeddyProps = { size?: number; className?: string };

/** Teddy bear pastel yang lagi meluk hati. */
export default function Teddy({ size = 200, className = "" }: TeddyProps) {
  const fur = "#e6b88a";
  const light = "#fbe6d3";
  return (
    <svg className={`teddy ${className}`} width={size} height={size * 1.1} viewBox="0 0 200 220" role="img" aria-label="teddy bear memeluk hati" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="212" rx="62" ry="6" fill="#e9b7c6" opacity=".35" />
      <circle cx="60" cy="44" r="21" fill={fur} />
      <circle cx="140" cy="44" r="21" fill={fur} />
      <circle cx="60" cy="44" r="11" fill="#f3c3c8" />
      <circle cx="140" cy="44" r="11" fill="#f3c3c8" />
      <ellipse cx="68" cy="198" rx="21" ry="14" fill={fur} />
      <ellipse cx="132" cy="198" rx="21" ry="14" fill={fur} />
      <ellipse cx="100" cy="160" rx="48" ry="44" fill={fur} />
      <ellipse cx="100" cy="166" rx="30" ry="30" fill={light} />
      <circle cx="100" cy="82" r="50" fill={fur} />
      <ellipse cx="100" cy="98" rx="21" ry="16" fill={light} />
      <ellipse cx="100" cy="92" rx="7" ry="5" fill="#7b4a3b" />
      <path d="M100 97 V102 M100 102 Q93 109 87 104 M100 102 Q107 109 113 104" stroke="#7b4a3b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="76" r="5" fill="#4a2d28" />
      <circle cx="120" cy="76" r="5" fill="#4a2d28" />
      <circle cx="81.6" cy="74.4" r="1.6" fill="#fff" />
      <circle cx="121.6" cy="74.4" r="1.6" fill="#fff" />
      <circle cx="66" cy="94" r="8" fill="#f7a6bd" opacity=".65" />
      <circle cx="134" cy="94" r="8" fill="#f7a6bd" opacity=".65" />
      <path d="M100 130 L78 119 Q74 130 78 141 Z" fill="#f58fb0" />
      <path d="M100 130 L122 119 Q126 130 122 141 Z" fill="#f58fb0" />
      <circle cx="100" cy="130" r="5.5" fill="#e0709a" />
      <path className="teddy-heart" d="M100 190 C70 168 78 146 100 160 C122 146 130 168 100 190 Z" fill="#ee7da3" />
      <ellipse cx="90" cy="162" rx="4" ry="2.4" fill="#fff" opacity=".55" transform="rotate(-25 90 162)" />
      <ellipse cx="62" cy="155" rx="13" ry="26" fill={fur} transform="rotate(-28 62 155)" />
      <ellipse cx="138" cy="155" rx="13" ry="26" fill={fur} transform="rotate(28 138 155)" />
    </svg>
  );
}
