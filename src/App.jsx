import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext, LangContext, NavigationContext } from "./contexts";
import FullTeamPage from "./FullTeam";

// ============================================================
// TKM - Traditional Krav Maga — One Page Website
// Bilingual: Hebrew (RTL) + English (LTR)
// Dark/Light mode | Mobile-first | High-converting
// ============================================================

const PHONE = "0506697722";
const WHATSAPP_LINK = `https://wa.me/972${PHONE.slice(1)}`;
const INSTAGRAM_LINK = "https://www.instagram.com/traditional_krav_maga";

// --- Theme palettes ---
const themes = {
    dark: {
        bg: "#0A0A0A", bgAlt: "#141414", bgSection: "#0A0A0A", bgCard: "#141414",
        bgCardAlt: "#F5F5F5", red: "#C41E3A", redDark: "#9B1830",
        redGlow: "rgba(196, 30, 58, 0.25)", text: "#FFFFFF", textSecondary: "#9CA3AF",
        textMuted: "#6B7280", border: "#1F1F1F", borderLight: "#E5E5E5",
        surface: "#F5F5F5", surfaceCard: "#FFFFFF", navBg: "rgba(10,10,10,0.95)",
        heroGrid: "rgba(255,255,255,0.04)",
        sectionWhyBg: "#0A0A0A", sectionWhyText: "#FFFFFF",
        sectionAboutBg: "#0A0A0A",
        sectionBranchesBg: "#141414", sectionBranchesCardBg: "#1F1F1F",
        sectionBranchesCardBorder: "#2A2A2A", sectionBranchesText: "#FFFFFF",
        sectionBranchesMuted: "#9CA3AF",
        sectionTeamBg: "#0A0A0A", sectionTeamCardBg: "#141414",
        sectionTeamText: "#FFFFFF", sectionTeamBorder: "#1F1F1F",
        sectionActivitiesBg: "#141414", sectionActivitiesCardBg: "#1F1F1F",
        sectionActivitiesCardBorder: "#2A2A2A", sectionActivitiesIconBg: "#2A2A2A",
        sectionActivitiesTitle: "#FFFFFF", sectionActivitiesDesc: "#9CA3AF",
        sectionTestimonialsBg: "#0A0A0A", sectionTestimonialsText: "#FFFFFF",
        sectionTestimonialsMuted: "#6B7280", sectionTestimonialsQuote: "#9CA3AF",
        footerBg: "#141414", footerBorder: "#1F1F1F",
        contactBg: "#0A0A0A", contactText: "#FFFFFF", contactMuted: "#9CA3AF",
        contactBtnBorder: "#6B7280",
    },
    light: {
        bg: "#FFFFFF", bgAlt: "#F5F5F5", bgSection: "#FFFFFF", bgCard: "#FFFFFF",
        bgCardAlt: "#F5F5F5", red: "#C41E3A", redDark: "#9B1830",
        redGlow: "rgba(196, 30, 58, 0.2)", text: "#0A0A0A", textSecondary: "#6B7280",
        textMuted: "#9CA3AF", border: "#E5E5E5", borderLight: "#E5E5E5",
        surface: "#F5F5F5", surfaceCard: "#FFFFFF", navBg: "rgba(255,255,255,0.95)",
        heroGrid: "rgba(0,0,0,0.03)",
        sectionWhyBg: "#FFFFFF", sectionWhyText: "#0A0A0A",
        sectionAboutBg: "#F5F5F5",
        sectionBranchesBg: "#FFFFFF", sectionBranchesCardBg: "#FFFFFF",
        sectionBranchesCardBorder: "#E5E5E5", sectionBranchesText: "#0A0A0A",
        sectionBranchesMuted: "#6B7280",
        sectionTeamBg: "#F5F5F5", sectionTeamCardBg: "#FFFFFF",
        sectionTeamText: "#0A0A0A", sectionTeamBorder: "#E5E5E5",
        sectionActivitiesBg: "#F5F5F5", sectionActivitiesCardBg: "#FFFFFF",
        sectionActivitiesCardBorder: "#E5E5E5", sectionActivitiesIconBg: "#E5E5E5",
        sectionActivitiesTitle: "#0A0A0A", sectionActivitiesDesc: "#6B7280",
        sectionTestimonialsBg: "#F5F5F5", sectionTestimonialsText: "#0A0A0A",
        sectionTestimonialsMuted: "#6B7280", sectionTestimonialsQuote: "#6B7280",
        footerBg: "#F5F5F5", footerBorder: "#E5E5E5",
        contactBg: "#FFFFFF", contactText: "#0A0A0A", contactMuted: "#6B7280",
        contactBtnBorder: "#D1D5DB",
    },
};

// --- Translation dictionary ---
const translations = {
    he: {
        dir: "rtl",
        nav: { about: "אודות", branches: "סניפים", team: "צוות", activities: "פעילויות", contact: "צור קשר" },
        hero: {
            tagline: "קרב מגע מסורתי",
            line1: "השיטה הפשוטה והיעילה ביותר להגנה עצמית ומניעת אלימות.",
            line2: "מארגוני קרב המגע המובילים בישראל ובעולם.",
            cta1: "הצטרפו לאימון ניסיון",
            cta2: "דברו איתנו",
        },
        why: {
            sub: "למה אנחנו",
            title: "למה קרב מגע מסורתי?",
            benefits: [
                { icon: "🛡️", title: "ללמוד מהמקור", desc: "ארגון קרב מגע מהמובילים בעולם שמקורו בבית הספר לקרב מגע מהוותיקים והגדולים בישראל." },
                { icon: "⚡", title: "קרב מגע מתקדם", desc: "שיטה דינמית המשלבת את עקרונות הקרב מגע עם ידע מעמיק ב-BJJ, איגרוף קלאסי ואיגרוף תאילנדי." },
                { icon: "🎖️", title: "צוות מקצועי מוביל", desc: "למעלה מ-100 חגורות שחורות ועשרות מדריכים מוסמכים למגזר האזרחי ולכוחות הביטחון." },
                { icon: "👥", title: "לכל אחד ואחת", desc: "הגנה עצמית וכושר גופני המותאמים אישית לילדים, נוער, נשים וגברים בכל רמת כושר." },
            ],
        },
        about: {
            sub: "אודות",
            title: "על הארגון",
            p1_pre: "הארגון הוקם על ידי ",
            p1_founder: "גראנד מאסטר ארז שרעבי",
            p1_mid: " ותלמידיו הבכירים, על מנת לשמר את עקרונות הקרב מגע ואת רוח האימונים כפי שהונחלו על ידי מייסד השיטה ",
            p1_imi: "אימי ליכטנפלד",
            p1_mid2: " (שדה אור) ז\"ל ותלמידו הבכיר ",
            p1_eli: "אלי אביקזר",
            p1_end: " ז\"ל.",
            p2: "בין חברי הארגון נמנים עשרות חגורות שחורות מוסמכי וינגייט וצה\"ל. הארגון שואף לפתח, לייעל ולשפר את השיטה תוך התבססות על עקרונות הקרב מגע ורוח המייסדים.",
            stats: [
                { target: 1990, suffix: "", label: "פעילים מאז" },
                { target: 40, suffix: "+", label: "מדריכים מוסמכים" },
                { target: 100, suffix: "+", label: "חגורות שחורות" },
            ],
        },
        branches: {
            sub: "איפה אנחנו",
            title: "סניפים בארץ ובעולם",
            contactBtn: "צרו קשר",
            headInstructor: "מדריך ראשי",
            list: [
                { city: "אבן יהודה", country: "ישראל", flag: "🇮🇱", instructor: "ארז שרעבי" },
                { city: "קרית השרון", country: "ישראל", flag: "🇮🇱", instructor: "ארז שרעבי" },
                { city: "מתן", country: "ישראל", flag: "🇮🇱", instructor: "חיים נחום" },
                { city: "רמת חן", country: "ישראל", flag: "🇮🇱", instructor: "איציק טרבלוס" },
                { city: "ניו יורק", country: "ארה״ב", flag: "🇺🇸", instructor: "אלירן כהן" },
                { city: "ניו ג׳רזי", country: "ארה״ב", flag: "🇺🇸", instructor: "חיים לוי" },
                { city: "ברוקלין", country: "ארה״ב", flag: "🇺🇸", instructor: "בן קזין ויוסף פרידמן" },
            ],
        },
        team: {
            sub: "הצוות",
            title: "צוות ההדרכה",
            more: "+ עשרות מדריכים מוסמכים נוספים ברחבי הארץ והעולם",
            showMoreBtn: "לצפייה במדריכים נוספים",
            showLessBtn: "הסתר",
            viewFullTeam: "צפו בצוות הבינלאומי המלא",
            backHome: "חזרה לעמוד הבית",
            fullTeamSub: "הצוות המלא",
            fullTeamTitle: "צוות ההדרכה הבינלאומי",
            members: [
                { name: "גראנד מאסטר ארז שרעבי", rank: "דאן 8", role: "מאמן ראשי ומייסד", desc: "גראנד מאסטר ארז שרעבי - מייסד וראש ארגון TKM. מאמן ראשי בדרגת דאן 8, בעל ניסיון של עשרות שנים בהכשרת דורות של לוחמים ומדריכים. מומחה רב-תחומי באמנויות לחימה: מדריך מוסמך בג'יו-ג'יטסו ברזילאי (BJJ) וחגורה חומה, ובעל רקע נרחב ומעמיק באיגרוף קלאסי ובאיגרוף תאילנדי.", img: "/member-1.jpg" },
                { name: "חיים נחום", rank: "דאן 6", role: "מאמן סניף מתן", desc: "מייסד ומדריך ראשי בסניף מתן. מתאמן מ-1990 אצל אלי אביקזר ז\"ל.", img: "/member-2.jpg" },
                { name: "אלירן דובז'ינסקי", rank: "דאן 5", role: "מדריך סניף אבן יהודה", desc: "מתאמן מ-1991. לשעבר מדריך קרב מגע במשטרת ישראל. מעביר סמינרים בארץ ובעולם.", img: "/member-3.jpg" },
                { name: "אלירן כהן", rank: "דאן 4", role: "מדריך ראשי סניף ניו-יורק", desc: "מתאמן מ-1988 אצל אלי אביקזר ז\"ל. שירת כמדריך קרב מגע בחיל הים.", img: "/member-4.jpg" },
            ],
        },
        activities: {
            sub: "מה אנחנו מציעים",
            title: "פעילויות",
            items: [
                { title: "שיעורים במכונים", desc: "אימוני קרב מגע שוטפים לכל הרמות בסניפים שלנו." },
                { title: "סדנאות הגנה עצמית לנשים", desc: "סדנאות ייעודיות המותאמות לנשים ונערות." },
                { title: "סדנאות למקומות עבודה", desc: "הכשרות הגנה עצמית לארגונים, חברות וצוותים." },
                { title: "גופי ביטחון ואבטחה", desc: "הכשרת כוחות ביטחון, אבטחה ואכיפת חוק." },
                { title: "שיעורים פרטיים", desc: "אימון אישי מותאם בקצב ובדגשים שלכם." },
                { title: "קורס מדריכים", desc: "הכשרה מקצועית להסמכת מדריכי קרב מגע." },
            ],
        },
        seminars: {
            sub: "ברחבי העולם",
            title: "הפעילות שלנו בעולם",
        },
        contact: {
            sub: "צור קשר",
            title: "בואו להתאמן",
            desc: "רוצים להתחיל? צרו קשר ותיאמו אימון ניסיון ללא התחייבות.",
        },
        footer: { subtitle: "קרב מגע מסורתי", accessibility: "הצהרת נגישות", privacy: "מדיניות פרטיות" },
        ui: { close: "סגירה", menu: "תפריט", lightMode: "מצב בהיר", darkMode: "מצב כהה", langSwitch: "EN" },
        accessibilityTitle: "הצהרת נגישות",
        privacyTitle: "מדיניות פרטיות",
    },
    en: {
        dir: "ltr",
        nav: { about: "About", branches: "Branches", team: "Team", activities: "Activities", contact: "Contact" },
        hero: {
            tagline: "Traditional Krav Maga",
            line1: "The simplest and most effective system for self-defense and violence prevention.",
            line2: "One of the leading Krav Maga organizations in Israel and worldwide.",
            cta1: "Join a Trial Session",
            cta2: "Talk to Us",
        },
        why: {
            sub: "Why Us",
            title: "Why Traditional Krav Maga?",
            benefits: [
                { icon: "", title: "Learning from the Source", desc: "One of the world's leading Krav Maga organizations, originating from one of the oldest and largest Krav Maga schools in Israel." },
                { icon: "", title: "Advanced Krav Maga", desc: "A dynamic system combining Krav Maga principles with deep knowledge of BJJ, classic boxing, and Muay Thai." },
                { icon: "", title: "Leading Professional Team", desc: "Over 100 black belts and dozens of certified instructors for civilians and security forces." },
                { icon: "", title: "For Everyone", desc: "Self-defense and fitness personally tailored for children, youth, women, and men at any fitness level." },
            ],
        },
        about: {
            sub: "About",
            title: "About the Organization",
            p1_pre: "The organization was founded by ",
            p1_founder: "Grand Master Erez Sharaby",
            p1_mid: " and his senior students, to preserve the principles of Krav Maga as transmitted by the system's founder ",
            p1_imi: "Imi Lichtenfeld",
            p1_mid2: " (Sde Or) z\"l and his senior student ",
            p1_eli: "Eli Avigzar",
            p1_end: " z\"l.",
            p2: "Among our members are dozens of black belts, Wingate and IDF certified. The organization strives to develop, improve, and refine the system while upholding the principles and spirit of its founders.",
            stats: [
                { target: 1990, suffix: "", label: "Active Since" },
                { target: 40, suffix: "+", label: "Certified Instructors" },
                { target: 100, suffix: "+", label: "Black Belts" },
            ],
        },
        branches: {
            sub: "Where We Are",
            title: "Branches in Israel & Worldwide",
            contactBtn: "Contact",
            headInstructor: "Head Instructor",
            list: [
                { city: "Even Yehuda", country: "Israel", flag: "🇮🇱", instructor: "Erez Sharaby" },
                { city: "Kiryat HaSharon", country: "Israel", flag: "🇮🇱", instructor: "Erez Sharaby" },
                { city: "Matan", country: "Israel", flag: "🇮🇱", instructor: "Haim Nahum" },
                { city: "Ramat Chen", country: "Israel", flag: "🇮🇱", instructor: "Itzik Trabelsi" },
                { city: "New York", country: "USA", flag: "🇺🇸", instructor: "Eliran Cohen" },
                { city: "New Jersey", country: "USA", flag: "🇺🇸", instructor: "Chaim Levi" },
                { city: "Brooklyn", country: "USA", flag: "🇺🇸", instructor: "Ben Kazin & Yosef Friedman" },
            ],
        },
        team: {
            sub: "The Team",
            title: "Instruction Team",
            more: "+ Dozens of additional certified instructors worldwide",
            showMoreBtn: "Show More Instructors",
            showLessBtn: "Show Less",
            viewFullTeam: "View Full International Team",
            backHome: "Back to Home",
            fullTeamSub: "Full Team",
            fullTeamTitle: "International Instruction Team",
            members: [
                { name: "Grand Master Erez Sharaby", rank: "Dan 8", role: "Head Coach & Founder", desc: "Grand Master Erez Sharaby - Founder and Head of TKM. A Senior Head Coach with an 8th Degree Black Belt (Dan 8). A multi-disciplinary martial arts expert: Certified Brazilian Jiu-Jitsu (BJJ) Instructor and Brown Belt, with an extensive and profound background in Classical Boxing and Muay Thai.", img: "/member-1.jpg" },
                { name: "Haim Nahum", rank: "Dan 6", role: "Head of Matan Branch", desc: "Founder and head instructor of the Matan branch. Training since 1990 with Eli Avigzar z\"l.", img: "/member-2.jpg" },
                { name: "Eliran Dubzhinski", rank: "Dan 5", role: "Instructor, Even Yehuda", desc: "Training since 1991. Former Krav Maga instructor for the Israel Police. Conducts seminars in Israel and worldwide.", img: "/member-3.jpg" },
                { name: "Eliran Cohen", rank: "Dan 4", role: "Head Instructor, New York", desc: "Training since 1988 with Eli Avigzar z\"l. Served as Krav Maga instructor in the Israeli Navy.", img: "/member-4.jpg" },
            ],
        },
        activities: {
            sub: "What We Offer",
            title: "Activities",
            items: [
                { title: "Regular Classes", desc: "Ongoing Krav Maga training for all levels at our branches." },
                { title: "Women's Self-Defense Workshops", desc: "Dedicated workshops tailored for women and girls." },
                { title: "Workplace Workshops", desc: "Self-defense training for organizations, companies, and teams." },
                { title: "Security & Law Enforcement", desc: "Training for security forces, law enforcement, and military personnel." },
                { title: "Private Lessons", desc: "Personalized training at your own pace and focus areas." },
                { title: "Instructor Certification Course", desc: "Professional training for Krav Maga instructor certification." },
            ],
        },
        seminars: {
            sub: "Around the World",
            title: "Our Global Activities",
        },
        contact: {
            sub: "Get In Touch",
            title: "Start Training",
            desc: "Want to start? Contact us and schedule a free trial session with no obligation.",
        },
        footer: { subtitle: "Traditional Krav Maga", accessibility: "Accessibility Statement", privacy: "Privacy Policy" },
        ui: { close: "Close", menu: "Menu", lightMode: "Light Mode", darkMode: "Dark Mode", langSwitch: "עב" },
        accessibilityTitle: "Accessibility Statement",
        privacyTitle: "Privacy Policy",
    },
};

// --- Context hooks ---
function useTheme() { return useContext(ThemeContext); }
function useLang() { return useContext(LangContext); }
function useNavigation() { return useContext(NavigationContext); }

// Backward-compatible mutable color ref
let C = { ...themes.dark, black: "#0A0A0A", blackLight: "#141414", white: "#FFFFFF", gray100: "#F5F5F5", gray200: "#E5E5E5", gray400: "#9CA3AF", gray600: "#6B7280", gray800: "#1F1F1F" };

// --- Intersection Observer hook ---
function useInView(threshold = 0.15) {
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

// --- Animated section wrapper ---
function FadeIn({ children, delay = 0, className = "" }) {
    const [ref, visible] = useInView(0.1);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

// --- Section heading ---
function SectionTitle({ sub, title, light = false }) {
    const { theme } = useTheme();
    return (
        <div style={{ marginBottom: 48, textAlign: "center" }}>
            <span style={{
                fontFamily: "'Heebo', sans-serif", fontSize: 13, fontWeight: 700,
                letterSpacing: 3, textTransform: "uppercase", color: theme.red,
                display: "block", marginBottom: 12,
            }}>{sub}</span>
            <h2 style={{
                fontFamily: "'Heebo', sans-serif", fontSize: "clamp(28px, 5vw, 42px)",
                fontWeight: 900, color: light ? "#FFFFFF" : theme.text, margin: 0, lineHeight: 1.2,
            }}>{title}</h2>
            <div style={{ width: 48, height: 3, background: theme.red, margin: "16px auto 0", borderRadius: 2 }} />
        </div>
    );
}

// --- Language Toggle Button ---
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

// --- Theme Toggle Button ---
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

// --- WhatsApp floating button ---
function WhatsAppFab() {
    const { lang } = useLang();
    const [pulse, setPulse] = useState(false);
    useEffect(() => {
        const t = setInterval(() => setPulse(p => !p), 2000);
        return () => clearInterval(t);
    }, []);
    return (
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
                position: "fixed", bottom: 24,
                [lang === "he" ? "left" : "right"]: 24,
                zIndex: 999, width: 60, height: 60, borderRadius: "50%",
                background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: pulse
                    ? "0 0 0 12px rgba(37,211,102,0.2), 0 4px 20px rgba(0,0,0,0.3)"
                    : "0 4px 20px rgba(0,0,0,0.3)",
                transition: "box-shadow 0.6s ease", textDecoration: "none",
            }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        </a>
    );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, isDark } = useTheme();
    const { t } = useLang();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const links = [
        { label: t.nav.about, href: "#about" },
        { label: t.nav.branches, href: "#branches" },
        { label: t.nav.team, href: "#team" },
        { label: t.nav.activities, href: "#activities" },
        { label: t.nav.contact, href: "#contact" },
    ];

    const navBg = scrolled ? theme.navBg : "transparent";
    const navShadow = scrolled ? `0 2px 20px rgba(0,0,0,${isDark ? 0.3 : 0.1})` : "none";

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: navBg, backdropFilter: scrolled ? "blur(12px)" : "none",
            boxShadow: navShadow, transition: "background 0.3s, box-shadow 0.3s", padding: "0 24px",
        }}>
            <div style={{
                maxWidth: 1200, margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "space-between", height: 96,
            }}>
                <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <span style={{
                        fontFamily: "'Heebo', sans-serif", fontWeight: 800, fontSize: 28,
                        color: theme.text, letterSpacing: 1,
                    }}>TKM</span>
                    <img
                        src="/לוגו סופי.png"
                        alt="Krav Maga Logo"
                        onError={e => e.target.style.display = "none"}
                        style={{
                            height: 96, width: "auto", display: "block",
                            background: "transparent", objectFit: "contain",
                        }}
                    />
                </a>

                <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="nav-desktop">
                    {links.map((l, i) => (
                        <a key={i} href={l.href} style={{
                            fontFamily: "'Heebo', sans-serif", fontWeight: 500, fontSize: 14,
                            color: theme.textSecondary, textDecoration: "none", transition: "color 0.2s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = theme.text}
                            onMouseLeave={e => e.currentTarget.style.color = theme.textSecondary}
                        >{l.label}</a>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <LangToggle />
                    <ThemeToggle />
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="nav-mobile-btn"
                        aria-label={t.ui.menu}
                        style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
                    >
                        <div style={{ width: 24, height: 2, background: theme.text, marginBottom: 6, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
                        <div style={{ width: 24, height: 2, background: theme.text, marginBottom: 6, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
                        <div style={{ width: 24, height: 2, background: theme.text, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
                    </button>
                </div>
            </div>

            <div className="nav-mobile-menu" style={{
                display: menuOpen ? "flex" : "none", flexDirection: "column", gap: 0,
                background: isDark ? "rgba(10,10,10,0.98)" : "rgba(255,255,255,0.98)", padding: "8px 0 16px",
            }}>
                {links.map((l, i) => (
                    <a key={i} href={l.href} onClick={() => setMenuOpen(false)} style={{
                        fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: 16,
                        color: theme.textSecondary, textDecoration: "none", padding: "14px 24px",
                        borderBottom: `1px solid ${theme.border}`, transition: "color 0.2s",
                    }}>{l.label}</a>
                ))}
            </div>

            <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }

          /* Activities — 2-col on mobile */
          .grid-mobile-2 {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          /* Branches & Instructors — 3-col on mobile */
          .grid-mobile-3 {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }

          /* Branches — compact for 3-col */
          .branch-card { padding: 10px 7px !important; gap: 6px !important; }
          .branch-city { font-size: 11px !important; line-height: 1.2 !important; }
          .branch-country { font-size: 10px !important; margin-top: 2px !important; }
          .branch-instructor { font-size: 10px !important; }
          .branch-icon { width: 26px !important; height: 26px !important; }
          .branch-contact { display: none !important; }

          /* Instructors — compact for 3-col */
          .member-photo { height: 150px !important; }
          .member-body { padding: 8px 7px !important; }
          .member-name { font-size: 11px !important; line-height: 1.3 !important; }
          .member-role { font-size: 10px !important; margin-bottom: 0 !important; }
          .member-desc { display: none !important; }

          /* Activities mobile */
          .activity-card { padding: 16px 12px !important; gap: 10px !important; flex-direction: column !important; }
          .activity-icon { width: 38px !important; height: 38px !important; }
          .activity-title { font-size: 14px !important; }
          .activity-desc { font-size: 12px !important; }

          /* Seminars slider height */
          .seminars-stage { height: 280px !important; }

          /* Featured Grand Master card — stack vertically on mobile */
          .featured-member-card { flex-direction: column !important; max-width: 100% !important; }
          .featured-photo-panel { width: 100% !important; min-height: 260px !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
        </nav>
    );
}

// ============================================================
// HERO SECTION
// ============================================================
function Hero() {
    const [loaded, setLoaded] = useState(false);
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

    return (
        <section id="hero" style={{
            position: "relative", minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center", overflow: "hidden",
            background: isDark ? "#0A0A0A" : "#FFFFFF", transition: "background 0.4s ease",
        }}>
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `radial-gradient(circle at 20% 80%, ${theme.redGlow} 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(196,30,58,0.08) 0%, transparent 40%)`,
                zIndex: 1,
            }} />
            <div style={{
                position: "absolute", inset: 0, opacity: 0.04,
                backgroundImage: `linear-gradient(${C.white} 1px, transparent 1px), linear-gradient(90deg, ${C.white} 1px, transparent 1px)`,
                backgroundSize: "60px 60px", zIndex: 1,
            }} />

            <div style={{
                position: "relative", zIndex: 2, textAlign: "center",
                padding: "0 24px", maxWidth: 800, margin: "0 auto", width: "100%",
            }}>
                <div style={{
                    opacity: loaded ? 1 : 0, transform: loaded ? "scale(1)" : "scale(0.8)",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)", marginBottom: 32,
                }}>
                    <img
                        src="/לוגו סופי.png"
                        alt="Krav Maga Logo"
                        onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                        style={{ height: 192, width: "auto", margin: "0 auto", display: "block", objectFit: "contain", background: "transparent" }}
                    />
                    <div style={{
                        display: "none", width: 96, height: 96, margin: "0 auto",
                        border: `2px solid ${C.red}`, borderRadius: "50%",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 32, fontWeight: 900, color: C.red,
                        fontFamily: "'Heebo', sans-serif", boxShadow: `0 0 40px ${C.redGlow}`,
                    }}>TKM</div>
                </div>

                <h1 style={{
                    fontFamily: "'Heebo', sans-serif", fontWeight: 900,
                    fontSize: "clamp(36px, 8vw, 72px)", lineHeight: 1.05,
                    color: theme.text, margin: 0,
                    opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.8s ease 0.2s",
                }}>
                    {t.hero.tagline}
                </h1>

                <p style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: "clamp(14px, 2.5vw, 18px)",
                    color: theme.textSecondary, marginTop: 20, lineHeight: 1.7,
                    maxWidth: 520, marginInline: "auto",
                    opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.8s ease 0.4s",
                }}>
                    {t.hero.line1}{t.hero.line2 && <><br />{t.hero.line2}</>}
                </p>

                <div style={{
                    marginTop: 40, display: "flex", gap: 16,
                    justifyContent: "center", flexWrap: "wrap",
                    opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.8s ease 0.6s",
                }}>
                    <a href="#branches" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "16px 36px", background: theme.red, color: "#FFFFFF",
                        fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 16,
                        borderRadius: 4, textDecoration: "none",
                        boxShadow: `0 4px 24px ${theme.redGlow}`, transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${theme.redGlow}`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 24px ${theme.redGlow}`; }}
                    >
                        {t.hero.cta1}
                    </a>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "16px 36px", background: "transparent",
                        border: `1px solid ${theme.textMuted}`, color: theme.text,
                        fontFamily: "'Heebo', sans-serif", fontWeight: 500, fontSize: 16,
                        borderRadius: 4, textDecoration: "none", transition: "border-color 0.2s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = theme.red}
                        onMouseLeave={e => e.currentTarget.style.borderColor = theme.textMuted}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        {t.hero.cta2}
                    </a>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// WHY TKM (Benefits) — Image slideshow cards
// ============================================================
// Build correctly encoded public image paths from Hebrew folder names + explicit filenames
function makeImgList(folder, files) {
    return files.map(f => `/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`);
}

function ImageSlideshow({ images, isHovered }) {
    const [activeImg, setActiveImg] = useState(0);
    const [loaded, setLoaded] = useState({});

    useEffect(() => {
        if (images.length < 2) return;
        const timer = setInterval(() => setActiveImg(a => (a + 1) % images.length), 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <>
            {images.map((src, i) => (
                <div key={src} style={{
                    position: "absolute", inset: 0, overflow: "hidden",
                    opacity: i === activeImg ? 1 : 0,
                    transition: "opacity 1.4s ease",
                    transform: isHovered ? "scale(1.06)" : "scale(1.0)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "1.4s, 0.6s",
                    transitionTimingFunction: "ease, cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                    <img
                        src={src}
                        alt=""
                        onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}
                        onError={() => setLoaded(prev => ({ ...prev, [i]: false }))}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "cover", objectPosition: "bottom",
                            display: "block",
                        }}
                    />
                    {loaded[i] === false && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, #1a0a0a 0%, #2a1010 50%, #1a0a0a 100%)",
                        }} />
                    )}
                </div>
            ))}
        </>
    );
}

function WhySection() {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    const benefitImages = [
        makeImgList("מסורת אותנטית", [
            "WhatsApp Image 2026-03-13 at 22.43.09.jpeg",
            "WhatsApp Image 2026-03-13 at 23.50.54.jpeg",
            "WhatsApp Image 2026-03-14 at 19.58.13.jpeg",
            "WhatsApp Image 2026-03-14 at 3646436.jpeg",
            "img1.jpg.jpeg",
            "img2.jpg.jpeg",
        ]),
        makeImgList("פשוט ויעיל", [
            "67567.jpeg",
            "IMG_7159_2.jpg",
            "TKM_in_action_192.jpg",
            "img1.jpg.jpeg",
            "img2.jpg.jpeg",
            "img3.jpg.jpeg",
            "img4.jpg.jpeg",
        ]),
        makeImgList("מדריכים מוסמכים", [
            "WhatsApp Image 2026-03-13 at 22.41.12.jpeg",
            "WhatsApp Image 2026-03-13 at 22.43.04.jpeg",
            "WhatsApp Image 2026-03-13 at 22.43.12.jpeg",
            "WhatsApp Image 2026-03-13 at 22.46.28.jpeg",
            "WhatsApp Image 2026-03-13 at 23.45.00.jpeg",
            "WhatsApp Image 2026-03-13 at 23.49.53.jpeg",
        ]),
        makeImgList("לכל אחד ואחת", [
            "Copy of IMG_7032_2.jpg",
            "IMG_6581.jpg",
            "TKM 06-15-23 68.jpg",
            "WhatsApp Image 2026-03-13 at 22.37.03.jpeg",
            "WhatsApp Image 2026-03-13 at 22.43.09.jpeg",
            "img2.jpg.jpeg",
        ]),
    ];
    const benefits = t.why.benefits.map((b, i) => ({ ...b, images: benefitImages[i] }));
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <section id="why" style={{
            padding: "96px 24px", background: theme.sectionWhyBg, transition: "background 0.4s ease",
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <FadeIn>
                    <SectionTitle sub={t.why.sub} title={t.why.title} light={isDark} />
                </FadeIn>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 16,
                }}>
                    {benefits.map((b, i) => {
                        const isHovered = hoveredIdx === i;
                        return (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {/* Title above card — uses theme-aware color so it's visible in both light & dark */}
                                    <div style={{ textAlign: "center" }}>
                                        <h3 style={{
                                            fontFamily: "'Heebo', sans-serif", fontWeight: 800,
                                            fontSize: 20, color: theme.sectionWhyText, margin: "0 0 8px",
                                            letterSpacing: 0.3,
                                        }}>{b.title}</h3>
                                        <div style={{
                                            width: 32, height: 3, background: "#E11D48",
                                            borderRadius: 2, margin: "0 auto",
                                        }} />
                                    </div>
                                    {/* Card: image slider + description pinned to bottom */}
                                    <div
                                        onMouseEnter={() => setHoveredIdx(i)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                        style={{
                                            position: "relative", borderRadius: 10, overflow: "hidden",
                                            height: 300, cursor: "default",
                                            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
                                            transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                                            boxShadow: isHovered
                                                ? "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px #E11D48"
                                                : "0 4px 20px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        <ImageSlideshow images={b.images} isHovered={isHovered} />
                                        {/* Bottom-up gradient overlay */}
                                        <div style={{
                                            position: "absolute", inset: 0,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.1) 100%)",
                                            zIndex: 1,
                                        }} />
                                        {/* Description pinned to bottom */}
                                        <div style={{
                                            position: "absolute", bottom: 0, left: 0, right: 0,
                                            padding: "0 20px 24px", zIndex: 2,
                                            textAlign: "center",
                                        }}>
                                            <p style={{
                                                fontFamily: "'Heebo', sans-serif", fontSize: 14,
                                                color: "#FFFFFF", lineHeight: 1.75, margin: 0,
                                                textShadow: "0 1px 8px rgba(0,0,0,0.95)",
                                                fontWeight: 500,
                                            }}>{b.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// ABOUT SECTION
// ============================================================
function About() {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    return (
        <section id="about" style={{
            padding: "96px 24px", background: theme.sectionAboutBg,
            position: "relative", overflow: "hidden", transition: "background 0.4s ease",
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
            }} />
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <FadeIn>
                    <SectionTitle sub={t.about.sub} title={t.about.title} light={isDark} />
                </FadeIn>
                <FadeIn delay={0.15}>
                    <p style={{
                        fontFamily: "'Heebo', sans-serif", fontSize: "clamp(16px, 2.2vw, 18px)",
                        color: theme.textSecondary, lineHeight: 1.9, textAlign: "center", margin: 0,
                    }}>
                        {t.about.p1_pre}
                        <strong style={{ color: theme.text }}>{t.about.p1_founder}</strong>
                        {t.about.p1_mid}
                        <strong style={{ color: theme.text }}>{t.about.p1_imi}</strong>
                        {t.about.p1_mid2}
                        <strong style={{ color: theme.text }}>{t.about.p1_eli}</strong>
                        {t.about.p1_end}
                    </p>
                </FadeIn>
                <FadeIn delay={0.25}>
                    <p style={{
                        fontFamily: "'Heebo', sans-serif", fontSize: 16,
                        color: theme.textSecondary, lineHeight: 1.9, textAlign: "center", marginTop: 24,
                    }}>
                        {t.about.p2}
                    </p>
                </FadeIn>
                <AnimatedStats stats={t.about.stats} />
            </div>
        </section>
    );
}

function AnimatedStat({ target, suffix = "", label, delay = 0 }) {
    const [ref, visible] = useInView(0.3);
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!visible || hasAnimated.current) return;
        hasAnimated.current = true;
        const duration = 2000;
        const startTime = performance.now() + delay * 1000;
        let raf;
        function animate(now) {
            const elapsed = now - startTime;
            if (elapsed < 0) { raf = requestAnimationFrame(animate); return; }
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) raf = requestAnimationFrame(animate);
        }
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [visible, target, delay]);

    return (
        <div ref={ref} style={{ textAlign: "center" }}>
            <div style={{
                fontFamily: "'Heebo', sans-serif", fontSize: 48,
                fontWeight: 900, color: C.red, lineHeight: 1,
                direction: "ltr", display: "inline-block",
            }}>
                {count}{suffix}
            </div>
            <div style={{ fontFamily: "'Heebo', sans-serif", fontSize: 14, color: C.gray600, marginTop: 10 }}>
                {label}
            </div>
        </div>
    );
}

function AnimatedStats({ stats }) {
    const [ref, visible] = useInView(0.2);
    return (
        <div ref={ref} style={{
            display: "flex", justifyContent: "center", gap: 56, marginTop: 56,
            flexWrap: "wrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
        }}>
            {stats.map((s, i) => (
                <AnimatedStat key={i} target={s.target} suffix={s.suffix} label={s.label} delay={i * 0.2} />
            ))}
        </div>
    );
}

// ============================================================
// BRANCHES — Grid cards
// ============================================================
function Branches() {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <section id="branches" style={{
            padding: "96px 24px", background: theme.sectionBranchesBg, transition: "background 0.4s ease",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <FadeIn>
                    <SectionTitle sub={t.branches.sub} title={t.branches.title} />
                </FadeIn>
                <div className="grid-mobile-3" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 16,
                }}>
                    {t.branches.list.map((b, i) => {
                        const isHovered = hoveredIdx === i;
                        return (
                            <FadeIn key={i} delay={i * 0.08}>
                                <div
                                    className="branch-card"
                                    onMouseEnter={() => setHoveredIdx(i)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    style={{
                                        background: theme.sectionBranchesCardBg,
                                        borderRadius: 10, padding: "28px 24px",
                                        border: `1px solid ${isHovered ? theme.red : theme.sectionBranchesCardBorder}`,
                                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                                        boxShadow: isHovered
                                            ? `0 12px 32px rgba(0,0,0,${isDark ? 0.3 : 0.08}), 0 0 0 1px ${theme.red}`
                                            : `0 1px 4px rgba(0,0,0,${isDark ? 0.2 : 0.04})`,
                                        display: "flex", flexDirection: "column", gap: 16,
                                        height: "100%", boxSizing: "border-box",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="branch-icon" style={{
                                            width: 44, height: 44, borderRadius: 10,
                                            background: isHovered ? theme.red : (isDark ? "#2A2A2A" : "#F5F5F5"),
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            transition: "background 0.3s", flexShrink: 0,
                                        }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                stroke={isHovered ? C.white : C.red}
                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                style={{ transition: "stroke 0.3s" }}>
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="branch-city" style={{
                                                fontFamily: "'Heebo', sans-serif", fontWeight: 800,
                                                fontSize: 20, color: theme.sectionBranchesText, margin: 0, lineHeight: 1.2,
                                            }}>{b.city}</h3>
                                            <span className="branch-country" style={{
                                                fontFamily: "'Heebo', sans-serif", fontSize: 14,
                                                color: theme.sectionBranchesMuted, display: "flex", alignItems: "center", gap: 4, marginTop: 4,
                                            }}>
                                                <span style={{ fontSize: 13 }}>{b.flag}</span> {b.country}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ height: 1, background: theme.sectionBranchesCardBorder, width: "100%" }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                                        <div>
                                            <div style={{
                                                fontFamily: "'Heebo', sans-serif", fontSize: 11,
                                                fontWeight: 700, color: theme.sectionBranchesMuted, letterSpacing: 1,
                                                textTransform: "uppercase", marginBottom: 4,
                                            }}>{t.branches.headInstructor}</div>
                                            <div className="branch-instructor" style={{
                                                fontFamily: "'Heebo', sans-serif", fontSize: 15,
                                                fontWeight: 600, color: theme.sectionBranchesText,
                                            }}>{b.instructor}</div>
                                        </div>
                                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                                            className="branch-contact"
                                            style={{
                                                display: "inline-flex", alignItems: "center", gap: 5,
                                                padding: "8px 16px", borderRadius: 6,
                                                background: isHovered ? theme.red : (isDark ? "#2A2A2A" : "#F5F5F5"),
                                                color: isHovered ? "#FFFFFF" : theme.red,
                                                fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 13,
                                                textDecoration: "none", transition: "all 0.3s",
                                            }}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                            {t.branches.contactBtn}
                                        </a>
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// INSTRUCTORS SECTION
// ============================================================
function MemberPhoto({ member, isDark, theme }) {
    const [imgError, setImgError] = useState(false);
    const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    return (
        <div className="member-photo" style={{
            height: 220, position: "relative",
            background: isDark ? "#141414" : "#E5E5E5",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
            {!imgError ? (
                <img
                    src={member.img}
                    alt={member.name}
                    onError={() => setImgError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: member.name.includes("איציק טרבלסי") ? "center" : "bottom" }}
                />
            ) : (
                <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: isDark ? "#1F1F1F" : "#D1D5DB", border: `2px solid ${theme.red}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 900, color: C.red,
                }}>
                    {initials}
                </div>
            )}
            <span style={{
                position: "absolute", top: 12, left: 12,
                background: C.red, color: C.white,
                fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 700,
                padding: "4px 12px", borderRadius: 3,
            }}>{member.rank}</span>
        </div>
    );
}

function MemberCard({ m, isDark, theme }) {
    return (
        <div style={{
            borderRadius: 8, overflow: "hidden",
            border: `1px solid ${theme.sectionTeamBorder}`,
            transition: "transform 0.3s, box-shadow 0.3s",
            height: "100%", display: "flex", flexDirection: "column",
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <MemberPhoto member={m} isDark={isDark} theme={theme} />
            <div className="member-body" style={{ padding: "24px 20px", background: theme.sectionTeamCardBg, flex: 1 }}>
                <h3 className="member-name" style={{
                    fontFamily: "'Heebo', sans-serif", fontWeight: 800,
                    fontSize: 18, color: theme.sectionTeamText, margin: "0 0 4px",
                }}>{m.name}</h3>
                <div className="member-role" style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 13,
                    color: theme.red, fontWeight: 600, marginBottom: 12,
                }}>{m.role}</div>
                <p className="member-desc" style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 14,
                    color: theme.textSecondary, lineHeight: 1.6, margin: 0,
                }}>{m.desc}</p>
            </div>
        </div>
    );
}

function FeaturedMemberCard({ m, isDark, theme }) {
    const [imgError, setImgError] = useState(false);
    const initials = m.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const glowBase = `0 0 0 1px rgba(196,30,58,0.25), 0 0 56px rgba(196,30,58,0.1), 0 20px 56px rgba(0,0,0,${isDark ? 0.45 : 0.1})`;
    const glowHover = `0 0 0 1px rgba(196,30,58,0.6), 0 0 64px rgba(196,30,58,0.2), 0 24px 64px rgba(0,0,0,${isDark ? 0.55 : 0.14})`;

    return (
        <div
            className="featured-member-card"
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
            {/* ── Photo panel ── */}
            <div className="featured-photo-panel" style={{
                width: 280, flexShrink: 0, position: "relative",
                background: isDark ? "#141414" : "#E0E0E0",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                {!imgError ? (
                    <img src={m.img} alt={m.name} onError={() => setImgError(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: m.name.includes("איציק טרבלסי") ? "center" : "bottom", display: "block" }} />
                ) : (
                    <div style={{
                        width: 96, height: 96, borderRadius: "50%",
                        background: isDark ? "#1F1F1F" : "#D1D5DB",
                        border: `2px solid ${theme.red}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Heebo', sans-serif", fontSize: 28, fontWeight: 900, color: theme.red,
                    }}>{initials}</div>
                )}
                {/* Rank badge */}
                <span style={{
                    position: "absolute", top: 14, left: 14,
                    background: theme.red, color: "#FFFFFF",
                    fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 700,
                    padding: "4px 12px", borderRadius: 3,
                }}>{m.rank}</span>
                {/* Gold-tinted bottom gradient */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 90,
                    background: "linear-gradient(to top, rgba(212,175,55,0.12), transparent)",
                    pointerEvents: "none",
                }} />
            </div>

            {/* ── Text panel ── */}
            <div style={{ padding: "32px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {/* Gold "Grand Master" label */}
                <span style={{
                    display: "block", marginBottom: 14,
                    fontFamily: "'Heebo', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: 2.5, textTransform: "uppercase",
                    color: "rgba(212,175,55,0.85)",
                }}>✦ GRAND MASTER</span>
                {/* Role */}
                <div style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 13,
                    color: theme.red, fontWeight: 700, marginBottom: 16, letterSpacing: 0.3,
                }}>{m.role}</div>
                {/* Full bio */}
                <p style={{
                    fontFamily: "'Heebo', sans-serif", fontSize: 15,
                    color: theme.sectionTeamText, lineHeight: 1.8, margin: 0,
                }}>{m.desc}</p>
            </div>
        </div>
    );
}

function Instructors() {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    const { navigate } = useNavigation();

    const [featured, ...rest] = t.team.members;

    return (
        <section id="team" style={{
            padding: "96px 24px", background: theme.sectionTeamBg, transition: "background 0.4s ease",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <FadeIn>
                    <SectionTitle sub={t.team.sub} title={t.team.title} />
                </FadeIn>

                {/* ── Featured: Grand Master ── */}
                <FadeIn delay={0.1}>
                    <FeaturedMemberCard m={featured} isDark={isDark} theme={theme} />
                </FadeIn>

                {/* ── Rest of team ── */}
                <div className="grid-mobile-3" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 24,
                }}>
                    {rest.map((m, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <MemberCard m={m} isDark={isDark} theme={theme} />
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.35}>
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                        <button
                            onClick={() => navigate("team")}
                            style={{
                                padding: "14px 36px",
                                background: theme.red,
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: 6, cursor: "pointer",
                                fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 15,
                                transition: "opacity 0.2s, transform 0.2s",
                                display: "inline-flex", alignItems: "center", gap: 8,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            {t.team.viewFullTeam}
                        </button>
                    </div>
                </FadeIn>

                <FadeIn delay={0.5}>
                    <p style={{
                        textAlign: "center", marginTop: 24,
                        fontFamily: "'Heebo', sans-serif", fontSize: 15, color: theme.textSecondary,
                    }}>
                        {t.team.more}
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}

// ============================================================
// ACTIVITIES / SERVICES
// ============================================================
function IconSwords(props) {
    return (
        <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" />
            <line x1="19" y1="21" x2="21" y2="19" />
            <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
            <line x1="5" y1="14" x2="9" y2="18" /><line x1="7" y1="17" x2="4" y2="20" />
            <line x1="3" y1="19" x2="5" y2="21" />
        </svg>
    );
}
function IconShieldHeart(props) {
    return (
        <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 17c-1-1-4-3.5-4-5.5a2.5 2.5 0 0 1 4-2 2.5 2.5 0 0 1 4 2c0 2-3 4.5-4 5.5z" />
        </svg>
    );
}
function IconBuilding(props) {
    return (
        <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <line x1="8" y1="6" x2="8" y2="6.01" /><line x1="12" y1="6" x2="12" y2="6.01" />
            <line x1="16" y1="6" x2="16" y2="6.01" /><line x1="8" y1="10" x2="8" y2="10.01" />
            <line x1="12" y1="10" x2="12" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" />
            <line x1="8" y1="14" x2="8" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" />
            <line x1="16" y1="14" x2="16" y2="14.01" />
        </svg>
    );
}
function IconShieldCheck(props) {
    return (
        <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}
function IconUserFocus(props) {
    return (
        <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21c-4 0-6-2-6-4 0-1.5 2.5-3 6-3s6 1.5 6 3c0 2-2 4-6 4z" />
            <path d="M2 6V2h4" /><path d="M18 2h4v4" /><path d="M22 18v4h-4" /><path d="M6 22H2v-4" />
        </svg>
    );
}
function IconAward(props) {
    return (
        <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    );
}

const activityIcons = [IconSwords, IconShieldHeart, IconBuilding, IconShieldCheck, IconUserFocus, IconAward];

function Activities() {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <section id="activities" style={{
            padding: "96px 24px", background: theme.sectionActivitiesBg,
            position: "relative", transition: "background 0.4s ease",
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${theme.red}, transparent)`,
            }} />
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <FadeIn>
                    <SectionTitle sub={t.activities.sub} title={t.activities.title} light={isDark} />
                </FadeIn>
                <div className="grid-mobile-2" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20,
                }}>
                    {t.activities.items.map((item, i) => {
                        const Icon = activityIcons[i];
                        const isHovered = hoveredIdx === i;
                        return (
                            <FadeIn key={i} delay={i * 0.08}>
                                <div
                                    className="activity-card"
                                    onMouseEnter={() => setHoveredIdx(i)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    style={{
                                        padding: "28px 24px", borderRadius: 8,
                                        background: theme.sectionActivitiesCardBg,
                                        border: `1px solid ${isHovered ? theme.red : theme.sectionActivitiesCardBorder}`,
                                        display: "flex", gap: 18, alignItems: "flex-start",
                                        transition: "border-color 0.3s, transform 0.3s",
                                        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                                        height: "100%", boxSizing: "border-box",
                                    }}
                                >
                                    <div className="activity-icon" style={{
                                        flexShrink: 0, width: 48, height: 48, borderRadius: 10,
                                        background: isHovered ? theme.red : theme.sectionActivitiesIconBg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
                                        transform: isHovered ? "scale(1.08)" : "scale(1)",
                                        boxShadow: isHovered ? `0 0 20px ${theme.redGlow}` : "none",
                                    }}>
                                        <Icon size={22} color={isHovered ? "#FFFFFF" : theme.red} />
                                    </div>
                                    <div>
                                        <h3 className="activity-title" style={{
                                            fontFamily: "'Heebo', sans-serif", fontWeight: 700,
                                            fontSize: 17, color: theme.sectionActivitiesTitle, margin: "0 0 8px",
                                        }}>{item.title}</h3>
                                        <p className="activity-desc" style={{
                                            fontFamily: "'Heebo', sans-serif", fontSize: 14,
                                            color: theme.sectionActivitiesDesc, lineHeight: 1.6, margin: 0,
                                        }}>{item.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// TESTIMONIALS
// ============================================================
const SEMINAR_SLIDES = [
    { file: "סמינר אגרוף תאילנדי לצוות ההדרכה 2018.jpeg", caption_he: "סמינר אגרוף תאילנדי לצוות ההדרכה 2018", caption_en: "Muay Thai Seminar for the Instructor Team 2018" },
    { file: "סמינר אגרוף תאילנדי לצוות ההדרכה 2026.jpeg", caption_he: "סמינר אגרוף תאילנדי לצוות ההדרכה 2026", caption_en: "Muay Thai Seminar for the Instructor Team 2026" },
    { file: "סמינר אכיפת חוק גרייטנק 2018.jpeg", caption_he: "סמינר אכיפת חוק גרייטנק 2018", caption_en: "Great Neck Law Enforcement Seminar 2018" },
    { file: "סמינר הגנה עצמית לנשים ברוקלין 2023.jpeg", caption_he: "סמינר הגנה עצמית לנשים ברוקלין 2023", caption_en: "Women's Self-Defense Seminar, Brooklyn 2023" },
    { file: "סמינר קרב מגע orange county.jpeg", caption_he: "סמינר קרב מגע אורנג' קאונטי", caption_en: "Krav Maga Seminar — Orange County" },
    { file: "סמינר קרב מגע מסורתי בפולין בשיתוף עם ארגון Krav Maga united בהדרכת גראנד מאסטר ארז שרעבי ומאסטר רון רותם.jpeg", caption_he: "סמינר קרב מגע מסורתי בפולין — גראנד מאסטר ארז שרעבי ומאסטר רון רותם", caption_en: "Traditional Krav Maga Seminar in Poland — Grand Master Erez Sharaby & Master Ron Rotem" },
    { file: "סמינר קרב מגע מסורתי לארגון GSD בברוקלין בהדרכת גראנד מאסטר ארז שרעבי.jpeg", caption_he: "סמינר קרב מגע מסורתי לארגון GSD בברוקלין — גראנד מאסטר ארז שרעבי", caption_en: "Traditional Krav Maga Seminar for GSD Organization, Brooklyn — Grand Master Erez Sharaby" },
    { file: "קורס מדריכים ישראל 2023.jpeg", caption_he: "קורס מדריכים ישראל 2023", caption_en: "Instructor Certification Course — Israel 2023" },
    { file: "קורס מדריכים ניו יורק 2024.jpeg", caption_he: "קורס מדריכים ניו יורק 2024", caption_en: "Instructor Certification Course — New York 2024" },
    { file: "קרב מגע מסורתי ברוקלין - 2025.jpeg", caption_he: "קרב מגע מסורתי ברוקלין 2025", caption_en: "Traditional Krav Maga — Brooklyn 2025" },
].map(s => ({ ...s, src: `/סמינרים/${encodeURIComponent(s.file)}` }));

function Seminars() {
    const { isDark } = useTheme();
    const { t, lang } = useLang();
    const [active, setActive] = useState(0);
    const total = SEMINAR_SLIDES.length;

    useEffect(() => {
        const timer = setInterval(() => setActive(a => (a + 1) % total), 4000);
        return () => clearInterval(timer);
    }, [total]);

    const goTo = (i) => setActive(i);
    const prev = () => setActive(a => (a - 1 + total) % total);
    const next = () => setActive(a => (a + 1) % total);
    const caption = (s) => lang === "he" ? s.caption_he : s.caption_en;

    return (
        <section style={{
            padding: "96px 24px",
            background: isDark ? "#0A0A0A" : "#F5F5F5",
            transition: "background 0.4s ease",
        }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
                <FadeIn>
                    <SectionTitle sub={t.seminars.sub} title={t.seminars.title} />
                </FadeIn>
                <FadeIn delay={0.15}>
                    {/* Slider stage — 500px fixed height, 280px on mobile */}
                    <div className="seminars-stage" style={{
                        position: "relative", height: 500,
                        borderRadius: 14, overflow: "hidden",
                        background: "#111",
                        boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
                    }}>
                        {SEMINAR_SLIDES.map((s, i) => (
                            <div key={s.file} style={{
                                position: "absolute", inset: 0,
                                opacity: i === active ? 1 : 0,
                                transition: "opacity 1s ease",
                                pointerEvents: i === active ? "auto" : "none",
                            }}>
                                {/* Layer 1: blurred cover — fills the background */}
                                <img
                                    src={s.src}
                                    alt=""
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute", inset: 0,
                                        width: "100%", height: "100%",
                                        objectFit: "cover",
                                        filter: "blur(22px) brightness(0.45)",
                                        transform: "scale(1.12)",
                                        display: "block",
                                    }}
                                />
                                {/* Layer 2: sharp contain — centred on top */}
                                <img
                                    src={s.src}
                                    alt={caption(s)}
                                    style={{
                                        position: "absolute", inset: 0,
                                        width: "100%", height: "100%",
                                        objectFit: "contain",
                                        display: "block",
                                    }}
                                />
                                {/* Layer 3: bottom caption bar */}
                                <div style={{
                                    position: "absolute", bottom: 0, left: 0, right: 0,
                                    background: "rgba(0,0,0,0.62)",
                                    backdropFilter: "blur(4px)",
                                    padding: "12px 24px",
                                    textAlign: "center",
                                }}>
                                    <p style={{
                                        fontFamily: "'Heebo', sans-serif",
                                        fontSize: "clamp(13px, 1.8vw, 16px)",
                                        fontWeight: 700, color: "#FFFFFF",
                                        margin: 0, lineHeight: 1.5,
                                        textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                                    }}>{caption(s)}</p>
                                </div>
                            </div>
                        ))}

                        {/* Prev / Next arrows */}
                        {["prev", "next"].map(dir => (
                            <button key={dir}
                                onClick={dir === "prev" ? prev : next}
                                aria-label={dir}
                                style={{
                                    position: "absolute", top: "50%",
                                    [dir === "prev" ? "left" : "right"]: 14,
                                    transform: "translateY(-50%)",
                                    zIndex: 4, background: "rgba(0,0,0,0.5)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: "50%", width: 44, height: 44,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", color: "#FFFFFF", fontSize: 22,
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(225,29,72,0.85)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
                            >{dir === "prev" ? "‹" : "›"}</button>
                        ))}
                    </div>

                    {/* Dot navigation */}
                    <div style={{
                        display: "flex", gap: 8, justifyContent: "center",
                        marginTop: 18, flexWrap: "wrap",
                    }}>
                        {SEMINAR_SLIDES.map((_, i) => (
                            <button key={i} onClick={() => goTo(i)} style={{
                                width: i === active ? 28 : 8, height: 8, borderRadius: 4,
                                background: i === active ? "#E11D48" : (isDark ? "#444" : "#CCC"),
                                border: "none", cursor: "pointer",
                                transition: "all 0.3s ease", padding: 0,
                            }} />
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

// ============================================================
// CONTACT / CTA
// ============================================================
function Contact() {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    return (
        <section id="contact" style={{
            padding: "96px 24px", background: theme.contactBg,
            position: "relative", transition: "background 0.4s ease",
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${theme.red}, transparent)`,
            }} />
            <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <FadeIn>
                    <SectionTitle sub={t.contact.sub} title={t.contact.title} light={isDark} />
                    <p style={{
                        fontFamily: "'Heebo', sans-serif", fontSize: 17,
                        color: theme.contactMuted, lineHeight: 1.7, marginBottom: 40,
                    }}>
                        {t.contact.desc}
                    </p>
                </FadeIn>
                <FadeIn delay={0.15}>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            padding: "16px 36px", background: "#25D366", color: "#FFFFFF",
                            fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 16,
                            borderRadius: 4, textDecoration: "none", transition: "transform 0.2s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            WhatsApp
                        </a>
                        <a href={`tel:${PHONE}`} style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            padding: "16px 36px", background: "transparent",
                            border: `1px solid ${theme.contactBtnBorder}`, color: theme.contactText,
                            fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: 16,
                            borderRadius: 4, textDecoration: "none", transition: "border-color 0.2s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = theme.red}
                            onMouseLeave={e => e.currentTarget.style.borderColor = theme.contactBtnBorder}
                        >
                            📞 050-669-7722
                        </a>
                        <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            padding: "16px 36px", background: "transparent",
                            border: `1px solid ${theme.contactBtnBorder}`, color: theme.contactText,
                            fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: 16,
                            borderRadius: 4, textDecoration: "none", transition: "border-color 0.2s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = theme.red}
                            onMouseLeave={e => e.currentTarget.style.borderColor = theme.contactBtnBorder}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            Instagram
                        </a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

// ============================================================
// LEGAL MODAL
// ============================================================
function LegalModal({ open, onClose, title, children }) {
    const { theme, isDark } = useTheme();
    const { t } = useLang();
    if (!open) return null;
    return (
        <div
            onClick={onClose}
            role="dialog" aria-modal="true" aria-label={title}
            style={{
                position: "fixed", inset: 0, zIndex: 9999,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: isDark ? "#1F1F1F" : "#FFFFFF",
                    borderRadius: 12, padding: "36px 32px",
                    maxWidth: 640, width: "100%", maxHeight: "80vh", overflowY: "auto",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
                    border: `1px solid ${isDark ? "#2A2A2A" : "#E5E5E5"}`,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Heebo', sans-serif", fontWeight: 800, fontSize: 22, color: theme.text, margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label={t.ui.close}
                        style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: isDark ? "#2A2A2A" : "#F5F5F5",
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, color: theme.textSecondary,
                        }}
                    >✕</button>
                </div>
                <div style={{ fontFamily: "'Heebo', sans-serif", fontSize: 15, color: theme.textSecondary, lineHeight: 1.8 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// ACCESSIBILITY & PRIVACY CONTENT
// ============================================================
function AccessibilityContent() {
    const { theme } = useTheme();
    const { lang } = useLang();
    const h3Style = { fontWeight: 700, fontSize: 17, color: theme.text, margin: "20px 0 8px" };

    if (lang === "en") {
        return (
            <div>
                <p>The TKM — Traditional Krav Maga website is committed to making its content accessible to all, including people with disabilities, in accordance with WCAG 2.1 Level AA guidelines.</p>
                <h3 style={h3Style}>What We've Done</h3>
                <p>The site was designed with accessibility in mind, including: hierarchical heading structure (H1–H3), full keyboard navigation support, ARIA labels on interactive elements, sufficient color contrast, RTL/LTR layout support, responsive design for all screen sizes, and dark/light mode toggle.</p>
                <h3 style={h3Style}>Accessibility Inquiries</h3>
                <p>If you encounter any accessibility issues or have suggestions for improvement, please contact us by phone at 050-6697722 or via WhatsApp.</p>
                <h3 style={h3Style}>Last Updated</h3>
                <p>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
            </div>
        );
    }

    return (
        <div>
            <p>אתר TKM — קרב מגע מסורתי מחויב להנגשת תכניו לכלל הציבור, לרבות אנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998, ולתקנות הנגישות שהותקנו מכוחו, ובהתאם לתקן הישראלי ת"י 5568 המבוסס על הנחיות WCAG 2.1 ברמה AA.</p>
            <h3 style={h3Style}>מה עשינו?</h3>
            <p>האתר עוצב ופותח תוך שאיפה לעמידה בדרישות הנגישות, ובין היתר כולל: מבנה כותרות היררכי ותקין, תמיכה מלאה בניווט באמצעות מקלדת, תוויות aria-label על אלמנטים אינטראקטיביים, ניגודיות צבעים ברמה מספקת, תמיכה ב-RTL/LTR, עיצוב רספונסיבי, ואפשרות מעבר בין תצוגה בהירה לכהה.</p>
            <h3 style={h3Style}>פנייה בנושא נגישות</h3>
            <p>אם נתקלתם בבעיית נגישות באתר, ניתן לפנות אלינו בטלפון 050-6697722 או דרך WhatsApp.</p>
            <h3 style={h3Style}>עדכון אחרון</h3>
            <p>{new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long" })}</p>
        </div>
    );
}

function PrivacyContent() {
    const { theme } = useTheme();
    const { lang } = useLang();
    const h3Style = { fontWeight: 700, fontSize: 17, color: theme.text, margin: "20px 0 8px" };

    if (lang === "en") {
        return (
            <div>
                <p>This Privacy Policy applies to the TKM — Traditional Krav Maga website.</p>
                <h3 style={h3Style}>Data Collection</h3>
                <p>This website does not collect, store, or process any personal information from visitors. We do not use cookies, analytics systems, or personal data forms.</p>
                <h3 style={h3Style}>External Links</h3>
                <p>The site contains links to third-party services including WhatsApp, Instagram, and your device's phone dialer. Clicking these links will redirect you to external platforms governed by their own privacy policies.</p>
                <h3 style={h3Style}>Data Security</h3>
                <p>Since we do not collect personal data, there is nothing to secure on our end. The website is served over a secure HTTPS connection.</p>
                <h3 style={h3Style}>Policy Changes</h3>
                <p>We reserve the right to update this policy at any time. Changes take effect upon publication on the site.</p>
                <p style={{ marginTop: 16, fontSize: 13, color: theme.textMuted }}>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}.</p>
            </div>
        );
    }

    return (
        <div>
            <p>מדיניות פרטיות זו מתייחסת לאתר TKM — קרב מגע מסורתי.</p>
            <h3 style={h3Style}>איסוף מידע</h3>
            <p>האתר אינו אוסף, מאחסן או מעבד מידע אישי כלשהו של המבקרים. האתר אינו משתמש בעוגיות, אינו מפעיל מערכת ניתוח נתונים, ואינו כולל טפסים לאיסוף פרטים אישיים.</p>
            <h3 style={h3Style}>קישורים חיצוניים</h3>
            <p>האתר מכיל קישורים חיצוניים לשירותי צד שלישי, ובכלל זה WhatsApp, Instagram וחייגן הטלפון. לחיצה על קישורים אלו תפנה אתכם לפלטפורמות חיצוניות הכפופות למדיניות הפרטיות שלהן.</p>
            <h3 style={h3Style}>אבטחת מידע</h3>
            <p>מאחר שאיננו אוספים מידע אישי, אין מידע הדורש אבטחה מצדנו. האתר מוגש באמצעות חיבור מאובטח (HTTPS).</p>
            <h3 style={h3Style}>שינויים במדיניות</h3>
            <p>אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת.</p>
            <p style={{ marginTop: 16, fontSize: 13, color: theme.textMuted }}>עדכון אחרון: {new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long" })}.</p>
        </div>
    );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
    const { theme } = useTheme();
    const { t } = useLang();
    const [accessibilityOpen, setAccessibilityOpen] = useState(false);
    const [privacyOpen, setPrivacyOpen] = useState(false);

    const linkStyle = {
        fontFamily: "'Heebo', sans-serif", fontSize: 13, color: theme.textMuted,
        textDecoration: "none", transition: "color 0.2s", cursor: "pointer",
        background: "none", border: "none", padding: 0,
    };

    return (
        <>
            <footer style={{
                padding: "40px 24px 32px", background: theme.footerBg,
                borderTop: `1px solid ${theme.footerBorder}`, transition: "background 0.4s ease",
            }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexWrap: "wrap", gap: 16, marginBottom: 20,
                    }}>
                        <span style={{
                            display: "flex", alignItems: "center", gap: 10,
                            fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 16, color: theme.textMuted,
                        }}>
                            <img
                                src="/לוגו סופי.png"
                                alt="Krav Maga Logo"
                                onError={e => e.target.style.display = "none"}
                                style={{ height: 36, width: "auto", opacity: 0.75 }}
                            />
                            © {new Date().getFullYear()} TKM — {t.footer.subtitle}
                        </span>
                        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                                style={{ color: theme.textMuted, transition: "color 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.color = theme.text}
                                onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                                style={{ color: theme.textMuted, transition: "color 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#25D366"}
                                onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </a>
                        </div>
                    </div>
                    <div style={{ height: 1, background: theme.footerBorder, marginBottom: 16 }} />
                    <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                        <button
                            onClick={() => setAccessibilityOpen(true)}
                            style={linkStyle}
                            onMouseEnter={e => e.currentTarget.style.color = theme.text}
                            onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
                        >
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="4" r="1.5" /><path d="M12 8v4" /><path d="M8 10h8" />
                                    <path d="M10 16l2-4 2 4" /><path d="M9 22l3-6 3 6" />
                                </svg>
                                {t.footer.accessibility}
                            </span>
                        </button>
                        <span style={{ color: theme.footerBorder }}>|</span>
                        <button
                            onClick={() => setPrivacyOpen(true)}
                            style={linkStyle}
                            onMouseEnter={e => e.currentTarget.style.color = theme.text}
                            onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
                        >
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                {t.footer.privacy}
                            </span>
                        </button>
                    </div>
                </div>
            </footer>

            <LegalModal open={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} title={t.accessibilityTitle}>
                <AccessibilityContent />
            </LegalModal>
            <LegalModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title={t.privacyTitle}>
                <PrivacyContent />
            </LegalModal>
        </>
    );
}

// ============================================================
// MAIN APP
// ============================================================
export default function TKMWebsite() {
    const [isDark, setIsDark] = useState(true);
    const [page, setPage] = useState("home");
    const [lang, setLang] = useState(() => {
        try {
            const bl = navigator.language || "";
            return bl.startsWith("en") ? "en" : "he";
        } catch {
            return "he";
        }
    });

    const theme = isDark ? themes.dark : themes.light;
    const t = translations[lang];

    C = {
        ...theme,
        black: "#0A0A0A", blackLight: isDark ? "#141414" : "#F5F5F5",
        white: "#FFFFFF", gray100: "#F5F5F5", gray200: "#E5E5E5",
        gray400: "#9CA3AF", gray600: "#6B7280", gray800: isDark ? "#1F1F1F" : "#E5E5E5",
    };

    const toggle = () => setIsDark(d => !d);
    const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggle }}>
            <LangContext.Provider value={{ lang, t, setLang }}>
                <NavigationContext.Provider value={{ page, navigate }}>
                    <div dir={t.dir} style={{
                        fontFamily: "'Heebo', sans-serif", margin: 0, padding: 0,
                        background: theme.bg, minHeight: "100vh", width: "100%",
                        transition: "background 0.4s ease",
                    }}>
                        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                        <style>{`
              * { box-sizing: border-box; margin: 0; padding: 0; }
              html { scroll-behavior: smooth; }
              body { overflow-x: hidden; width: 100%; }
              ::selection { background: ${theme.red}; color: #FFFFFF; }
            `}</style>
                        {page === "home" ? (
                            <>
                                <Navbar />
                                <Hero />
                                <WhySection />
                                <About />
                                <Branches />
                                <Instructors />
                                <Activities />
                                <Seminars />
                                <Contact />
                                <Footer />
                                <WhatsAppFab />
                            </>
                        ) : (
                            <FullTeamPage />
                        )}
                    </div>
                </NavigationContext.Provider>
            </LangContext.Provider>
        </ThemeContext.Provider>
    );
}