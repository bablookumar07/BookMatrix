import { useEffect, useState } from "react";

function IntroAnimation({ onComplete }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExit(true);
    }, 4200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`libryo-intro ${exit ? "libryo-intro-exit" : ""}`}>
      {/* Ambient background */}
      <div className="intro-grid" />
      <div className="intro-glow intro-glow-one" />
      <div className="intro-glow intro-glow-two" />

      {/* Floating particles */}
      <div className="intro-particles">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="libryo-intro-content">

        {/* =========================
            LOGO
        ========================== */}

        <div className="libryo-logo-animation">

          <svg
            className="libryo-logo-svg"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>

              {/* Main blue glow */}
              <filter id="blueGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Strong glow */}
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Metallic gradient */}
              <linearGradient
                id="metal"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#b8d7e6" />
                <stop offset="55%" stopColor="#f7ffff" />
                <stop offset="100%" stopColor="#6e9fb5" />
              </linearGradient>

              {/* Cyan gradient */}
              <linearGradient
                id="cyan"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#e9ffff" />
                <stop offset="40%" stopColor="#66eaff" />
                <stop offset="100%" stopColor="#168db2" />
              </linearGradient>

              {/* Dark inner gradient */}
              <linearGradient
                id="darkCore"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#0c3448" />
                <stop offset="50%" stopColor="#061824" />
                <stop offset="100%" stopColor="#020a12" />
              </linearGradient>
            </defs>

            {/* =================================
                OUTER HEXAGON
            ================================== */}

            <g className="outer-structure">

              <polygon
                points="250,35 390,115 390,275 250,355 110,275 110,115"
                fill="none"
                stroke="url(#cyan)"
                strokeWidth="4"
                filter="url(#blueGlow)"
              />

              <polygon
                points="250,62 365,128 365,262 250,328 135,262 135,128"
                fill="none"
                stroke="#48dfff"
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* architectural lines */}

              <line
                x1="110"
                y1="115"
                x2="135"
                y2="128"
                stroke="#75edff"
                strokeWidth="2"
              />

              <line
                x1="390"
                y1="115"
                x2="365"
                y2="128"
                stroke="#75edff"
                strokeWidth="2"
              />

              <line
                x1="110"
                y1="275"
                x2="135"
                y2="262"
                stroke="#75edff"
                strokeWidth="2"
              />

              <line
                x1="390"
                y1="275"
                x2="365"
                y2="262"
                stroke="#75edff"
                strokeWidth="2"
              />

            </g>

            {/* =================================
                3D CUBE
            ================================== */}

            <g className="cube-structure">

              <polygon
                points="250,80 340,132 340,235 250,287 160,235 160,132"
                fill="url(#darkCore)"
                stroke="url(#cyan)"
                strokeWidth="4"
                filter="url(#blueGlow)"
              />

              {/* top */}

              <polygon
                points="250,80 340,132 250,183 160,132"
                fill="#113b4d"
                stroke="#83efff"
                strokeWidth="3"
              />

              {/* left */}

              <polygon
                points="160,132 250,183 250,287 160,235"
                fill="#092331"
                stroke="#4edfff"
                strokeWidth="2"
              />

              {/* right */}

              <polygon
                points="250,183 340,132 340,235 250,287"
                fill="#061822"
                stroke="#35cce9"
                strokeWidth="2"
              />

            </g>

            {/* =================================
                BOOK
            ================================== */}

            <g className="book-symbol">

              {/* left page */}

              <path
                d="M175 205 L220 179 L247 193 L247 267 L218 252 L175 270 Z"
                fill="url(#metal)"
                stroke="#eaffff"
                strokeWidth="3"
              />

              {/* right page */}

              <path
                d="M253 193 L280 179 L325 205 L325 270 L282 252 L253 267 Z"
                fill="url(#metal)"
                stroke="#eaffff"
                strokeWidth="3"
              />

              {/* center */}

              <line
                x1="250"
                y1="191"
                x2="250"
                y2="267"
                stroke="#ffffff"
                strokeWidth="4"
              />

              {/* book bottom */}

              <path
                d="M174 270 L218 252 L250 267 L282 252 L326 270 L282 289 L250 278 L218 289 Z"
                fill="#6fa4b9"
                stroke="#dffcff"
                strokeWidth="3"
              />

            </g>

            {/* =================================
                DIGITAL CORE
            ================================== */}

            <g className="digital-core">

              <circle cx="250" cy="125" r="5" fill="#dfffff" />
              <circle cx="228" cy="138" r="4" fill="#62eaff" />
              <circle cx="273" cy="142" r="4" fill="#62eaff" />
              <circle cx="250" cy="153" r="5" fill="#ffffff" />

              <line
                x1="250"
                y1="125"
                x2="228"
                y2="138"
                stroke="#54e7ff"
                strokeWidth="2"
              />

              <line
                x1="250"
                y1="125"
                x2="273"
                y2="142"
                stroke="#54e7ff"
                strokeWidth="2"
              />

              <line
                x1="228"
                y1="138"
                x2="250"
                y2="153"
                stroke="#54e7ff"
                strokeWidth="2"
              />

              <line
                x1="273"
                y1="142"
                x2="250"
                y2="153"
                stroke="#54e7ff"
                strokeWidth="2"
              />

              <circle cx="250" cy="125" r="15" fill="none" stroke="#3ee6ff" opacity="0.4" />
              <circle cx="250" cy="153" r="24" fill="none" stroke="#3ee6ff" opacity="0.2" />

            </g>

            {/* =================================
                TECH PARTICLES
            ================================== */}

            <g className="logo-particles">

              <circle cx="143" cy="155" r="3" />
              <circle cx="357" cy="170" r="3" />
              <circle cx="150" cy="245" r="2" />
              <circle cx="350" cy="245" r="2" />
              <circle cx="250" cy="55" r="3" />
              <circle cx="250" cy="345" r="3" />

            </g>

            {/* =================================
                CORNER LIGHTS
            ================================== */}

            <g className="corner-lights">

              <circle cx="110" cy="115" r="5" />
              <circle cx="390" cy="115" r="5" />
              <circle cx="110" cy="275" r="5" />
              <circle cx="390" cy="275" r="5" />

            </g>
          </svg>
        </div>

        {/* =========================
            BRAND NAME
        ========================== */}

        <div className="libryo-wordmark">
          <span>L</span>
          <span>I</span>
          <span>B</span>
          <span>R</span>
          <span>Y</span>
          <span>O</span>
        </div>

        <div className="libryo-tagline">
          THE DIGITAL ARCHITECTURE FOR MODERN CAMPUSES.
        </div>

        <div className="libryo-loading-line">
          <span />
        </div>

      </div>
    </div>
  );
}

export default IntroAnimation;