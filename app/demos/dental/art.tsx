// Simple illustrated people used in place of photos.

type PersonProps = {
  skin: string;
  hair: string;
  scrubs?: string;
  className?: string;
};

export function Person({ skin, hair, scrubs = "#6f7a86", className }: PersonProps) {
  return (
    <svg viewBox="0 0 200 260" aria-hidden="true" className={className}>
      <path d="M24 260 C24 192 68 166 100 166 C132 166 176 192 176 260 Z" fill={scrubs} />
      <path d="M84 150 h32 v24 c0 9 -32 9 -32 0 z" fill={skin} />
      <ellipse cx="100" cy="106" rx="40" ry="48" fill={skin} />
      <path d="M57 102 C52 54 90 38 114 44 C142 50 152 82 143 110 C139 86 121 72 100 72 C80 72 65 83 57 102 Z" fill={hair} />
      <circle cx="86" cy="110" r="3.5" fill="#2b2b2b" />
      <circle cx="114" cy="110" r="3.5" fill="#2b2b2b" />
      <path d="M86 128 Q100 140 114 128" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M92 168 L100 190 L108 168" stroke="#49c4d2" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
