import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext, LangContext, NavigationContext } from "./contexts";
import { rosterFiles } from "virtual:team-roster";

// ── Rank translation table (He → En) ──────────────────────
const RANK_EN = {
  'דאן': 'Dan',
  'חגורה שחורה': 'Black Belt',
  'חגורה חומה': 'Brown Belt',
  'חגורה כחולה': 'Blue Belt',
  'חגורה ירוקה': 'Green Belt',
  'חגורה כתומה': 'Orange Belt',
  'חגורה צהובה': 'Yellow Belt',
  'חגורה לבנה': 'White Belt',
  'מדריך': 'Instructor',
  'מאמן': 'Coach',
};

function translateRank(rankHe, lang) {
  if (!rankHe || lang !== 'en') return rankHe || '';
  return Object.entries(RANK_EN).reduce((r, [he, en]) => r.replace(he, en), rankHe);
}

// Parse filenames like "איציק טרבלסי - דאן 2.jpeg" → { name, rankHe, img }
const dynamicMembers = rosterFiles
  .filter(f => f.includes(' - '))
  .map(filename => {
    const stem = filename.replace(/\.(jpe?g|png|webp)$/i, '');
    const dashIdx = stem.indexOf(' - ');
    const name = stem.slice(0, dashIdx).trim();
    const rankHe = stem.slice(dashIdx + 3).trim();
    return { name, rankHe, img: `/צוות/${encodeURIComponent(filename)}` };
  });

// ============================================================
// FullTeam.jsx — Full International Instruction Team Page
// Contexts: ThemeContext · LangContext · NavigationContext
// ============================================================

function useTheme() { return useContext(ThemeContext); }
function useLang() { return useContext(LangContext); }
function useNavigation() { return useContext(NavigationContext); }

// ── Intersection-observer fade-in ──────────────────────────
function useInView(threshold = 0.08) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

function FadeIn({ children, delay = 0 }) {
    const [ref, visible] = useInView();
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        }}>
            {children}
        </div>
    );
}

// ── Language toggle (mirrors App.jsx) ──────────────────────
function LangToggle() {
    const { lang, setLang } = useLang();
    const { theme, isDark } = useTheme();
    return (
        <button
            onClick={() => setLang(lang === "he" ? "en" : "he")}
            aria-label={lang === "he" ? "Switch to English" : "עברית"}
            style={{
                padding: "5px 11px", borderRadius: 6, cursor: "pointer",
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                color: theme.text, fontFamily: "'Heebo', sans-serif",
                fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
            {lang === "he" ? "EN" : "עב"}
        </button>
    );
}

// ── Theme toggle (mirrors App.jsx) ─────────────────────────
function ThemeToggle() {
    const { isDark, toggle } = useTheme();
    const { t } = useLang();
    return (
        <button
            onClick={toggle}
            aria-label={isDark ? t.ui.lightMode : t.ui.darkMode}
            style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.3s ease", flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
            {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}

// ── Featured card — Grand Master ───────────────────────────
function FeaturedTeamCard({ member }) {
    const { theme, isDark } = useTheme();
    const [imgError, setImgError] = useState(false);
    const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const glowBase = `0 0 0 1px rgba(196,30,58,0.25), 0 0 56px rgba(196,30,58,0.1), 0 20px 56px rgba(0,0,0,${isDark ? 0.45 : 0.1})`;
    const glowHover = `0 0 0 1px rgba(196,30,58,0.6), 0 0 64px rgba(196,30,58,0.2), 0 24px 64px rgba(0,0,0,${isDark ? 0.55 : 0.14})`;

    return (
        <div
            className="ft-featured-card"
            style={{
                maxWidth: 740, margin: "0 auto 40px",
                borderRadius: 12, overflow: "hidden",
                border: "1px solid rgba(212,175,55,0.3)",
                boxShadow: glowBase,
                background: theme.sectionTeamCardBg,
                display: "flex",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = glowHover; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = glowBase; }}
        >
            {/* Photo */}
            <div className="ft-featured-photo" style={{
                width: 280, flexShrink: 0, position: "relative",
                background: isDark ? "#141414" : "#E0E0E0",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                {!imgError ? (
                    <img src={member.img} alt={member.name} onError={() => setImgError(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom", display: "block" }} />
                ) : (
                    <div style={{
                        width: 96, height: 96, borderRadius: "50%",
                        background: isDark ? "#1F1F1F" : "#D1D5DB",
                        border: `2px solid ${theme.red}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Heebo', sans-serif", fontSize: 28, fontWeight: 900, color: theme.red,
                    }}>{initials}</div>
                )}
                <span style={{
                    position: "absolute", top: 14, left: 14,
                    background: theme.red, color: "#FFFFFF",
                    fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 700,
                    padding: "4px 12px", borderRadius: 3,
                }}>{member.rank}</span>
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 90,
                    background: "linear-gradient(to top, rgba(212,175,55,0.12), transparent)",
                    pointerEvents: "none",
                }} />
            </div>

            {/* Text */}
            <div style={{ padding: "32px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{
                    display: "block", marginBottom: 14,
                    fontFamily: "'Heebo', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: 2.5, textTransform: "uppercase",
                    color: "rgba(212,175,55,0.85)",
                }}>✦ GRAND MASTER</span>
                <div style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 13,
                    color: theme.red, fontWeight: 700, marginBottom: 16, letterSpacing: 0.3,
                }}>{member.role}</div>
                <p style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 15,
                    color: theme.sectionTeamText, lineHeight: 1.8, margin: 0,
                }}>{member.desc}</p>
            </div>
        </div>
    );
}

// ── Regular member card ─────────────────────────────────────
function TeamMemberCard({ member }) {
    const { theme, isDark } = useTheme();
    const [imgError, setImgError] = useState(false);
    const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2);

    return (
        <div
            style={{
                borderRadius: 8, overflow: "hidden",
                border: `1px solid ${theme.sectionTeamBorder}`,
                background: theme.sectionTeamCardBg,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                height: "100%", display: "flex", flexDirection: "column",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,${isDark ? 0.4 : 0.12})`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <div className="ft-member-photo" style={{
                height: 220, position: "relative",
                background: isDark ? "#141414" : "#E5E5E5",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0,
            }}>
                {!imgError ? (
                    <img src={member.img} alt={member.name} onError={() => setImgError(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: member.name.includes("איציק טרבלסי") ? "center" : "bottom", display: "block" }} />
                ) : (
                    <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: isDark ? "#1F1F1F" : "#D1D5DB",
                        border: `2px solid ${theme.red}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 900, color: theme.red,
                    }}>{initials}</div>
                )}
                <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: theme.red, color: "#FFFFFF",
                    fontFamily: "'Heebo', sans-serif", fontSize: 11, fontWeight: 700,
                    padding: "3px 10px", borderRadius: 3,
                }}>{member.rank}</span>
            </div>

            <div className="ft-member-body" style={{ padding: "18px 16px", flex: 1 }}>
                <h3 className="ft-member-name" style={{
                    fontFamily: "'Heebo', sans-serif", fontWeight: 800,
                    fontSize: 16, color: theme.sectionTeamText, margin: "0 0 4px", lineHeight: 1.3,
                }}>{member.name}</h3>
                <div className="ft-member-role" style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 12,
                    color: theme.red, fontWeight: 600, marginBottom: 10,
                }}>{member.role}</div>
                <p className="ft-member-desc" style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 13,
                    color: theme.textSecondary, lineHeight: 1.65, margin: 0,
                }}>{member.desc}</p>
            </div>
        </div>
    );
}

// ── Placeholder slot ────────────────────────────────────────
function PlaceholderCard() {
    const { theme, isDark } = useTheme();
    return (
        <div style={{
            borderRadius: 8, overflow: "hidden",
            border: `1px dashed ${theme.sectionTeamBorder}`,
            background: theme.sectionTeamCardBg,
            height: "100%", display: "flex", flexDirection: "column", minHeight: 280,
        }}>
            <div className="ft-member-photo" style={{
                height: 220, background: isDark ? "#111111" : "#F0F0F0",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                    stroke={isDark ? "#2A2A2A" : "#D1D5DB"}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
            </div>
            <div className="ft-member-body" style={{ padding: "18px 16px", flex: 1 }}>
                <div style={{ height: 14, borderRadius: 3, background: isDark ? "#1F1F1F" : "#E5E5E5", marginBottom: 8, width: "55%" }} />
                <div style={{ height: 11, borderRadius: 3, background: isDark ? "#1F1F1F" : "#EBEBEB", marginBottom: 12, width: "38%" }} />
                <div style={{ height: 9, borderRadius: 3, background: isDark ? "#181818" : "#F0F0F0", width: "75%" }} />
            </div>
        </div>
    );
}

// ── Main page ───────────────────────────────────────────────
export default function FullTeamPage() {
    const { theme, isDark } = useTheme();
    const { t, lang } = useLang();
    const { navigate } = useNavigation();
    const PLACEHOLDER_COUNT = 6;
    const [featured, ...hardcodedMembers] = t.team.members;

    // Merge hardcoded rest + dynamic members from /public/צוות
    // Deduplicate: skip dynamic entries whose name already appears in hardcoded list
    const hardcodedNames = new Set(hardcodedMembers.map(m => m.name));
    const extraMembers = dynamicMembers
      .filter(dm => !hardcodedNames.has(dm.name))
      .map(dm => ({
        name: dm.name,
        rank: translateRank(dm.rankHe, lang),
        role: translateRank(dm.rankHe, lang),
        desc: '',
        img: dm.img,
      }));
    const restMembers = [...hardcodedMembers, ...extraMembers];

    return (
        <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.4s ease" }}>

            {/* ── Sticky top bar ────────────────────────── */}
            <div style={{
                position: "sticky", top: 0, zIndex: 100,
                background: isDark ? "rgba(10,10,10,0.96)" : "rgba(255,255,255,0.96)",
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${theme.border}`,
                padding: "0 24px",
            }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto", height: 64,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}>
                    {/* Back button */}
                    <button
                        onClick={() => navigate("home")}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "none", border: `1px solid ${theme.border}`,
                            borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                            fontFamily: "'Heebo', sans-serif", fontSize: 13, fontWeight: 600,
                            color: theme.text, transition: "border-color 0.2s, color 0.2s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = theme.red; e.currentTarget.style.color = theme.red; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transform: t.dir === "rtl" ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        <span className="ft-back-label">{t.team.backHome}</span>
                    </button>

                    {/* Center: TKM logo text */}
                    <span style={{
                        fontFamily: "'Heebo', sans-serif", fontWeight: 900,
                        fontSize: 18, color: theme.text, letterSpacing: 1,
                    }}>TKM</span>

                    {/* Right: Lang + Theme controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <LangToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* ── Page header ───────────────────────────── */}
            <div style={{ padding: "72px 24px 48px", textAlign: "center", position: "relative" }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg, transparent, ${theme.red}, transparent)`,
                }} />
                <FadeIn>
                    <span style={{
                        fontFamily: "'Heebo', sans-serif", fontSize: 13, fontWeight: 700,
                        letterSpacing: 3, textTransform: "uppercase",
                        color: theme.red, display: "block", marginBottom: 12,
                    }}>{t.team.fullTeamSub}</span>
                    <h1 style={{
                        fontFamily: "'Heebo', sans-serif",
                        fontSize: "clamp(26px, 5vw, 46px)",
                        fontWeight: 900, color: theme.text, margin: 0, lineHeight: 1.15,
                    }}>{t.team.fullTeamTitle}</h1>
                    <div style={{ width: 48, height: 3, background: theme.red, margin: "18px auto 0", borderRadius: 2 }} />
                    <p style={{
                        fontFamily: "'Heebo', sans-serif", fontSize: 15,
                        color: theme.textSecondary, marginTop: 20, lineHeight: 1.7,
                    }}>{t.team.more}</p>
                </FadeIn>
            </div>

            {/* ── Content ───────────────────────────────── */}
            <div style={{ padding: "0 24px 96px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                    {/* Featured: Grand Master Erez Sharaby */}
                    <FadeIn delay={0.1}>
                        <FeaturedTeamCard member={featured} />
                    </FadeIn>

                    {/* Rest of team + placeholder slots */}
                    <div className="full-team-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 24,
                    }}>
                        {restMembers.map((m, i) => (
                            <FadeIn key={i} delay={i * 0.08}>
                                <TeamMemberCard member={m} />
                            </FadeIn>
                        ))}
                        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                            <FadeIn key={`ph-${i}`} delay={(restMembers.length + i) * 0.06}>
                                <PlaceholderCard />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Responsive styles ─────────────────────── */}
            <style>{`
                /* Desktop: 4-col → 3-col at 1100px */
                @media (max-width: 1100px) {
                    .full-team-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }

                /* Mobile: 3-col with compact card content */
                @media (max-width: 768px) {
                    .full-team-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }

                    /* Compact photo height */
                    .ft-member-photo { height: 150px !important; }

                    /* Compact card body */
                    .ft-member-body { padding: 8px 7px !important; }
                    .ft-member-name { font-size: 11px !important; line-height: 1.3 !important; }
                    .ft-member-role { font-size: 10px !important; margin-bottom: 0 !important; }
                    .ft-member-desc { display: none !important; }

                    /* Featured card stacks vertically */
                    .ft-featured-card { flex-direction: column !important; max-width: 100% !important; }
                    .ft-featured-photo { width: 100% !important; min-height: 260px !important; }

                    /* Shorten back-button label on very small screens */
                    .ft-back-label { display: none; }
                }

                @media (max-width: 480px) {
                    .ft-back-label { display: none; }
                }
            `}</style>
        </div>
    );
}
