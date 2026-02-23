"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ── Floating particle helper ── */
function Particle({ delay, x, size, dur }: { delay: number; x: number; size: number; dur: number }) {
    return (
        <div
            className="absolute bottom-0 rounded-full pointer-events-none"
            style={{
                left: `${x}%`,
                width: size,
                height: size,
                background: "radial-gradient(circle, rgba(253,211,77,0.9) 0%, rgba(249,115,22,0.4) 60%, transparent 100%)",
                animation: `particleFloat ${dur}s ${delay}s ease-in infinite`,
                opacity: 0,
            }}
        />
    );
}

const PARTICLES = [
    { x: 15, size: 5, dur: 3.8, delay: 0.2 },
    { x: 28, size: 3, dur: 4.2, delay: 0.9 },
    { x: 42, size: 6, dur: 3.5, delay: 0.4 },
    { x: 55, size: 4, dur: 4.8, delay: 1.3 },
    { x: 68, size: 3, dur: 3.9, delay: 0.7 },
    { x: 78, size: 5, dur: 4.4, delay: 0.1 },
    { x: 88, size: 4, dur: 3.6, delay: 1.6 },
    { x: 35, size: 3, dur: 5.0, delay: 0.5 },
    { x: 62, size: 6, dur: 4.0, delay: 1.1 },
    { x: 50, size: 3, dur: 3.7, delay: 1.8 },
];

/* ── Palace SVG — minimal modern Indian silhouette ── */
function PalaceSVG() {
    return (
        <svg
            viewBox="0 0 400 200"
            className="w-full max-w-[340px] sm:max-w-[420px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Gold fill shape — fades in after stroke draw */}
            <g className="palace-fill">
                {/* Main body */}
                <rect x="60" y="120" width="280" height="70" rx="2" fill="url(#goldFill)" fillOpacity="0.18" />
                {/* Wings */}
                <rect x="20" y="135" width="60" height="55" rx="1" fill="url(#goldFill)" fillOpacity="0.13" />
                <rect x="320" y="135" width="60" height="55" rx="1" fill="url(#goldFill)" fillOpacity="0.13" />
                {/* Central dome fill */}
                <ellipse cx="200" cy="82" rx="28" ry="24" fill="url(#goldFill)" fillOpacity="0.22" />
                {/* Side towers fills */}
                <ellipse cx="110" cy="108" rx="16" ry="13" fill="url(#goldFill)" fillOpacity="0.15" />
                <ellipse cx="290" cy="108" rx="16" ry="13" fill="url(#goldFill)" fillOpacity="0.15" />
            </g>

            {/* Stroke path — all the architectural line-art */}
            <g
                stroke="url(#strokeGrad)"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="palace-stroke"
            >
                {/* Main platform */}
                <polyline strokeWidth="1.8" points="30,190 30,140 370,140 370,190" />
                {/* Left wing */}
                <polyline strokeWidth="1.5" points="30,140 20,140 20,190" />
                <rect x="30" y="145" width="60" height="45" strokeWidth="1.2" />
                {/* Left wing arches */}
                <path d="M38,190 L38,158 Q48,148 58,158 L58,190" strokeWidth="1" />
                {/* Right wing */}
                <polyline strokeWidth="1.5" points="370,140 380,140 380,190" />
                <rect x="310" y="145" width="60" height="45" strokeWidth="1.2" />
                <path d="M318,190 L318,158 Q328,148 338,158 L338,190" strokeWidth="1" />

                {/* Left tower */}
                <rect x="92" y="115" width="32" height="25" strokeWidth="1.4" />
                <path d="M92,115 Q108,95 124,115" strokeWidth="1.4" />
                <line x1="108" y1="95" x2="108" y2="85" strokeWidth="1.4" />
                <ellipse cx="108" cy="83" rx="5" ry="6" strokeWidth="1.4" />
                {/* Left tower finial */}
                <polygon points="108,74 105,83 111,83" strokeWidth="1" />

                {/* Right tower */}
                <rect x="276" y="115" width="32" height="25" strokeWidth="1.4" />
                <path d="M276,115 Q292,95 308,115" strokeWidth="1.4" />
                <line x1="292" y1="95" x2="292" y2="85" strokeWidth="1.4" />
                <ellipse cx="292" cy="83" rx="5" ry="6" strokeWidth="1.4" />
                <polygon points="292,74 289,83 295,83" strokeWidth="1" />

                {/* Central grand dome */}
                <path d="M160,140 Q160,110 200,106 Q240,110 240,140" strokeWidth="1.8" />
                {/* Dome bulge */}
                <path d="M172,120 Q200,85 228,120" strokeWidth="1.6" />
                {/* Pinnacle */}
                <line x1="200" y1="85" x2="200" y2="65" strokeWidth="1.5" />
                <path d="M194,75 Q200,60 206,75" strokeWidth="1.3" />
                <ellipse cx="200" cy="60" rx="4" ry="5.5" strokeWidth="1.4" />
                <polygon points="200,51 197,60 203,60" strokeWidth="1.2" />
                {/* Chakra / star */}
                <circle cx="200" cy="60" r="2.5" strokeWidth="1" />

                {/* Central door arch */}
                <path d="M179,140 L179,118 Q200,108 221,118 L221,140" strokeWidth="1.5" />
                {/* Door */}
                <rect x="185" y="123" width="30" height="17" rx="1" strokeWidth="1.1" />

                {/* Ornamental balcony row */}
                <line x1="90" y1="140" x2="310" y2="140" strokeWidth="1" />
                {/* Jharokha windows left */}
                <path d="M105,135 L105,123 Q115,117 125,123 L125,135" strokeWidth="1" />
                <path d="M138,135 L138,125 Q148,119 158,125 L158,135" strokeWidth="1" />
                {/* Jharokha windows right */}
                <path d="M242,135 L242,125 Q252,119 262,125 L262,135" strokeWidth="1" />
                <path d="M275,135 L275,123 Q285,117 295,123 L295,135" strokeWidth="1" />

                {/* Ground crenellations */}
                <polyline strokeWidth="1" points="60,140 60,133 70,133 70,140" />
                <polyline strokeWidth="1" points="75,140 75,133 85,133 85,140" />
                <polyline strokeWidth="1" points="315,140 315,133 325,133 325,140" />
                <polyline strokeWidth="1" points="330,140 330,133 340,133 340,140" />

                {/* Reflecting pool */}
                <ellipse cx="200" cy="196" rx="90" ry="5" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="200" y1="190" x2="200" y2="191" strokeWidth="0.5" strokeOpacity="0.5" />
                <path d="M130,196 Q200,192 270,196" strokeWidth="0.6" strokeOpacity="0.35" />
            </g>

            {/* Ground */}
            <line x1="10" y1="190" x2="390" y2="190" stroke="url(#strokeGrad)" strokeWidth="1.5" strokeOpacity="0.5" className="palace-stroke" />

            <defs>
                <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#92400e" />
                    <stop offset="40%" stopColor="#d97706" />
                    <stop offset="70%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="goldFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* ── Progress bar ── */
function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="w-36 sm:w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mx-auto">
            <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#d97706,#fcd34d,#f97316)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
        </div>
    );
}

/* ══ Main LoadingScreen ══ */
export default function LoadingScreen({ onDone }: { onDone?: () => void }) {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<"draw" | "fill" | "text" | "done">("draw");

    useEffect(() => {
        // Progress ticker
        const tick = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) { clearInterval(tick); return 100; }
                return p + Math.random() * 12 + 3;
            });
        }, 180);

        // Phase transitions
        const t1 = setTimeout(() => setPhase("fill"), 1400);
        const t2 = setTimeout(() => setPhase("text"), 2200);
        const t3 = setTimeout(() => setPhase("done"), 3600);
        const t4 = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onDone?.(), 600);
        }, 4000);

        return () => { clearInterval(tick);[t1, t2, t3, t4].forEach(clearTimeout); };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(18px)", scale: 1.04 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        background: "radial-gradient(ellipse at 50% 30%, #fff7db 0%, #fdf3e3 30%, #fae8c8 60%, #f5dba8 100%)",
                    }}
                >
                    {/* ── Ambient light sweep ── */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "conic-gradient(from 220deg at 50% 40%, transparent 0deg, rgba(253,211,77,0.12) 30deg, transparent 60deg)",
                            animation: "lightSweep 6s ease-in-out infinite",
                        }}
                    />

                    {/* ── Noise grain overlay ── */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
                    />

                    {/* ── Soft radial glow rings ── */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-gold-300/20"
                            style={{ animation: "ringPulse 3s ease-in-out infinite" }} />
                        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-saffron-300/20"
                            style={{ animation: "ringPulse 3s 0.5s ease-in-out infinite" }} />
                    </div>

                    {/* ── Main content ── */}
                    <div className="relative z-10 flex flex-col items-center gap-6 px-6 w-full max-w-lg">

                        {/* Palace illustration */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <PalaceSVG />

                            {/* Glow beneath palace */}
                            <div
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 blur-2xl rounded-full pointer-events-none"
                                style={{
                                    background: "radial-gradient(ellipse, rgba(217,119,6,0.35) 0%, transparent 70%)",
                                    animation: "glowPulse 2.5s ease-in-out infinite",
                                }}
                            />
                        </motion.div>

                        {/* Floating particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {PARTICLES.map((p, i) => (
                                <Particle key={i} {...p} />
                            ))}
                        </div>

                        {/* ── Logo ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: phase !== "draw" ? 1 : 0, y: phase !== "draw" ? 0 : 12 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center gap-1 text-center"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    style={{
                                        animation: phase === "text" ? "glowPulse 2s ease-in-out infinite" : "none",
                                    }}
                                >
                                    <Image src="/atithi-logo.svg" alt="Atithi" width={52} height={52}
                                        className="rounded-xl"
                                        style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.5))" }}
                                    />
                                </div>
                                <div className="leading-none text-left">
                                    <p className="font-display text-3xl font-semibold"
                                        style={{
                                            background: "linear-gradient(135deg,#92400e,#d97706,#fcd34d,#f97316)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}>
                                        Atithi
                                    </p>
                                    <p className="text-[9px] text-gold-600 tracking-[0.22em] uppercase font-medium mt-0.5">
                                        अतिथि देवो भव
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Animated text ── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: phase === "text" || phase === "done" ? 1 : 0 }}
                            transition={{ duration: 0.9 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <p className="text-sm sm:text-base font-medium tracking-widest text-gold-700/80 uppercase flex items-center gap-2">
                                <span className="inline-block w-6 h-px bg-gold-400/60" />
                                Preparing Your Stay
                                <span className="inline-block w-6 h-px bg-gold-400/60" />
                            </p>
                            <ProgressBar progress={Math.min(progress, 100)} />
                        </motion.div>
                    </div>

                    {/* ── CSS keyframes via style tag ── */}
                    <style>{`
            @keyframes particleFloat {
              0%   { transform: translateY(0) scale(1);      opacity: 0; }
              15%  { opacity: 0.85; }
              80%  { opacity: 0.45; }
              100% { transform: translateY(-260px) scale(0.3); opacity: 0; }
            }

            @keyframes ringPulse {
              0%, 100% { transform: scale(1);    opacity: 0.5; }
              50%       { transform: scale(1.08); opacity: 1;   }
            }

            @keyframes glowPulse {
              0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1);    }
              50%       { opacity: 1;   transform: translateX(-50%) scale(1.15); }
            }

            @keyframes lightSweep {
              0%, 100% { transform: rotate(0deg);   opacity: 0.6; }
              50%       { transform: rotate(15deg);  opacity: 1;   }
            }

            /* Palace stroke draw animation */
            .palace-stroke path,
            .palace-stroke rect,
            .palace-stroke line,
            .palace-stroke polyline,
            .palace-stroke ellipse,
            .palace-stroke polygon,
            .palace-stroke circle {
              stroke-dasharray: 2000;
              stroke-dashoffset: 2000;
              animation: strokeDraw 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
            }
            .palace-stroke polyline:nth-child(2) { animation-delay: 0.08s; }
            .palace-stroke rect:nth-child(3)     { animation-delay: 0.16s; }
            .palace-stroke rect:nth-child(4)     { animation-delay: 0.24s; }
            .palace-stroke rect:nth-child(5)     { animation-delay: 0.32s; }
            .palace-stroke rect:nth-child(6)     { animation-delay: 0.40s; }
            .palace-stroke path:nth-child(7)     { animation-delay: 0.48s; }
            .palace-stroke rect:nth-child(8)     { animation-delay: 0.56s; }
            .palace-stroke path:nth-child(9)     { animation-delay: 0.64s; }
            .palace-stroke rect:nth-child(10)    { animation-delay: 0.72s; }

            @keyframes strokeDraw {
              to { stroke-dashoffset: 0; }
            }

            /* Palace gold fill fade in */
            .palace-fill rect,
            .palace-fill ellipse {
              opacity: 0;
              animation: fillFade 1.2s 1.6s ease-out forwards;
            }
            @keyframes fillFade {
              to { opacity: 1; }
            }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
