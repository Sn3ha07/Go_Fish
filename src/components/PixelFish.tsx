import React from 'react';

export type CuteFishType = 'goldie' | 'puffer' | 'bluefin' | 'jelly' | 'clown' | 'whale';

export interface CuteFishData {
  id: string;
  name: string;
  type: CuteFishType;
  color: string;
  bellyColor: string;
  accentColor: string;
  personality: string;
  tag: string;
  nfcUid: string;
}

export const CUTE_FISH_ROSTER: CuteFishData[] = [
  {
    id: 'goldie',
    name: 'Goldie',
    type: 'goldie',
    color: '#ff9f1c',
    bellyColor: '#ffe5b4',
    accentColor: '#e05a00',
    personality: 'Friendly & Quick',
    tag: 'Quick Wins',
    nfcUid: 'TAG-01'
  },
  {
    id: 'puffer',
    name: 'Puff',
    type: 'puffer',
    color: '#ff6584',
    bellyColor: '#ffd1dc',
    accentColor: '#c72c48',
    personality: 'Chubby & Cheerful',
    tag: 'Big Tasks',
    nfcUid: 'TAG-02'
  },
  {
    id: 'bluefin',
    name: 'Finn',
    type: 'bluefin',
    color: '#3a86ff',
    bellyColor: '#cce3ff',
    accentColor: '#1d4ed8',
    personality: 'Swift & Focused',
    tag: 'Urgent Deadlines',
    nfcUid: 'TAG-03'
  },
  {
    id: 'jelly',
    name: 'Boba',
    type: 'jelly',
    color: '#2ec4b6',
    bellyColor: '#cbf3f0',
    accentColor: '#0f766e',
    personality: 'Chill & Relaxed',
    tag: 'Health & Breaks',
    nfcUid: 'TAG-04'
  },
  {
    id: 'clown',
    name: 'Pip',
    type: 'clown',
    color: '#ff7a00',
    bellyColor: '#ffffff',
    accentColor: '#2b2d42',
    personality: 'Curious & Playful',
    tag: 'Creative Work',
    nfcUid: 'TAG-05'
  },
  {
    id: 'whale',
    name: 'Moby',
    type: 'whale',
    color: '#6c757d',
    bellyColor: '#dee2e6',
    accentColor: '#343a40',
    personality: 'Gentle Heavyweight',
    tag: 'Deep Focus',
    nfcUid: 'TAG-06'
  }
];

interface PixelFishProps {
  type?: CuteFishType | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  facing?: 'left' | 'right';
}

export const PixelFish: React.FC<PixelFishProps> = ({
  type = 'goldie',
  size = 'md',
  animated = true,
  className = '',
  facing = 'right'
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  // Chunky, ultra-cute 8-bit sprites (16x16 grid pixels)
  const render8BitSprite = () => {
    switch (type) {
      case 'puffer':
        return (
          <g>
            {/* Chunky round body */}
            <rect x="3" y="4" width="10" height="8" fill="#ff6584" />
            <rect x="4" y="3" width="8" height="10" fill="#ff6584" />
            <rect x="5" y="2" width="6" height="12" fill="#ff6584" />

            {/* Rosy belly */}
            <rect x="4" y="8" width="7" height="3" fill="#ffb4c2" />

            {/* Cute spikes */}
            <rect x="2" y="5" width="1" height="2" fill="#d93d5e" />
            <rect x="13" y="5" width="1" height="2" fill="#d93d5e" />
            <rect x="7" y="1" width="2" height="1" fill="#d93d5e" />
            <rect x="7" y="14" width="2" height="1" fill="#d93d5e" />

            {/* Big cute eyes (●) */}
            <rect x="9" y="5" width="2" height="2" fill="#18181b" />
            <rect x="9" y="5" width="1" height="1" fill="#ffffff" />

            {/* Blush */}
            <rect x="9" y="8" width="2" height="1" fill="#ff2a55" />

            {/* Kissy mouth (3) */}
            <rect x="12" y="7" width="1" height="1" fill="#18181b" />

            {/* Tiny flapping fin */}
            <rect x="5" y="6" width="2" height="2" fill="#ffd1dc" />
          </g>
        );

      case 'bluefin':
        return (
          <g>
            {/* Sleek fish body */}
            <rect x="3" y="6" width="9" height="5" fill="#3a86ff" />
            <rect x="4" y="5" width="7" height="7" fill="#3a86ff" />

            {/* Soft belly */}
            <rect x="5" y="9" width="5" height="2" fill="#cce3ff" />

            {/* Cute tail */}
            <rect x="1" y="4" width="2" height="3" fill="#1d4ed8" />
            <rect x="1" y="9" width="2" height="3" fill="#1d4ed8" />
            <rect x="2" y="7" width="1" height="2" fill="#3a86ff" />

            {/* Top dorsal fin */}
            <rect x="6" y="3" width="2" height="2" fill="#1d4ed8" />

            {/* Big sparkle eye */}
            <rect x="8" y="6" width="2" height="2" fill="#18181b" />
            <rect x="8" y="6" width="1" height="1" fill="#ffffff" />

            {/* Cute smile */}
            <rect x="11" y="8" width="1" height="1" fill="#1d4ed8" />
          </g>
        );

      case 'jelly':
        return (
          <g>
            {/* Round dome bell */}
            <rect x="4" y="3" width="8" height="6" fill="#2ec4b6" />
            <rect x="5" y="2" width="6" height="8" fill="#2ec4b6" />

            {/* Bell rim */}
            <rect x="3" y="8" width="10" height="2" fill="#0f766e" />

            {/* 3 cute tentacles */}
            <rect x="4" y="10" width="1" height="4" fill="#2ec4b6" />
            <rect x="7" y="10" width="2" height="5" fill="#5eead4" />
            <rect x="11" y="10" width="1" height="4" fill="#2ec4b6" />

            {/* Happy eyes ^ ^ */}
            <rect x="5" y="5" width="2" height="1" fill="#18181b" />
            <rect x="9" y="5" width="2" height="1" fill="#18181b" />

            {/* Blushing cheeks */}
            <rect x="4" y="6" width="1" height="1" fill="#ff6584" />
            <rect x="11" y="6" width="1" height="1" fill="#ff6584" />
          </g>
        );

      case 'clown':
        return (
          <g>
            {/* Orange body */}
            <rect x="3" y="5" width="10" height="6" fill="#ff7a00" />
            <rect x="4" y="4" width="8" height="8" fill="#ff7a00" />

            {/* White bold stripes */}
            <rect x="5" y="4" width="2" height="8" fill="#ffffff" />
            <rect x="9" y="5" width="1" height="6" fill="#ffffff" />

            {/* Black borders on stripes */}
            <rect x="4" y="4" width="1" height="8" fill="#18181b" />
            <rect x="7" y="4" width="1" height="8" fill="#18181b" />

            {/* Rounded tail */}
            <rect x="1" y="5" width="2" height="6" fill="#ff7a00" />
            <rect x="2" y="6" width="1" height="4" fill="#ffffff" />

            {/* Big cute eye */}
            <rect x="10" y="6" width="2" height="2" fill="#18181b" />
            <rect x="10" y="6" width="1" height="1" fill="#ffffff" />
          </g>
        );

      case 'whale':
        return (
          <g>
            {/* Friendly chubby whale body */}
            <rect x="3" y="4" width="11" height="8" fill="#52525b" />
            <rect x="4" y="3" width="9" height="10" fill="#52525b" />

            {/* Cream underbelly */}
            <rect x="4" y="9" width="9" height="3" fill="#e4e4e7" />

            {/* Water spout droplet */}
            <rect x="7" y="1" width="2" height="1" fill="#38bdf8" />

            {/* Fluke tail */}
            <rect x="1" y="4" width="2" height="3" fill="#3f3f46" />
            <rect x="1" y="9" width="2" height="3" fill="#3f3f46" />

            {/* Cute sleeping/smiling eye (ᵔ◡ᵔ) */}
            <rect x="10" y="6" width="2" height="1" fill="#18181b" />
            <rect x="11" y="7" width="1" height="1" fill="#18181b" />

            {/* Rosy cheek */}
            <rect x="9" y="8" width="2" height="1" fill="#f43f5e" />
          </g>
        );

      case 'goldie':
      default:
        return (
          <g>
            {/* Chubby round body */}
            <rect x="4" y="5" width="8" height="6" fill="#ff9f1c" />
            <rect x="5" y="4" width="6" height="8" fill="#ff9f1c" />

            {/* Belly highlight */}
            <rect x="5" y="8" width="5" height="3" fill="#ffe5b4" />

            {/* Big wavy fan tail */}
            <rect x="1" y="4" width="2" height="3" fill="#ff9f1c" />
            <rect x="2" y="6" width="2" height="4" fill="#ff9f1c" />
            <rect x="1" y="9" width="2" height="3" fill="#ff9f1c" />
            <rect x="2" y="5" width="1" height="6" fill="#e05a00" />

            {/* Dorsal fin */}
            <rect x="6" y="3" width="3" height="1" fill="#e05a00" />

            {/* Big round anime eye */}
            <rect x="8" y="6" width="2" height="2" fill="#18181b" />
            <rect x="8" y="6" width="1" height="1" fill="#ffffff" />

            {/* Rosy cheek */}
            <rect x="8" y="8" width="1" height="1" fill="#ff4d6d" />

            {/* Cute mouth */}
            <rect x="11" y="7" width="1" height="1" fill="#e05a00" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${
        animated ? 'animate-bob' : ''
      } ${className}`}
      style={{
        transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        imageRendering: 'pixelated'
      }}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full pixelated select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {render8BitSprite()}
      </svg>
    </div>
  );
};
