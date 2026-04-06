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
  Star,
  Quote,
} from 'lucide-react';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['About', 'Pillars', 'Stories', 'Contact'];

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
                letterSpacing: '-0.02em',
                fontStyle: 'italic',
              }}
            >
              Aurem
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
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 22px',
                borderRadius: 100,
                background: theme.textPrimary,
                color: theme.bg,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'transform 0.2s, opacity 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '1')}
            >
              Begin Journey <ArrowRight size={14} />
            </a>
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
                  Begin Journey
                </a>
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
        }
        @media (max-width: 640px) {
          .pillar-grid { grid-template-columns: 1fr !important; }
          .hero-badge { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
};

// --- Hero Section ---
const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);

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
            alignItems: 'center',
            textAlign: 'center',
            gap: 32,
          }}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="hero-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 100,
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={13} color={theme.gold} />
            AI-Powered Holistic Wellness
            <Sparkles size={13} color={theme.gold} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-serif"
            style={{
              fontSize: 'clamp(48px, 7vw, 88px)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: theme.textPrimary,
              maxWidth: 820,
            }}
          >
            Your journey to{' '}
            <em style={{ fontStyle: 'italic', color: theme.gold }}>whole</em>
            {' '}wellness begins here
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.75,
              color: theme.textSecondary,
              maxWidth: 560,
              fontWeight: 400,
            }}
          >
            Aurem blends ancient wisdom with cutting-edge AI to guide you across six pillars of
            human flourishing — mind, body, spirit, and beyond.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 36px',
                borderRadius: 100,
                background: theme.textPrimary,
                color: theme.bg,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                boxShadow: '0 8px 24px rgba(75,64,56,0.18)',
              }}
            >
              Begin Your Journey <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '16px 36px',
                borderRadius: 100,
                background: 'transparent',
                color: theme.textPrimary,
                fontSize: 16,
                fontWeight: 500,
                textDecoration: 'none',
                border: `1.5px solid ${theme.accent}`,
              }}
            >
              Our Philosophy <ChevronRight size={18} />
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
                Our Philosophy
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
                Nurturing Growth Through{' '}
                <em style={{ fontStyle: 'italic', color: theme.gold }}>
                  AI-Powered
                </em>{' '}
                Wellness Journeys
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
              We blend ancient wisdom with{' '}
              <strong style={{ color: theme.textPrimary, fontWeight: 600 }}>
                cutting-edge technology
              </strong>{' '}
              to support your journey to holistic well-being. Our approach fosters a serene
              environment where mind, body, and spirit unite, allowing for personal transformation
              that respects your unique path. Experience nurturing guidance designed to elevate
              your wellness journey.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Brain, label: 'Personalized AI guidance tailored to your unique path' },
                { icon: Heart, label: 'Holistic approach across all dimensions of well-being' },
                { icon: Sun, label: 'Rooted in ancient wisdom, powered by modern science' },
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

// --- Feature Showcase ---
const Showcase = () => {
  const features = [
    {
      number: '01',
      title: 'Intelligent Daily Check-Ins',
      desc: 'Your AI companion meets you where you are each day — reading your energy, mood, and context to offer guidance that actually fits your life in that moment.',
    },
    {
      number: '02',
      title: 'Adaptive Wellness Plans',
      desc: 'Unlike rigid programs, Aurem evolves with you. Your plan reshapes itself as your life, goals, and growth shift — ensuring perpetual forward momentum.',
    },
    {
      number: '03',
      title: 'Deep Reflection & Journaling',
      desc: 'Guided prompts and intelligent journaling tools help you surface patterns, celebrate growth, and process challenges with greater clarity and compassion.',
    },
  ];

  return (
    <Section
      id="showcase"
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
              How It Works
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
                margin: '0 auto',
              }}
            >
              Wellness that{' '}
              <em style={{ fontStyle: 'italic', color: theme.gold }}>learns</em>{' '}
              and grows with you
            </h2>
          </motion.div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {features.map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: 40,
                  padding: '40px 48px',
                  background: i % 2 === 0 ? theme.card : theme.surface,
                  borderRadius: 20,
                  border: `1px solid ${theme.border}`,
                  cursor: 'default',
                  alignItems: 'center',
                }}
              >
                <span
                  className="font-serif"
                  style={{
                    fontSize: 48,
                    fontWeight: 300,
                    color: theme.accent,
                    lineHeight: 1,
                    fontStyle: 'italic',
                  }}
                >
                  {feat.number}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: theme.textPrimary,
                      marginBottom: 10,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: theme.textSecondary,
                      lineHeight: 1.75,
                      maxWidth: 580,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- Six Pillars Section ---
const Pillars = () => {
  const pillarsData = [
    {
      title: 'Personal Mastery',
      icon: Brain,
      desc: 'Clarify identity, goals, habits, and standards for absolute self-leadership.',
      color: '#9B8FD4',
    },
    {
      title: 'Spiritual Alignment',
      icon: Sun,
      desc: 'Support mindfulness, reflection, stillness, purpose, and values-based living.',
      color: '#C9A96E',
    },
    {
      title: 'Emotional Resilience',
      icon: Heart,
      desc: 'Develop emotional awareness, self-regulation, inner stability, and healthier responses.',
      color: '#E07B7B',
    },
    {
      title: 'Physical Vitality',
      icon: Activity,
      desc: 'Improve energy, movement, recovery, sleep, nutrition, and overall wellness.',
      color: '#6BA896',
    },
    {
      title: 'Relationship Intelligence',
      icon: Users,
      desc: 'Strengthen communication, empathy, trust, and relational dynamics in every area.',
      color: '#7EA8C4',
    },
    {
      title: 'Business Performance',
      icon: TrendingUp,
      desc: 'Execute on goals, build discipline, manage priorities, and accelerate measurable growth.',
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
              The Six Pillars
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
              Every dimension of your{' '}
              <em style={{ fontStyle: 'italic', color: theme.gold }}>flourishing</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: theme.textSecondary,
                maxWidth: 520,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Aurem addresses the full spectrum of human well-being, ensuring no part of you goes
              unsupported on the path to your best self.
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
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: color,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Explore <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- Client Success / Testimonials ---
const ClientSuccess = () => {
  const testimonials = [
    {
      quote:
        "Aurem didn't just give me tools — it gave me a mirror. For the first time I could see myself clearly and act from a place of intention rather than reaction.",
      name: 'Mara S.',
      role: 'Entrepreneur & Mother',
      rating: 5,
    },
    {
      quote:
        "I've tried countless wellness apps. Aurem is the first one that felt like it truly understood me. The AI guidance is uncanny — deeply human.",
      name: 'James R.',
      role: 'Executive Coach',
      rating: 5,
    },
    {
      quote:
        "The six pillars framework changed how I see my life. I used to optimize one area and neglect others. Now everything moves together.",
      name: 'Priya K.',
      role: 'Physician & Wellness Advocate',
      rating: 5,
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
              Client Stories
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: theme.textPrimary,
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              Lives{' '}
              <em style={{ fontStyle: 'italic', color: theme.gold }}>transformed</em>{' '}
              by Aurem
            </h2>
          </motion.div>

          {/* Testimonial cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {testimonials.map((t, i) => (
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
                {/* Decorative quote mark */}
                <Quote
                  size={40}
                  color={theme.accent}
                  style={{ position: 'absolute', top: 20, right: 20, opacity: 0.4 }}
                />

                {/* Stars */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      color={theme.gold}
                      fill={theme.gold}
                    />
                  ))}
                </div>

                <p
                  style={{
                    fontSize: 15,
                    color: theme.textSecondary,
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    fontFamily: 'Newsreader, serif',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <HairlineDivider style={{ marginBottom: 16 }} />
                  <div style={{ fontWeight: 600, color: theme.textPrimary, fontSize: 14 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>
                    {t.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- CTA Section ---
const CTA = () => {
  return (
    <Section
      id="contact"
      style={{
        background: theme.surface,
        padding: '100px 0',
      }}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{
            background: theme.textPrimary,
            borderRadius: 32,
            padding: 'clamp(48px, 8vw, 88px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative orbs */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <motion.div variants={fadeUp}>
            <Sparkles size={32} color={theme.gold} style={{ marginBottom: 24 }} />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif"
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 300,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: theme.bg,
              marginBottom: 20,
            }}
          >
            Ready to become your{' '}
            <em style={{ fontStyle: 'italic', color: theme.gold }}>best self?</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 18,
              color: 'rgba(247,242,235,0.65)',
              maxWidth: 480,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Join thousands discovering a more intentional, vibrant, and fulfilling life through
            Aurem&apos;s holistic approach.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '18px 40px',
                borderRadius: 100,
                background: theme.gold,
                color: theme.textPrimary,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                boxShadow: '0 8px 32px rgba(201,169,110,0.35)',
              }}
            >
              Start for Free <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '18px 40px',
                borderRadius: 100,
                background: 'transparent',
                color: 'rgba(247,242,235,0.75)',
                fontSize: 16,
                fontWeight: 500,
                textDecoration: 'none',
                border: '1.5px solid rgba(247,242,235,0.2)',
              }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
};

// --- Footer ---
const Footer = () => {
  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Support: ['Help Center', 'Community', 'Privacy', 'Terms'],
  };

  return (
    <footer
      style={{
        background: theme.textPrimary,
        padding: '72px 0 40px',
        color: 'rgba(247,242,235,0.6)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            marginBottom: 64,
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.gold}, ${theme.accentDark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={14} color="#fff" />
              </div>
              <span
                className="font-serif"
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: theme.bg,
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                }}
              >
                Aurem
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: 'rgba(247,242,235,0.5)',
                maxWidth: 260,
              }}
            >
              Ancient wisdom meets cutting-edge AI — your companion on the journey to whole
              wellness.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(247,242,235,0.4)',
                  marginBottom: 4,
                }}
              >
                {section}
              </h4>
              {items.map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: 'rgba(247,242,235,0.55)',
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = theme.bg)}
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = 'rgba(247,242,235,0.55)')
                  }
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        <HairlineDivider
          style={{ background: 'linear-gradient(90deg, transparent, rgba(247,242,235,0.12), transparent)' }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 32,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} Aurem. All rights reserved.
          </p>
          <p style={{ fontSize: 13 }}>
            Crafted with <span style={{ color: theme.gold }}>♥</span> for human flourishing
          </p>
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
