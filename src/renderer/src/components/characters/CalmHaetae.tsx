import React from 'react'

/**
 * 차분한 해태 — 파란 계열, 반쯤 감긴 눈, 느린 호흡
 */
export default function CalmHaetae(): React.JSX.Element {
  return (
    <svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      {/* 그림자 */}
      <ellipse cx="64" cy="124" rx="28" ry="5" fill="rgba(0,0,0,0.08)" />

      {/* 몸통 */}
      <ellipse cx="64" cy="100" rx="26" ry="22" fill="#93c5fd" />

      {/* 앞발 */}
      <ellipse cx="46" cy="115" rx="11" ry="7" fill="#bfdbfe" />
      <ellipse cx="82" cy="115" rx="11" ry="7" fill="#bfdbfe" />

      {/* 갈기 (목 주변) */}
      <ellipse cx="64" cy="76" rx="23" ry="14" fill="#dbeafe" />

      {/* 귀 */}
      <ellipse cx="34" cy="26" rx="11" ry="14" fill="#93c5fd" />
      <ellipse cx="94" cy="26" rx="11" ry="14" fill="#93c5fd" />
      {/* 귀 안쪽 */}
      <ellipse cx="34" cy="28" rx="6" ry="8" fill="#fda4af" />
      <ellipse cx="94" cy="28" rx="6" ry="8" fill="#fda4af" />

      {/* 머리 */}
      <circle cx="64" cy="54" r="32" fill="#93c5fd" />

      {/* 뿔 */}
      <polygon points="64,5 58,27 70,27" fill="#e2e8f0" />
      <polygon points="64,7 60,27 68,27" fill="white" opacity="0.4" />

      {/* 눈 흰자 */}
      <ellipse cx="50" cy="51" rx="9" ry="8" fill="white" />
      <ellipse cx="78" cy="51" rx="9" ry="8" fill="white" />
      {/* 홍채 */}
      <ellipse cx="50" cy="53" rx="6" ry="5" fill="#1d4ed8" />
      <ellipse cx="78" cy="53" rx="6" ry="5" fill="#1d4ed8" />
      {/* 동공 */}
      <circle cx="50" cy="53" r="3" fill="#0f172a" />
      <circle cx="78" cy="53" r="3" fill="#0f172a" />
      {/* 눈 반짝임 */}
      <circle cx="52" cy="51" r="1.5" fill="white" />
      <circle cx="80" cy="51" r="1.5" fill="white" />
      {/* 눈꺼풀 (반쯤 감긴 — calm) */}
      <ellipse cx="50" cy="47" rx="9.5" ry="8" fill="#93c5fd" />
      <ellipse cx="78" cy="47" rx="9.5" ry="8" fill="#93c5fd" />
      {/* 눈썹 — 완만하게 내려간 */}
      <path d="M 43 40 Q 50 38 57 40" stroke="#1d4ed8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 71 40 Q 78 38 85 40" stroke="#1d4ed8" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* 코 */}
      <ellipse cx="64" cy="63" rx="5" ry="4" fill="#1d4ed8" />
      <ellipse cx="62" cy="62" rx="2" ry="1.5" fill="white" opacity="0.45" />

      {/* 입 — 잔잔한 미소 */}
      <path d="M 57 68 Q 64 74 71 68" stroke="#1d4ed8" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 볼 홍조 */}
      <ellipse cx="36" cy="60" rx="9" ry="5.5" fill="#fda4af" opacity="0.45" />
      <ellipse cx="92" cy="60" rx="9" ry="5.5" fill="#fda4af" opacity="0.45" />
    </svg>
  )
}
