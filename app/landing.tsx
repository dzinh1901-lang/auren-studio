import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  Brain,
  Users,
  TrendingUp,
  Sun,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  Tablet,
  Monitor,
  BookOpen,
  BarChart3,
  MessageSquare,
  LogIn,
  LayoutDashboard,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/use-auth';

// --- Theme Configuration ---
const theme = {
  bg: '#F7F2EB',
  surface: '#EFE6DA',
  card: '#FAF7F2',
  textPrimary: '#4B4038',
  textSecondary: '#6F6257',
  textMuted: '#8B8178',
  accent: '#D8C4A8',
  accentDark: '#B8A48A',
  border: 'rgba(111,98,87,0.14)',
  gold: '#C9A96E',
  error: '#d97706',
};

// --- Font Injection ---
const injectFonts = () => {
  if (typeof document !== 'undefined') {
    const existing = document.getElementById('aurem-fonts');
    if (existing) return;
    const style = document.createElement('style');
    style.id = 'aurem-fonts';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Outfit:wght@300;400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html { scroll-behavior: smooth; }

      body {
        background-color: ${theme.bg};
        color: ${theme.textPrimary};
        font-family: 'Outfit', sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      .font-serif { font-family: 'Newsreader', Georgia, serif; }
      .font-sans  { font-family: 'Outfit', sans-serif; }

      ::selection { background: rgba(201,169,110,0.25); }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${theme.bg}; }
      ::-webkit-scrollbar-thumb { background: ${theme.accent}; border-radius: 3px; }
    `;
    document.head.appendChild(style);
  }
};

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7 } },
};

// --- Shared Section Wrapper ---
const Section = ({
  children,
  className = '',
  id = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) => (
  <section
    id={id}
    style={{
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
    className={className}
  >
    {children}
  </section>
);

const Container = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      maxWidth: 1180,
      margin: '0 auto',
      padding: '0 28px',
      width: '100%',
      ...style,
    }}
  >
    {children}
  </div>
);

// --- Decorative Divider ---
const HairlineDivider = ({ style = {} }: { style?: React.CSSProperties }) => (
  <div
    style={{
      width: '100%',
      height: 1,
      background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
      ...style,
    }}
  />
);

// --- Navigation ---
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['Philosophy', 'Ecosystem', 'Pillars'];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(247,242,235,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${theme.border}` : '1px solid transparent',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.gold}, ${theme.accentDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <span
              className="font-serif"
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: theme.textPrimary,
                letterSpacing: '0.12em',
              }}
            >
              AUREM
            </span>
          </a>

          {/* Desktop Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 40,
            }}
            className="nav-desktop"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{
                  textDecoration: 'none',
                  color: theme.textSecondary,
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = theme.textPrimary)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = theme.textSecondary)}
              >
                {link}
              </a>
            ))}
            
            {/* Conditional: Show Dashboard if authenticated, otherwise Join Waitlist */}
            {!authLoading && user ? (
              <a
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 24px',
                  borderRadius: 6,
                  background: theme.textPrimary,
                  color: theme.bg,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = '1';
                }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </a>
            ) : (
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 24px',
                  borderRadius: 6,
                  background: 'transparent',
                  color: theme.textPrimary,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: `1.5px solid ${theme.textPrimary}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = theme.textPrimary;
                  (e.target as HTMLElement).style.color = theme.bg;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'transparent';
                  (e.target as HTMLElement).style.color = theme.textPrimary;
                }}
              >
                Join Waitlist
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'none',
              color: theme.textPrimary,
            }}
            className="nav-mobile-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: theme.card,
              borderTop: `1px solid ${theme.border}`,
              overflow: 'hidden',
            }}
          >
            <Container>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '16px 0' }}>
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '14px 0',
                      color: theme.textSecondary,
                      textDecoration: 'none',
                      fontSize: 16,
                      fontWeight: 500,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    {link}
                  </a>
                ))}
                {/* Conditional mobile CTA */}
                {!authLoading && user ? (
                  <a
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      marginTop: 16,
                      padding: '12px 24px',
                      borderRadius: 100,
                      background: theme.textPrimary,
                      color: theme.bg,
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    <LayoutDashboard size={16} />
                    Go to Dashboard
                  </a>
                ) : (
                  <a
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'inline-block',
                      marginTop: 16,
                      padding: '12px 24px',
                      borderRadius: 100,
                      background: theme.textPrimary,
                      color: theme.bg,
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Join the Waitlist
                  </a>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles injected once */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .pillar-grid { grid-template-columns: 1fr !important; }
          .hero-badge { display: none !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.nav>
  );
};

// --- Hero Section ---
const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const { user, loading: authLoading } = useAuth();

  return (
    <Section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        paddingBottom: 80,
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,169,110,0.18) 0%, transparent 70%), ${theme.bg}`,
      }}
    >
      {/* Soft orb decoration */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '8%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(201,169,110,0.14) 0%, transparent 70%)`,
          y: bgY,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(184,164,138,0.12) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
            gap: 28,
          }}
        >
          {/* Agentic Transformation Label */}
          <motion.div
            variants={fadeUp}
            className="hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 1,
                background: theme.textMuted,
              }}
            />
            <span
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Agentic Transformation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-serif"
            style={{
              fontSize: 'clamp(42px, 6vw, 72px)',
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              color: theme.textPrimary,
              maxWidth: 700,
            }}
          >
            Transform Every Dimension of Your Life with AI
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              lineHeight: 1.7,
              color: theme.textSecondary,
              maxWidth: 600,
              fontWeight: 400,
            }}
          >
            AUREM is your intelligent companion for growth, wellness, purpose, relationships, and 
            performance—designed to learn your patterns and guide aligned action every day.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}
          >
            {/* Primary CTA: Dashboard for authenticated, Waitlist for others */}
            {!authLoading && user ? (
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 32px',
                  borderRadius: 6,
                  background: '#B8977A',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <LayoutDashboard size={16} />
                Go to Dashboard
              </motion.a>
            ) : (
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 32px',
                  borderRadius: 6,
                  background: '#B8977A',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Join the Waitlist
              </motion.a>
            )}
            <motion.a
              href="#ecosystem"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 32px',
                borderRadius: 6,
                background: 'transparent',
                color: theme.textPrimary,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: `1.5px solid ${theme.textPrimary}`,
              }}
            >
              Explore the Ecosystem
            </motion.a>
          </motion.div>

          {/* Floating stat strip */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex',
              gap: 0,
              marginTop: 20,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(75,64,56,0.06)',
            }}
          >
            {[
              { value: '6', label: 'Wellness Pillars' },
              { value: '94%', label: 'Client Satisfaction' },
              { value: '10k+', label: 'Lives Transformed' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '18px 36px',
                  textAlign: 'center',
                  borderRight: i < 2 ? `1px solid ${theme.border}` : 'none',
                }}
              >
                <div
                  className="font-serif"
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: theme.textPrimary,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500, marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(to bottom, transparent, ${theme.bg})`,
          pointerEvents: 'none',
        }}
      />
    </Section>
  );
};

// --- About / Philosophy Section ---
const AboutUs = () => {
  return (
    <Section
      id="about"
      style={{
        background: theme.surface,
        padding: '100px 0',
      }}
    >
      <Container>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left: Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <motion.div variants={fadeUp}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  color: theme.gold,
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                About Us
              </p>
              <HairlineDivider style={{ width: 48, marginBottom: 24 }} />
              <h2
                className="font-serif"
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: theme.textPrimary,
                }}
              >
                Real transformation is never{' '}
                <em style={{ fontStyle: 'italic', color: theme.gold }}>
                  one-dimensional
                </em>
              </h2>
            </motion.div>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: theme.textSecondary,
                fontWeight: 400,
              }}
            >
              We believe real transformation is never one-dimensional. AUREM is designed to support the{' '}
              <strong style={{ color: theme.textPrimary, fontWeight: 600 }}>
                whole person
              </strong>
              —mind, body, spirit, emotions, relationships, and ambition—through personalized intelligence 
              and beautifully structured action. Our philosophy combines holistic transformation through AI, 
              self-awareness, structure, and reflection.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Brain, label: 'AI that learns your habits, strengths, and motivations over time' },
                { icon: Heart, label: 'Holistic support across mind, body, spirit, and relationships' },
                { icon: Sun, label: 'Adaptive guidance that meets you exactly where you are' },
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `rgba(201,169,110,0.15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Icon size={16} color={theme.gold} />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      color: theme.textSecondary,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.a
              variants={fadeUp}
              href="#pillars"
              whileHover={{ x: 4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: theme.gold,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Discover the six pillars <ChevronRight size={18} />
            </motion.a>
          </div>

          {/* Right: Image */}
          <motion.div
            variants={fadeIn}
            style={{ position: 'relative' }}
          >
            {/* Decorative frame */}
            <div
              style={{
                position: 'absolute',
                inset: -16,
                borderRadius: 32,
                border: `1px solid ${theme.border}`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                aspectRatio: '4/5',
                background: theme.card,
                boxShadow: '0 32px 80px rgba(75,64,56,0.14)',
                position: 'relative',
              }}
            >
              {/* Meditation image placeholder with gradient overlay */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `
                    linear-gradient(
                      160deg,
                      rgba(201,169,110,0.25) 0%,
                      rgba(184,164,138,0.15) 40%,
                      rgba(120,140,100,0.2) 100%
                    )
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Lotus / Meditation icon */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `rgba(201,169,110,0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid rgba(201,169,110,0.3)`,
                  }}
                >
                  <Sun size={44} color={theme.gold} strokeWidth={1.2} />
                </div>
                <p
                  className="font-serif"
                  style={{
                    fontSize: 18,
                    fontStyle: 'italic',
                    color: theme.textSecondary,
                    textAlign: 'center',
                    padding: '0 32px',
                    lineHeight: 1.6,
                  }}
                >
                  &ldquo;Stillness is where clarity and true wisdom are found.&rdquo;
                </p>
              </div>
            </div>

            {/* Floating accent chip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                position: 'absolute',
                bottom: 32,
                right: -24,
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: '14px 18px',
                boxShadow: '0 8px 32px rgba(75,64,56,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `rgba(201,169,110,0.15)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color={theme.gold} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>
                  AI Companion
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Always with you</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 900px) {
          #about .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  );
};

// --- Product Ecosystem Showcase ---
const Showcase = () => {
  const ecosystemItems = [
    {
      icon: Smartphone,
      title: 'Mobile App',
      desc: 'Your AI companion in your pocket—daily check-ins, guided reflections, and habit tracking.',
      color: '#9B8FD4',
    },
    {
      icon: Tablet,
      title: 'Tablet Dashboard',
      desc: 'Immersive wellness sessions and detailed analytics on a larger canvas.',
      color: '#C9A96E',
    },
    {
      icon: Monitor,
      title: 'Desktop Web App',
      desc: 'Full-featured workspace for deep planning, journaling, and performance analysis.',
      color: '#6BA896',
    },
    {
      icon: MessageSquare,
      title: 'AI Coaching Cards',
      desc: 'Personalized guidance delivered at the right moment to support your growth.',
      color: '#E07B7B',
    },
    {
      icon: Activity,
      title: 'Habit & Wellness Tracking',
      desc: 'Seamless tracking of routines, energy, mood, and physical vitality metrics.',
      color: '#7EA8C4',
    },
    {
      icon: BookOpen,
      title: 'Reflection & Journaling',
      desc: 'Intelligent prompts and guided journaling to surface patterns and insights.',
      color: '#A89B6E',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      desc: 'Visualize your growth across all six pillars with beautiful, insightful dashboards.',
      color: '#8B7FC4',
    },
  ];

  return (
    <Section
      id="ecosystem"
      style={{ background: theme.bg, padding: '100px 0' }}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                color: theme.gold,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              The AUREM Ecosystem
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: theme.textPrimary,
                maxWidth: 640,
                margin: '0 auto 20px',
              }}
            >
              A complete{' '}
              <em style={{ fontStyle: 'italic', color: theme.gold }}>ecosystem</em>{' '}
              for transformation
            </h2>
            <p
              style={{
                fontSize: 17,
                color: theme.textSecondary,
                maxWidth: 560,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              AUREM meets you wherever you are—mobile, tablet, or desktop—with intelligent 
              tools designed to support every dimension of your growth.
            </p>
          </motion.div>

          {/* Ecosystem visual grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {ecosystemItems.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(75,64,56,0.1)' }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  background: theme.card,
                  borderRadius: 20,
                  padding: '28px 24px',
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative gradient orb */}
                <div
                  style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={22} color={color} strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: theme.textPrimary,
                      marginBottom: 8,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: theme.textSecondary,
                      lineHeight: 1.65,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lifestyle mood section */}
          <motion.div
            variants={fadeUp}
            style={{
              marginTop: 64,
              background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.card} 100%)`,
              borderRadius: 28,
              padding: 'clamp(40px, 6vw, 72px)',
              border: `1px solid ${theme.border}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: 'absolute',
                top: -60,
                left: -60,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(184,164,138,0.1) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.gold}, ${theme.accentDark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 28,
                boxShadow: '0 12px 40px rgba(201,169,110,0.25)',
              }}
            >
              <Sparkles size={32} color="#fff" />
            </div>

            <p
              className="font-serif"
              style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                fontStyle: 'italic',
                color: theme.textSecondary,
                maxWidth: 600,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              &ldquo;Designed for stillness, clarity, and intentional living—
              where technology becomes invisible and transformation becomes effortless.&rdquo;
            </p>

            <p
              style={{
                fontSize: 13,
                color: theme.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              The AUREM Philosophy
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- Six Pillars / What We Do Section ---
const Pillars = () => {
  const pillarsData = [
    {
      title: 'Personal Mastery',
      icon: Brain,
      desc: 'Clarify your identity, goals, habits, and standards for absolute self-leadership and intentional living.',
      color: '#9B8FD4',
    },
    {
      title: 'Spiritual Alignment',
      icon: Sun,
      desc: 'Cultivate mindfulness, reflection, stillness, purpose, and values-based living for deeper meaning.',
      color: '#C9A96E',
    },
    {
      title: 'Emotional Resilience',
      icon: Heart,
      desc: 'Develop emotional awareness, self-regulation, inner stability, and healthier responses to life.',
      color: '#E07B7B',
    },
    {
      title: 'Physical Vitality',
      icon: Activity,
      desc: 'Optimize energy, movement, recovery, sleep, nutrition, and overall physical wellness.',
      color: '#6BA896',
    },
    {
      title: 'Relationship Intelligence',
      icon: Users,
      desc: 'Strengthen communication, empathy, trust, and relational dynamics in every area of life.',
      color: '#7EA8C4',
    },
    {
      title: 'Business Performance',
      icon: TrendingUp,
      desc: 'Execute on goals, build discipline, manage priorities, and accelerate measurable professional growth.',
      color: '#A89B6E',
    },
  ];

  return (
    <Section
      id="pillars"
      style={{
        background: theme.surface,
        padding: '100px 0',
      }}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                color: theme.gold,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              What We Do
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: theme.textPrimary,
                maxWidth: 640,
                margin: '0 auto 20px',
              }}
            >
              Six dimensions of{' '}
              <em style={{ fontStyle: 'italic', color: theme.gold }}>transformation</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: theme.textSecondary,
                maxWidth: 560,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              AUREM provides adaptive AI support across every dimension of human flourishing, 
              ensuring no part of you goes unsupported on the path to becoming your best self.
            </p>
          </motion.div>

          {/* Pillar cards */}
          <div
            className="pillar-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {pillarsData.map(({ title, icon: Icon, desc, color }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(75,64,56,0.1)' }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  background: theme.card,
                  borderRadius: 20,
                  padding: '32px 28px',
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${color}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${color}33`,
                  }}
                >
                  <Icon size={22} color={color} strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: theme.textPrimary,
                      marginBottom: 8,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: theme.textSecondary,
                      lineHeight: 1.7,
                    }}
                  >
                    {desc}
                  </p>
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: color,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Learn more <ChevronRight size={14} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- Client Success / Founding Member Stories ---
const ClientSuccess = () => {
  const storyCards = [
    {
      title: 'The Overwhelmed Executive',
      vision: 'Transform reactive chaos into intentional leadership through AI-guided daily alignment and energy management.',
      pillar: 'Business Performance',
      color: '#A89B6E',
    },
    {
      title: 'The Seeking Parent',
      vision: 'Balance personal growth with family presence using adaptive routines that honor both ambition and connection.',
      pillar: 'Relationship Intelligence',
      color: '#7EA8C4',
    },
    {
      title: 'The Wellness Seeker',
      vision: 'Move beyond fragmented health apps to holistic vitality—mind, body, and spirit working in harmony.',
      pillar: 'Physical Vitality',
      color: '#6BA896',
    },
  ];

  return (
    <Section
      id="stories"
      style={{ background: theme.bg, padding: '100px 0' }}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                color: theme.gold,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              Designed for Transformation
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: theme.textPrimary,
                maxWidth: 600,
                margin: '0 auto 20px',
              }}
            >
              Stories we&apos;re{' '}
              <em style={{ fontStyle: 'italic', color: theme.gold }}>building</em>{' '}
              for
            </h2>
            <p
              style={{
                fontSize: 16,
                color: theme.textSecondary,
                maxWidth: 480,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              AUREM is designed for real people navigating complex lives. These founding member 
              archetypes represent the transformation journeys we&apos;re building to support.
            </p>
          </motion.div>

          {/* Story cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {storyCards.map((story, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                style={{
                  background: theme.card,
                  borderRadius: 20,
                  padding: '32px 28px',
                  border: `1px solid ${theme.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative gradient orb */}
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${story.color}15 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Pillar badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 100,
                    background: `${story.color}15`,
                    border: `1px solid ${story.color}30`,
                    color: story.color,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    width: 'fit-content',
                  }}
                >
                  {story.pillar}
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: theme.textPrimary,
                    fontStyle: 'italic',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {story.title}
                </h3>

                <p
                  style={{
                    fontSize: 15,
                    color: theme.textSecondary,
                    lineHeight: 1.75,
                  }}
                >
                  {story.vision}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <HairlineDivider style={{ marginBottom: 16 }} />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      color: theme.textMuted,
                      fontStyle: 'italic',
                    }}
                  >
                    <Sparkles size={12} color={theme.gold} />
                    Founding member pilot story
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Founding member CTA */}
          <motion.div
            variants={fadeUp}
            style={{
              marginTop: 48,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 15,
                color: theme.textSecondary,
                marginBottom: 20,
              }}
            >
              Want to be part of our founding member cohort?
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 100,
                background: 'transparent',
                color: theme.textPrimary,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                border: `1.5px solid ${theme.accent}`,
              }}
            >
              Apply for Early Access <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- CTA Section with Email Form ---
const CTA = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const waitlistMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      setSubmitted(true);
      setEmail('');
      setErrorMessage(null);
      // Reset after 5 seconds so user can submit another email
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    waitlistMutation.mutate({ email, source: 'landing-page' });
  };

  return (
    <Section
      id="contact"
      style={{
        background: theme.surface,
        padding: '100px 0 80px',
      }}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <motion.h2
            variants={fadeUp}
            className="font-serif"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: theme.textPrimary,
              marginBottom: 16,
            }}
          >
            Begin your AUREM journey
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: theme.textSecondary,
              maxWidth: 520,
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Join the waitlist for early access to a new kind of AI-guided transformation experience.
          </motion.p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '16px 24px',
                background: 'rgba(184,151,122,0.15)',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                color: theme.textPrimary,
              }}
            >
              <Sparkles size={18} color="#B8977A" />
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                {successMessage}
              </span>
            </motion.div>
          ) : (
            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                maxWidth: 480,
                margin: '0 auto',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={waitlistMutation.isPending}
                style={{
                  flex: '1 1 260px',
                  minWidth: 200,
                  padding: '16px 20px',
                  borderRadius: 6,
                  border: `1px solid ${errorMessage ? theme.error : theme.border}`,
                  background: '#fff',
                  color: theme.textPrimary,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  opacity: waitlistMutation.isPending ? 0.7 : 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = '#B8977A')}
                onBlur={(e) => (e.target.style.borderColor = errorMessage ? theme.error : theme.border)}
              />
              <motion.button
                type="submit"
                disabled={waitlistMutation.isPending}
                whileHover={{ scale: waitlistMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: waitlistMutation.isPending ? 1 : 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 28px',
                  borderRadius: 6,
                  background: '#B8977A',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  border: 'none',
                  cursor: waitlistMutation.isPending ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.01em',
                  opacity: waitlistMutation.isPending ? 0.7 : 1,
                }}
              >
                {waitlistMutation.isPending ? 'Joining...' : 'Join the waitlist'}
              </motion.button>
            </motion.form>
          )}
          
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 12,
                fontSize: 14,
                color: theme.error,
              }}
            >
              {errorMessage}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </Section>
  );
};

// --- Footer ---
// Custom SVG social icons since lucide-react doesn't include brand icons
const LinkedInIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Footer = () => {
  const navigationLinks = ['About', 'What we do', 'Contact', 'Privacy', 'Terms'];
  const socialIcons = [
    { Icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
    { Icon: InstagramIcon, href: '#', label: 'Instagram' },
    { Icon: TwitterIcon, href: '#', label: 'Twitter' },
  ];

  return (
    <footer
      style={{
        background: theme.surface,
        padding: '60px 0 0',
      }}
    >
      <Container>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 48,
            paddingBottom: 48,
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span
              className="font-serif"
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: theme.textPrimary,
                letterSpacing: '0.1em',
              }}
            >
              AUREM
            </span>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: theme.textSecondary,
                maxWidth: 280,
              }}
            >
              AI-powered personal transformation for the whole person.
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.textPrimary,
                marginBottom: 4,
              }}
            >
              Navigation
            </h4>
            {navigationLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  color: theme.textSecondary,
                  textDecoration: 'none',
                  fontSize: 14,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = theme.textPrimary)}
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = theme.textSecondary)
                }
              >
                {item}
              </a>
            ))}
          </div>

          {/* Connect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.textPrimary,
                marginBottom: 4,
              }}
            >
              Connect
            </h4>
            <a
              href="mailto:hello@aurem.ai"
              style={{
                color: theme.textSecondary,
                textDecoration: 'none',
                fontSize: 14,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = theme.textPrimary)}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = theme.textSecondary)
              }
            >
              hello@aurem.ai
            </a>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              {socialIcons.map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  style={{
                    color: theme.textSecondary,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = theme.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = theme.textSecondary;
                  }}
                >
                  <Icon size={20} color="currentColor" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <HairlineDivider
          style={{ background: theme.border }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 24,
            paddingBottom: 24,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: theme.textSecondary }}>
            © {new Date().getFullYear()} AUREM. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <a
              href="#privacy"
              style={{
                color: theme.textSecondary,
                textDecoration: 'none',
                fontSize: 13,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = theme.textPrimary)}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = theme.textSecondary)
              }
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              style={{
                color: theme.textSecondary,
                textDecoration: 'none',
                fontSize: 13,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = theme.textPrimary)}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = theme.textSecondary)
              }
            >
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

// --- Main App ---
export default function LandingPage() {
  useEffect(() => {
    injectFonts();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg }}>
      <Navigation />
      <Hero />
      <HairlineDivider />
      <AboutUs />
      <HairlineDivider />
      <Showcase />
      <HairlineDivider />
      <Pillars />
      <HairlineDivider />
      <ClientSuccess />
      <CTA />
      <Footer />
    </div>
  );
}
