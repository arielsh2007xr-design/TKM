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

// ── Name phonetic translation map (He → En) ───────────────
const NAME_EN = {
  'אדיר כהן':        'Adir Cohen',
  'איציק טרבלסי':   'Itzik Trabelsi',
  'אלי אביסרור':    'Eli Avisror',
  'הדריאל בן נון':  'Hadriel Ben Nun',
  'חיים לוי':       'Chaim Levi',
  'עידו סולומון':   'Ido Solomon',
  'עמית שרעבי':     'Amit Sharaby',
  'קרן לוין':       'Keren Levin',
  'רועי זיוון':     'Roi Zivan',
  'רועי תווינה':    'Roi Tavina',
};

function translateName(nameHe, lang) {
  if (lang !== 'en') return nameHe;
  return NAME_EN[nameHe] ?? nameHe;
}

// Extract numeric Dan value for sorting (e.g. "דאן 4" → 4, fallback 0)
function getDanNumber(rankHe) {
  const m = rankHe.match(/דאן\s+(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// Parse filenames like "איציק טרבלסי - דאן 2.jpeg" → { name, rankHe, img }
// Sorted descending by Dan number
const dynamicMembers = rosterFiles
  .filter(f => f.includes(' - '))
  .map(filename => {
    const stem = filename.replace(/\.(jpe?g|png|webp)$/i, '');
    const dashIdx = stem.indexOf(' - ');
    const name = stem.slice(0, dashIdx).trim();
    const rankHe = stem.slice(dashIdx + 3).trim();
    return { name, rankHe, img: `/צוות/${encodeURIComponent(filename)}` };
  })
  .sort((a, b) => getDanNumber(b.rankHe) - getDanNumber(a.rankHe));

// Names that need object-top (heads near top of photo)
const OBJECT_TOP_NAMES = new Set(["אדיר כהן", "חיים לוי", "רועי זיוון"]);

function getObjectPosition(name) {
  if (name === "איציק טרבלסי") return "center";
  if (OBJECT_TOP_NAMES.has(name)) return "top";
  return "bottom";
}

// ============================================================
// FullTeam.jsx — Full International Instruction Team Page
// ============================================================

function useTheme() { return useContext(ThemeContext); }
function useLang()  { return useContext(LangContext); }
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

// ── Language toggle ────────────────────────────────────────
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

// ── Theme toggle ───────────────────────────────────────────
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

// ── Featured card (Grand Master) — mirrors homepage exactly ─
function FeaturedMemberCard({ m, isDark, theme }) {
    const [imgError, setImgError] = useState(false);
    const initials = m.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const glowBase = `0 0 0 1px rgba(196,30,58,0.25), 0 0 56px rgba(196,30,58,0.1), 0 20px 56px rgba(0,0,0,${isDark ? 0.45 : 0.1})`;
    const glowHover = `0 0 0 1px rgba(196,30,58,0.6), 0 0 64px rgba(196,30,58,0.2), 0 24px 64px rgba(0,0,0,${isDark ? 0.55 : 0.14})`;

    return (
        <div
            className="ft-featured-card"
            style={{
                maxWidth: 740, margin: "0 auto",
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
            <div className="ft-featured-photo" style={{
                width: 280, flexShrink: 0, position: "relative",
                background: isDark ? "#141414" : "#E0E0E0",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                {!imgError ? (
                    <img src={m.img} alt={m.name} onError={() => setImgError(true)}
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
                }}>{m.rank}</span>
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 90,
                    background: "linear-gradient(to top, rgba(212,175,55,0.12), transparent)",
                    pointerEvents: "none",
                }} />
            </div>
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
                }}>{m.role}</div>
                <p style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 15,
                    color: theme.sectionTeamText, lineHeight: 1.8, margin: 0,
                }}>{m.desc}</p>
            </div>
        </div>
    );
}

// ── Leading Team member card — mirrors homepage MemberCard ──
function LeadingMemberCard({ m, isDark, theme }) {
    const [imgError, setImgError] = useState(false);
    const initials = m.name.split(" ").map(n => n[0]).join("").slice(0, 2);

    return (
        <div
            style={{
                borderRadius: 8, overflow: "hidden",
                border: `1px solid ${theme.sectionTeamBorder}`,
                transition: "transform 0.3s, box-shadow 0.3s",
                height: "100%", display: "flex", flexDirection: "column",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <div className="ft-leading-photo" style={{
                height: 220, position: "relative",
                background: isDark ? "#141414" : "#E5E5E5",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
                {!imgError ? (
                    <img
                        src={m.img}
                        alt={m.name}
                        onError={() => setImgError(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom" }}
                    />
                ) : (
                    <div style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: isDark ? "#1F1F1F" : "#D1D5DB", border: `2px solid ${theme.red}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 900, color: theme.red,
                    }}>{initials}</div>
                )}
                <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: theme.red, color: "#FFFFFF",
                    fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 700,
                    padding: "4px 12px", borderRadius: 3,
                }}>{m.rank}</span>
            </div>
            <div className="ft-leading-body" style={{ padding: "24px 20px", background: theme.sectionTeamCardBg, flex: 1 }}>
                <h3 className="ft-leading-name" style={{
                    fontFamily: "'Heebo', sans-serif", fontWeight: 800,
                    fontSize: 18, color: theme.sectionTeamText, margin: "0 0 4px",
                }}>{m.name}</h3>
                <div className="ft-leading-role" style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 13,
                    color: theme.red, fontWeight: 600, marginBottom: 12,
                }}>{m.role}</div>
                <p className="ft-leading-desc" style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 14,
                    color: theme.textSecondary, lineHeight: 1.6, margin: 0,
                }}>{m.desc}</p>
            </div>
        </div>
    );
}

// ── Dynamic instructor card (from /צוות/) ──────────────────
function DynamicMemberCard({ member }) {
    const { theme, isDark } = useTheme();
    const [imgError, setImgError] = useState(false);
    const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    // Always use Hebrew source name for alignment so toggling language doesn't break it
    const objectPos = getObjectPosition(member.nameHe ?? member.name);

    return (
        <div
            style={{
                borderRadius: 10, overflow: "hidden",
                border: `1px solid ${theme.sectionTeamBorder}`,
                background: theme.sectionTeamCardBg,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                height: "100%", display: "flex", flexDirection: "column",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,${isDark ? 0.45 : 0.14}), 0 0 0 1px rgba(196,30,58,0.25)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <div className="ft-member-photo" style={{
                height: 220, position: "relative",
                background: isDark ? "#141414" : "#E5E5E5",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0,
            }}>
                {!imgError ? (
                    <img
                        src={member.img}
                        alt={member.name}
                        onError={() => setImgError(true)}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            objectPosition: objectPos,
                            display: "block",
                        }}
                    />
                ) : (
                    <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: isDark ? "#1F1F1F" : "#D1D5DB",
                        border: `2px solid ${theme.red}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 900, color: theme.red,
                    }}>{initials}</div>
                )}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                    background: `linear-gradient(to top, ${isDark ? "rgba(20,20,20,0.55)" : "rgba(0,0,0,0.18)"}, transparent)`,
                    pointerEvents: "none",
                }} />
            </div>

            <div className="ft-member-body" style={{
                padding: "16px 14px 18px", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            }}>
                <h3 className="ft-member-name" style={{
                    fontFamily: "'Heebo', sans-serif", fontWeight: 800,
                    fontSize: 15, color: theme.sectionTeamText,
                    margin: "0 0 10px", lineHeight: 1.3,
                }}>{member.name}</h3>

                {/* Stylized rank subtitle */}
                <div className="ft-member-rank-badge" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: isDark
                        ? "linear-gradient(135deg, rgba(196,30,58,0.18) 0%, rgba(196,30,58,0.08) 100%)"
                        : "linear-gradient(135deg, rgba(196,30,58,0.1) 0%, rgba(196,30,58,0.04) 100%)",
                    border: `1px solid rgba(196,30,58,0.35)`,
                    borderRadius: 6,
                    padding: "5px 12px",
                }}>
                    <span style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: theme.red, flexShrink: 0,
                        boxShadow: `0 0 6px ${theme.red}`,
                    }} />
                    <span className="ft-member-rank-text" style={{
                        fontFamily: "'Heebo', sans-serif",
                        fontSize: 13, fontWeight: 700,
                        color: theme.red,
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                    }}>{member.rank}</span>
                </div>
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

// ── Section divider label ───────────────────────────────────
function SectionDivider({ label }) {
    const { theme } = useTheme();
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "64px 0 40px" }}>
            <div style={{ flex: 1, height: 1, background: theme.border }} />
            <span style={{
                fontFamily: "'Heebo', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: 3, textTransform: "uppercase", color: theme.red,
                whiteSpace: "nowrap",
            }}>{label}</span>
            <div style={{ flex: 1, height: 1, background: theme.border }} />
        </div>
    );
}

// ── Main page ───────────────────────────────────────────────
export default function FullTeamPage() {
    const { theme, isDark } = useTheme();
    const { t, lang } = useLang();
    const { navigate } = useNavigation();
    const PLACEHOLDER_COUNT = 6;

    const [featured, ...leadingRest] = t.team.members;

    const dynamicCards = dynamicMembers.map(dm => ({
        nameHe: dm.name,
        name: translateName(dm.name, lang),
        rank: translateRank(dm.rankHe, lang),
        img: dm.img,
    }));

    return (
        <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.4s ease" }}>

            {/* ── Sticky top bar ──────────────────────────── */}
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

                    <span style={{
                        fontFamily: "'Heebo', sans-serif", fontWeight: 900,
                        fontSize: 18, color: theme.text, letterSpacing: 1,
                    }}>TKM</span>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <LangToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* ── Page header ─────────────────────────────── */}
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

            {/* ── Content ─────────────────────────────────── */}
            <div style={{ padding: "0 24px 96px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                    {/* ═══ TOP: Leading Team (mirrors homepage) ═══ */}
                    <FadeIn delay={0.05}>
                        <SectionDivider label={lang === "he" ? "הצוות המוביל" : "Leading Team"} />
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div style={{ marginBottom: 36 }}>
                            <FeaturedMemberCard m={featured} isDark={isDark} theme={theme} />
                        </div>
                    </FadeIn>

                    <div className="leading-3-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 24,
                        maxWidth: 900,
                        margin: "0 auto",
                    }}>
                        {leadingRest.map((m, i) => (
                            <FadeIn key={`lead-${i}`} delay={i * 0.08}>
                                <LeadingMemberCard m={m} isDark={isDark} theme={theme} />
                            </FadeIn>
                        ))}
                    </div>

                    {/* ═══ BOTTOM: Dynamic instructors from /צוות/ ═══ */}
                    <FadeIn delay={0.05}>
                        <SectionDivider label={lang === "he" ? "כלל המדריכים" : "All Instructors"} />
                    </FadeIn>

                    <div className="full-team-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 24,
                    }}>
                        {dynamicCards.map((m, i) => (
                            <FadeIn key={`dyn-${i}`} delay={i * 0.07}>
                                <DynamicMemberCard member={m} />
                            </FadeIn>
                        ))}
                        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                            <FadeIn key={`ph-${i}`} delay={(dynamicCards.length + i) * 0.05}>
                                <PlaceholderCard />
                            </FadeIn>
                        ))}
                    </div>

                </div>
            </div>

            {/* ── Responsive styles ───────────────────────── */}
            <style>{`
                /* Desktop: 4-col → 3-col at 1100px */
                @media (max-width: 1100px) {
                    .full-team-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }

                /* Mobile: strict 3-col */
                @media (max-width: 768px) {
                    .full-team-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
                    .leading-3-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; max-width: 100% !important; }

                    /* Dynamic card photo */
                    .ft-member-photo { height: 130px !important; }
                    .ft-member-body { padding: 7px 6px 10px !important; }
                    .ft-member-name { font-size: 10px !important; line-height: 1.25 !important; margin-bottom: 6px !important; }
                    .ft-member-rank-badge { padding: 3px 7px !important; border-radius: 4px !important; }
                    .ft-member-rank-text { font-size: 10px !important; letter-spacing: 0.3px !important; }

                    /* Leading card compact */
                    .ft-leading-photo { height: 130px !important; }
                    .ft-leading-body { padding: 8px 7px !important; }
                    .ft-leading-name { font-size: 11px !important; }
                    .ft-leading-role { font-size: 10px !important; margin-bottom: 0 !important; }
                    .ft-leading-desc { display: none !important; }

                    /* Featured card stacks */
                    .ft-featured-card { flex-direction: column !important; max-width: 100% !important; }
                    .ft-featured-photo { width: 100% !important; min-height: 260px !important; }

                    .ft-back-label { display: none; }
                }

                @media (max-width: 480px) {
                    .ft-back-label { display: none; }
                    .ft-member-photo { height: 110px !important; }
                    .ft-leading-photo { height: 110px !important; }
                    .ft-member-name { font-size: 9px !important; }
                    .ft-member-rank-text { font-size: 9px !important; }
                    .ft-leading-name { font-size: 9px !important; }
                }
            `}</style>
        </div>
    );
}
