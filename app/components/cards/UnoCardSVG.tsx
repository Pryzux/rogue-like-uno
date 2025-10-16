// Production-ready UNO Card SVG Component

interface UnoCardProps {
  color: 'red' | 'blue' | 'green' | 'yellow' | 'black';
  type: 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4' | 'back';
  value?: number;
  className?: string;
  currentColor?: 'red' | 'blue' | 'green' | 'yellow';
}

export function UnoCardSVG({ color, type, value, className = '', currentColor }: UnoCardProps) {
  // Color mappings
  const colorMap = {
    red: '#E53935',
    blue: '#1E88E5',
    green: '#43A047',
    yellow: '#FDD835',
    black: '#212121',
  };

  const bgColor = colorMap[color];

  // Card back
  if (type === 'back') {
    return (
      <svg
        viewBox="0 0 100 140"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer border */}
        <rect width="100" height="140" rx="8" fill="#212121" />
        <rect x="4" y="4" width="92" height="132" rx="6" fill="#D32F2F" />

        {/* Yellow oval */}
        <ellipse cx="50" cy="70" rx="35" ry="50" fill="#FDD835" />

        {/* ROGUE UNO text */}
        <text
          x="50"
          y="60"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="900"
          fill="#D32F2F"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ROGUE
        </text>
        <text
          x="50"
          y="80"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fontWeight="900"
          fill="#D32F2F"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          UNO
        </text>

        {/* Decorative circles */}
        <circle cx="20" cy="30" r="6" fill="#1E88E5" opacity="0.3" />
        <circle cx="80" cy="30" r="6" fill="#43A047" opacity="0.3" />
        <circle cx="20" cy="110" r="6" fill="#43A047" opacity="0.3" />
        <circle cx="80" cy="110" r="6" fill="#1E88E5" opacity="0.3" />
      </svg>
    );
  }

  // Wild cards
  if (type === 'wild' || type === 'wildDraw4') {
    return (
      <svg
        viewBox="0 0 100 140"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer border */}
        <rect width="100" height="140" rx="8" fill="#212121" />
        <rect x="3" y="3" width="94" height="134" rx="6" fill="#0F0F0F" />

        {/* Quarter circles - four colors */}
        <path d="M 50 70 L 50 28 A 42 42 0 0 1 92 70 Z" fill="#E53935" />
        <path d="M 50 70 L 92 70 A 42 42 0 0 1 50 112 Z" fill="#FDD835" />
        <path d="M 50 70 L 50 112 A 42 42 0 0 1 8 70 Z" fill="#43A047" />
        <path d="M 50 70 L 8 70 A 42 42 0 0 1 50 28 Z" fill="#1E88E5" />

        {/* Center highlight based on chosen color */}
        {currentColor && (
          <circle
            cx="50"
            cy="70"
            r="24"
            fill="none"
            stroke={
              {
                red: 'rgba(244, 67, 54, 0.5)',
                blue: 'rgba(30, 136, 229, 0.5)',
                green: 'rgba(56, 142, 60, 0.5)',
                yellow: 'rgba(253, 216, 53, 0.5)',
              }[currentColor]
            }
            strokeWidth="6"
            strokeLinecap="round"
          />
        )}
        <circle cx="50" cy="70" r="20" fill="#0F0F0F" />

        {/* Wild text or Draw 4 */}
        {type === 'wild' ? (
          <text
            x="50"
            y="73"
            fontFamily="Arial, sans-serif"
            fontSize="14"
            fontWeight="900"
            fill="#FFFFFF"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            WILD
          </text>
        ) : (
          <>
            <text
              x="50"
              y="65"
              fontFamily="Arial, sans-serif"
              fontSize="12"
              fontWeight="900"
              fill="#FFFFFF"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              WILD
            </text>
            <text
              x="50"
              y="80"
              fontFamily="Arial, sans-serif"
              fontSize="16"
              fontWeight="900"
              fill="#FFFFFF"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              +4
            </text>
          </>
        )}
      </svg>
    );
  }

  // Regular colored cards
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer border */}
      <rect width="100" height="140" rx="8" fill="#212121" />
      <rect x="3" y="3" width="94" height="134" rx="6" fill={bgColor} />

      {/* White oval center */}
      <ellipse cx="50" cy="70" rx="32" ry="45" fill="#FFFFFF" />

      {/* Card content based on type */}
      {type === 'number' && value !== undefined && (
        <>
          {/* Center number */}
          <text
            x="50"
            y="78"
            fontFamily="Arial, sans-serif"
            fontSize="48"
            fontWeight="900"
            fill={bgColor}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {value}
          </text>

          {/* Corner numbers */}
          <text
            x="15"
            y="25"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            {value}
          </text>
          <text
            x="85"
            y="118"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            transform="rotate(180 85 118)"
          >
            {value}
          </text>
        </>
      )}

      {type === 'skip' && (
        <>
          {/* Skip symbol (circle with slash) */}
          <circle cx="50" cy="70" r="22" fill="none" stroke={bgColor} strokeWidth="6" />
          <line x1="35" y1="55" x2="65" y2="85" stroke={bgColor} strokeWidth="6" strokeLinecap="round" />

          {/* Corner skip icons */}
          <g>
            <circle cx="15" cy="20" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="12" y1="17" x2="18" y2="23" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <g transform="rotate(180 85 120)">
            <circle cx="15" cy="20" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="12" y1="17" x2="18" y2="23" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        </>
      )}

      {type === 'reverse' && (
        <>
          {/* Reverse arrows */}
          <g fill={bgColor}>
            <path d="M 40 55 L 50 45 L 50 50 L 65 50 L 65 60 L 50 60 L 50 65 Z" />
            <path d="M 60 85 L 50 95 L 50 90 L 35 90 L 35 80 L 50 80 L 50 75 Z" />
          </g>

          {/* Corner reverse icons */}
          <g fill="#FFFFFF">
            <path d="M 12 18 L 16 14 L 16 16 L 20 16 L 20 20 L 16 20 L 16 22 Z" transform="scale(0.8)" />
          </g>
          <g fill="#FFFFFF" transform="rotate(180 85 120)">
            <path d="M 12 18 L 16 14 L 16 16 L 20 16 L 20 20 L 16 20 L 16 22 Z" transform="scale(0.8) translate(72 98)" />
          </g>
        </>
      )}

      {type === 'draw2' && (
        <>
          {/* +2 text */}
          <text
            x="50"
            y="78"
            fontFamily="Arial, sans-serif"
            fontSize="42"
            fontWeight="900"
            fill={bgColor}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            +2
          </text>

          {/* Corner +2 */}
          <text
            x="15"
            y="24"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            +2
          </text>
          <text
            x="85"
            y="118"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
            transform="rotate(180 85 118)"
          >
            +2
          </text>
        </>
      )}
    </svg>
  );
}
