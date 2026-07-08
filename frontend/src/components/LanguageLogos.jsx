export const LanguageLogos = {
  javascript: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
      <path d="M21.2 23.4c.6 1 1.4 1.7 2.8 1.7 1.2 0 1.9-.6 1.9-1.4 0-1-.8-1.3-2.1-1.9l-.7-.3c-2.1-.9-3.5-2-3.5-4.3 0-2.2 1.7-3.8 4.2-3.8 1.8 0 3.2.6 4.1 2.2l-2.1 1.4c-.5-.9-1-1.2-1.9-1.2-.9 0-1.4.5-1.4 1.2 0 .8.5 1.2 1.7 1.7l.7.3c2.5 1 3.9 2.1 3.9 4.5 0 2.6-2 4-4.8 4-2.7 0-4.5-1.3-5.3-3l2.3-1.3zm-7.2 0c.5.9.9 1.6 1.9 1.6 1 0 1.6-.4 1.6-1.9v-9.6h2.7v9.8c0 2.7-1.6 3.9-3.9 3.9-2.1 0-3.3-1.1-3.9-2.4l2.6-1.4z" fill="#323330"/>
    </svg>
  ),
  
  python: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <path d="M15.8 2C9.4 2 9.8 4.7 9.8 4.7v3.2h6.1v1H8.2S4 8.6 4 15.4s3.6 6.9 3.6 6.9h2.1v-3.3s-.1-3.6 3.5-3.6h6.1s3.4 0 3.4-3.3V5.3S22.7 2 15.8 2zm-3.4 2.6c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4-1.4-.6-1.4-1.4.6-1.4 1.4-1.4z" fill="#3776AB"/>
      <path d="M16.2 30c6.4 0 6-2.7 6-2.7v-3.2h-6.1v-1h7.7s4.2-1.1 4.2-7.9-3.6-6.9-3.6-6.9h-2.1v3.3s.1 3.6-3.5 3.6h-6.1s-3.4 0-3.4 3.3v6.5S9.3 30 16.2 30zm3.4-2.6c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4z" fill="#FFD43B"/>
    </svg>
  ),
  
  ruby: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <path d="M4 4h24v24H4z" fill="#CC342D"/>
      <path d="M8 8l8 8-8 8" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <path d="M24 8l-8 8 8 8" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="3" fill="#fff"/>
    </svg>
  ),
  
  go: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="14" fill="#00ADD8"/>
      <path d="M11.5 10c-.8 0-1.5.7-1.5 1.5v9c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zm9 0c-.8 0-1.5.7-1.5 1.5v9c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5z" fill="#fff"/>
      <circle cx="12" cy="10" r="1.5" fill="#fff"/>
      <circle cx="20" cy="10" r="1.5" fill="#fff"/>
    </svg>
  ),
  
  java: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <rect width="32" height="32" rx="4" fill="#ED8B00"/>
      <path d="M10 22c0 0 1 1.5 6 1.5s6-1.5 6-1.5v-2s-1 1.5-6 1.5-6-1.5-6-1.5v2z" fill="#5382A1"/>
      <path d="M11 16s1 3 5 3 5-3 5-3v-2s-1 2-5 2-5-2-5-2v2z" fill="#5382A1"/>
      <path d="M9 11s2 4 7 4 7-4 7-4V9s-2 3-7 3-7-3-7-3v2z" fill="#5382A1"/>
    </svg>
  ),
  
  php: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <rect width="32" height="32" rx="4" fill="#777BB4"/>
      <text x="16" y="22" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="Arial">php</text>
    </svg>
  ),
  
  csharp: ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <rect width="32" height="32" rx="4" fill="#512BD4"/>
      <text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" fontFamily="Arial">C#</text>
    </svg>
  ),
};

export function getLanguageLogo(language) {
  const logoMap = {
    express: 'javascript',
    flask: 'python',
    fastapi: 'python',
    django: 'python',
    rails: 'ruby',
    gin: 'go',
    echo: 'go',
    nethttp: 'go',
    spring: 'java',
    laravel: 'php',
    aspnet: 'csharp',
  };
  
  const key = logoMap[language] || 'javascript';
  return LanguageLogos[key];
}
