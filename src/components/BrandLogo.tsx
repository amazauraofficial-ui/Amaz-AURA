import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const isDarkBg = variant === 'light'; // Light text on dark bg

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Sculpted Luxury Emblem: Gold "A" with Emerald Wave and Gold Leaf */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Gold Ring */}
          <circle cx="50" cy="50" r="46" stroke="#C9A24A" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="44" fill="#042D22" />

          {/* Letter 'A' Left Stem & Right Leg */}
          <path
            d="M50 18L26 78H36L44 56H56L64 78H74L50 18Z"
            fill="url(#goldGradient)"
          />

          {/* Inner Triangle Counter */}
          <path d="M50 32L46 48H54L50 32Z" fill="#042D22" />

          {/* Emerald Silk Wave Crossbar */}
          <path
            d="M24 64C34 54 48 50 60 55C68 59 74 58 78 54C75 58 68 64 58 62C46 59 34 64 24 64Z"
            fill="#063D2E"
            stroke="#C9A24A"
            strokeWidth="1.2"
          />

          {/* Botanical Gold Leaf Sprig */}
          <path
            d="M62 46C65 38 72 34 76 33C75 39 71 45 64 47C63 47 62 46 62 46Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M68 47C72 43 78 41 81 41C80 46 76 50 70 51C69 50 68 48 68 47Z"
            fill="#0A5C46"
            stroke="#C9A24A"
            strokeWidth="0.8"
          />

          <defs>
            <linearGradient id="goldGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5D77F" />
              <stop offset="0.5" stopColor="#C9A24A" />
              <stop offset="1" stopColor="#9C7728" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark and Tagline */}
      <div className="flex flex-col">
        <span
          className={`font-editorial font-bold tracking-tight leading-none ${textSizes[size]} ${
            isDarkBg ? 'text-white' : 'text-[#063D2E]'
          }`}
        >
          Amazaura
        </span>
        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-medium pt-1 ${
              isDarkBg ? 'text-[#C9A24A]' : 'text-[#8C6D2B]'
            }`}
          >
            Curated Finds · Elevated Everyday
          </span>
        )}
      </div>
    </div>
  );
};
