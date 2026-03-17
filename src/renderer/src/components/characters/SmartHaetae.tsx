import React from 'react'

/**
 * 똑똑한 해태 — 청록 계열, 안경, 분석적인 표정
 */
export default function SmartHaetae(): React.JSX.Element {
  return (
    <svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      {/* 그림자 */}
      <ellipse cx="64" cy="124" rx="28" ry="5" fill="rgba(0,0,0,0.08)" />

      {/* 몸통 */}
      <ellipse cx="64" cy="100" rx="26" ry="22" fill="#a5f3fc" />

      {/* 앞발 */}
      <ellipse cx="46" cy="115" rx="11" ry="7" fill="#cffafe" />
      <ellipse cx="82" cy="115" rx="11" ry="7" fill="#cffafe" />

      {/* 갈기 */}
      <ellipse cx="64" cy="76" rx="23" ry="14" fill="#cffafe" />

      {/* 귀 */}
      <ellipse cx="34" cy="26" rx="11" ry="14" fill="#a5f3fc" />
      <ellipse cx="94" cy="26" rx="11" ry="14" fill="#a5f3fc" />
      {/* 귀 안쪽 */}
      <ellipse cx="34" cy="28" rx="6" ry="8" fill="#fda4af" />
      <ellipse cx="94" cy="28" rx="6" ry="8" fill="#fda4af" />

      {/* 머리 */}
      <circle cx="64" cy="54" r="32" fill="#a5f3fc" />

      {/* 뿔 — 날카롭게 */}
      <polygon points="64,4 59,27 69,27" fill="#e2e8f0" />
      <polygon points="64,6 61,27 67,27" fill="white" opacity="0.4" />

      {/* 눈 흰자 */}
      <ellipse cx="50" cy="51" rx="8.5" ry="8" fill="white" />
      <ellipse cx="78" cy="51" rx="8.5" ry="8" fill="white" />
      {/* 홍채 */}
      <circle cx="50" cy="52" r="5.5" fill="#0891b2" />
      <circle cx="78" cy="52" r="5.5" fill="#0891b2" />
      {/* 동공 */}
      <circle cx="50" cy="52" r="3" fill="#0f172a" />
      <circle cx="78" cy="52" r="3" fill="#0f172a" />
      {/* 눈 반짝임 */}
      <circle cx="52" cy="50" r="1.5" fill="white" />
      <circle cx="80" cy="50" r="1.5" fill="white" />
      {/* 눈썹 — 한쪽 살짝 올라간 (분석적) */}
      <path d="M 43 40 Q 50 37 57 39" stroke="#0891b2" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 71 38 Q 78 37 85 40" stroke="#0891b2" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* 안경 — 각진 테 */}
      {/* 왼쪽 렌즈 */}
      <rect x="40" y="44" width="20" height="14" rx="3" fill="none" stroke="#0891b2" strokeWidth="2" />
      {/* 오른쪽 렌즈 */}
      <rect x="68" y="44" width="20" height="14" rx="3" fill="none" stroke="#0891b2" strokeWidth="2" />
      {/* 브리지 */}
      <line x1="60" y1="51" x2="68" y2="51" stroke="#0891b2" strokeWidth="2" />
      {/* 안경다리 */}
      <line x1="40" y1="51" x2="34" y2="50" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="51" x2="95" y2="50" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />

      {/* 코 */}
      <ellipse cx="64" cy="63" rx="5" ry="4" fill="#0891b2" />
      <ellipse cx="62" cy="62" rx="2" ry="1.5" fill="white" opacity="0.45" />

      {/* 입 — 살짝 한쪽이 올라간 스마크 */}
      <path d="M 57 68 Q 62 71 71 67" stroke="#0891b2" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 볼 홍조 — 아주 은은하게 */}
      <ellipse cx="36" cy="60" rx="8.5" ry="5" fill="#fda4af" opacity="0.3" />
      <ellipse cx="92" cy="60" rx="8.5" ry="5" fill="#fda4af" opacity="0.3" />
    </svg>
  )
}
