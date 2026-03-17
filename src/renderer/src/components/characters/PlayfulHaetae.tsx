import React from 'react'

/**
 * 장난꾸러기 해태 — 노란 계열, 크고 반짝이는 눈, 흔들리는 꼬리
 */
export default function PlayfulHaetae(): React.JSX.Element {
  return (
    <svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      {/* 그림자 */}
      <ellipse cx="64" cy="124" rx="28" ry="5" fill="rgba(0,0,0,0.08)" />

      {/* 꼬리 — SVG 네이티브 애니메이션으로 항상 흔들림 */}
      <path d="M 86 98 Q 108 86 113 70 Q 118 58 106 54" stroke="#f59e0b" strokeWidth="9" fill="none" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 86 98; 10 86 98; -6 86 98; 4 86 98; 0 86 98"
          dur="0.9s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </path>
      {/* 꼬리 끝 털 */}
      <circle cx="106" cy="54" r="7" fill="#fef3c7">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 86 98; 10 86 98; -6 86 98; 4 86 98; 0 86 98"
          dur="0.9s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </circle>

      {/* 몸통 */}
      <ellipse cx="64" cy="100" rx="26" ry="22" fill="#fde68a" />

      {/* 앞발 */}
      <ellipse cx="46" cy="115" rx="11" ry="7" fill="#fef3c7" />
      <ellipse cx="82" cy="115" rx="11" ry="7" fill="#fef3c7" />

      {/* 갈기 — 더 풍성하게 */}
      <ellipse cx="64" cy="75" rx="26" ry="16" fill="#fef3c7" />

      {/* 귀 — 크고 쫑긋 */}
      <ellipse cx="32" cy="24" rx="12" ry="15" fill="#fde68a" />
      <ellipse cx="96" cy="24" rx="12" ry="15" fill="#fde68a" />
      {/* 귀 안쪽 */}
      <ellipse cx="32" cy="26" rx="7" ry="9" fill="#fda4af" />
      <ellipse cx="96" cy="26" rx="7" ry="9" fill="#fda4af" />

      {/* 머리 */}
      <circle cx="64" cy="54" r="32" fill="#fde68a" />

      {/* 뿔 — 조금 더 굵고 생생하게 */}
      <polygon points="64,4 57,27 71,27" fill="#fef9c3" stroke="#fcd34d" strokeWidth="1.5" />

      {/* 눈 — 크고 반짝이는 (장난꾸러기) */}
      <ellipse cx="50" cy="50" rx="10" ry="10" fill="white" />
      <ellipse cx="78" cy="50" rx="10" ry="10" fill="white" />
      {/* 홍채 */}
      <circle cx="50" cy="51" r="7" fill="#d97706" />
      <circle cx="78" cy="51" r="7" fill="#d97706" />
      {/* 동공 */}
      <circle cx="50" cy="51" r="4" fill="#0f172a" />
      <circle cx="78" cy="51" r="4" fill="#0f172a" />
      {/* 큰 반짝임 */}
      <circle cx="53" cy="47" r="2.5" fill="white" />
      <circle cx="81" cy="47" r="2.5" fill="white" />
      {/* 작은 별 반짝임 */}
      <circle cx="46" cy="54" r="1.2" fill="white" opacity="0.9" />
      <circle cx="74" cy="54" r="1.2" fill="white" opacity="0.9" />
      {/* 눈썹 — 올라간 느낌 */}
      <path d="M 42 39 Q 50 35 58 39" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 70 39 Q 78 35 86 39" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* 코 */}
      <ellipse cx="64" cy="62" rx="5" ry="4" fill="#d97706" />
      <ellipse cx="62" cy="61" rx="2" ry="1.5" fill="white" opacity="0.45" />

      {/* 입 — 활짝 웃음 */}
      <path d="M 54 67 Q 64 77 74 67" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* 볼 홍조 — 더 진하게 */}
      <ellipse cx="35" cy="59" rx="10" ry="6" fill="#fda4af" opacity="0.6" />
      <ellipse cx="93" cy="59" rx="10" ry="6" fill="#fda4af" opacity="0.6" />
    </svg>
  )
}
