// Inline SVG icon set for onboarding options.
// All icons share consistent stroke style; color is controlled via CSS currentColor.

const iconProps = {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// ── Genre icons ───────────────────────────────────────────────

export const IconRomance = () => (
  <svg {...iconProps}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export const IconLiterary = () => (
  <svg {...iconProps}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

export const IconDrama = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="6" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 11h.01" />
    <path d="M15 11h.01" />
    <path d="M8 21l4-7 4 7" />
    <path d="M6 21h12" />
  </svg>
)

export const IconMystery = () => (
  <svg {...iconProps}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="5" x2="12" y2="3" />
    <line x1="17" y1="7" x2="18.5" y2="5.5" />
    <line x1="7" y1="7" x2="5.5" y2="5.5" />
  </svg>
)

// ── Tone icons ────────────────────────────────────────────────

export const IconEmotional = () => (
  <svg {...iconProps}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    <path d="M12 12v4" strokeOpacity="0.5" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" strokeOpacity="0.5" />
  </svg>
)

export const IconHopeful = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

export const IconMelancholy = () => (
  <svg {...iconProps}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <path d="M9 16s.5-1 3-1 3 1 3 1" strokeOpacity="0.6" />
    <circle cx="9.5" cy="12" r="0.5" fill="currentColor" />
    <circle cx="14.5" cy="12" r="0.5" fill="currentColor" />
  </svg>
)

export const IconIntense = () => (
  <svg {...iconProps}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

// ── Mood icons ────────────────────────────────────────────────

export const IconTearjerker = () => (
  <svg {...iconProps}>
    <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.739-8z" />
  </svg>
)

export const IconHeartfelt = () => (
  <svg {...iconProps}>
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
)

export const IconBittersweet = () => (
  <svg {...iconProps}>
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </svg>
)

export const IconQuiet = () => (
  <svg {...iconProps}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34A16.23 16.23 0 0 0 2 22s1-.5 4-1c0 0 .5-5 7.5-8C16 11.5 17 8 17 8z" />
    <line x1="2" y1="22" x2="7" y2="17" />
    <path d="M17 8c0 0 2-2 5-2" strokeOpacity="0.5" />
  </svg>
)

// ── Lookup map ────────────────────────────────────────────────

export const ICONS = {
  romance:    IconRomance,
  literary:   IconLiterary,
  drama:      IconDrama,
  mystery:    IconMystery,
  emotional:  IconEmotional,
  hopeful:    IconHopeful,
  melancholy: IconMelancholy,
  intense:    IconIntense,
  tearjerker: IconTearjerker,
  heartfelt:  IconHeartfelt,
  bittersweet:IconBittersweet,
  quiet:      IconQuiet,
}
