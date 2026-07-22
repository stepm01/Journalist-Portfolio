import React, { useRef, useState, useEffect } from 'react';
import {
  motion, useScroll, useTransform, useReducedMotion, useSpring, useMotionValue
} from 'framer-motion';
import { useData } from '../contexts/DataContext';
import {
  Play, ArrowUpRight, ArrowRight, Download, Mail, Menu, X
} from 'lucide-react';
import './Home.css';

/* ----------------------------- motion presets ----------------------------- */
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const stagger = (gap = 0.09, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
const clipUp = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.95, ease: EASE } },
};

/* accent parser: *word* -> red emphasis */
function accent(text = '') {
  const parts = String(text).split(/(\*[^*]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*')
      ? <em key={i} className="accent">{p.slice(1, -1)}</em>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

/* Scroll-linked image parallax — image drifts inside its frame as you scroll */
function ImgParallax({ src, alt, className, fallback, range = 40 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-range, range]);
  return (
    <div className="pimg-wrap" ref={ref}>
      {src
        ? <motion.img src={src} alt={alt} className={className} style={{ y }} loading="lazy" />
        : fallback}
    </div>
  );
}

/* Reusable section header with broadcast timecode */
function SectionHead({ code, kicker, title, light }) {
  return (
    <motion.div
      className={`sec-head ${light ? 'on-dark' : ''}`}
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px' }}
    >
      <motion.span className="tc mono" variants={fadeUp}>
        <i className="tc-dot" />{code} &mdash; {kicker}
      </motion.span>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
    </motion.div>
  );
}

export default function Home() {
  const { profile, experience, reels, bylines } = useData();
  const reduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* page scroll progress bar */
  const { scrollYProgress: pageProgress } = useScroll();
  const progress = useSpring(pageProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  /* hero portrait parallax */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const pY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const portraitY = useSpring(pY, { stiffness: 120, damping: 24, mass: 0.4 });
  const heroFade = useTransform(scrollYProgress, [0, 0.9], [1, reduce ? 1 : 0.35]);

  /* portrait mouse-tilt (cinematic 3D) */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotX = useSpring(tiltX, { stiffness: 150, damping: 18 });
  const rotY = useSpring(tiltY, { stiffness: 150, damping: 18 });

  /* scroll-linked timeline spine draw */
  const expRef = useRef(null);
  const { scrollYProgress: expProgress } = useScroll({
    target: expRef,
    offset: ['start 78%', 'end 55%'],
  });
  const spineScale = useSpring(
    useTransform(expProgress, [0, 1], [0, 1]),
    { stiffness: 90, damping: 28, mass: 0.4 }
  );

  /* subtle scroll-linked lift for the closing footer headline */
  const footRef = useRef(null);
  const { scrollYProgress: footProgress } = useScroll({
    target: footRef,
    offset: ['start end', 'end end'],
  });
  const footHeadY = useTransform(footProgress, [0, 1], [reduce ? 0 : 60, 0]);
  const onPortraitMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 12);
    tiltX.set(py * -12);
  };
  const onPortraitLeave = () => { tiltX.set(0); tiltY.set(0); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---- data with graceful placeholders ---- */
  const p = profile || {};
  const name = p.name || 'Anna Reyes';
  const first = name.split(' ')[0];
  const last = name.split(' ').slice(-1)[0];
  const tagline = p.tagline || 'reports in *motion*.';
  const bio = p.bio ||
    'A senior journalism major covering culture, campus power, and the stories that don’t make the front page — on the page and on the feed.';
  const about = p.about ||
    'I chase the story until it makes sense.\nFrom city-hall filing cabinets to the front camera of a phone, I report where people actually are. My work moves between long-form investigation and short-form video — same rigor, different runtime.\nRight now I’m finishing a journalism degree and freelancing across print and social.';
  const focus = p.focusAreas?.length ? p.focusAreas : ['Investigative', 'Local government', 'Short-form video', 'Culture'];
  const pubs = p.publications?.length ? p.publications : ['The Campus Ledger', 'City Beat', 'Reel Report', 'The Dispatch', 'Nightwire'];
  const email = p.email || 'hello@example.com';
  const cvURL = p.cvURL || '';
  const socials = p.socials?.length ? p.socials : [];
  const portrait = p.portraitURL;

  const aboutLines = about.split('\n').filter(Boolean);
  const aboutLead = aboutLines[0];
  const aboutBody = aboutLines.slice(1);

  const navLinks = [
    ['about', 'About'],
    ['experience', 'Experience'],
    ['reels', 'Reels'],
    ['work', 'Published'],
  ];
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing">
      {/* scroll progress */}
      <motion.div className="scroll-prog" style={{ scaleX: progress }} aria-hidden />

      {/* grain + edge frame */}
      <div className="grain" aria-hidden />

      {/* ============================== NAV ============================== */}
      <motion.nav
        className={scrolled ? 'lnav scrolled' : 'lnav'}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      >
        <div className="wrap lnav-inner">
          <a href="#top" className="brand">
            <span className="brand-mark">✳</span>
            <span className="brand-name">{name}</span>
          </a>
          <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
            {navLinks.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>
            ))}
            <a href="#contact" className="nav-cta" onClick={closeMenu}>
              Get in touch <ArrowUpRight size={15} />
            </a>
          </div>
          <button
            className="burger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* ============================== HERO ============================== */}
      <header className="hero" id="top" ref={heroRef}>
        <div className="aurora" aria-hidden>
          <span className="a1" /><span className="a2" /><span className="a3" />
        </div>
        <motion.div className="wrap hero-grid" style={{ opacity: heroFade }}>
          <motion.div
            className="hero-copy"
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            animate="show"
          >
            <motion.div className="hero-eyebrow mono" variants={fadeUp}>
              <span className="live-dot" /> ON AIR · SENIOR JOURNALIST · PORTFOLIO {new Date().getFullYear()}
            </motion.div>

            <h1 className="hero-title">
              <span className="line"><motion.span variants={clipUp} className="line-in">{first}</motion.span></span>
              <span className="line"><motion.span variants={clipUp} className="line-in">{last}</motion.span></span>
              <span className="line tagline"><motion.span variants={clipUp} className="line-in">{accent(tagline)}</motion.span></span>
            </h1>

            <motion.p className="hero-sub" variants={fadeUp}>{bio}</motion.p>

            <motion.div className="hero-actions" variants={fadeUp}>
              <a href="#work" className="btn btn-fill">
                Read the work <ArrowRight size={17} />
              </a>
              <a href="#reels" className="btn btn-ghost">
                <Play size={15} fill="currentColor" strokeWidth={0} /> Watch the reels
              </a>
              {cvURL && (
                <a href={cvURL} target="_blank" rel="noreferrer" className="btn btn-link">
                  <Download size={15} /> CV
                </a>
              )}
            </motion.div>
          </motion.div>

          {/* portrait */}
          <motion.div
            className="portrait"
            style={{ y: portraitY, rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
            onMouseMove={onPortraitMove}
            onMouseLeave={onPortraitLeave}
          >
            <div className="portrait-frame">
              <span className="rec mono"><i />REC</span>
              {portrait
                ? <img src={portrait} alt={name} className="portrait-img" loading="eager" />
                : <div className="portrait-ph mono">PORTRAIT<br /><span>add in Studio → Settings</span></div>}
              <div className="portrait-corner tl" /><div className="portrait-corner tr" />
              <div className="portrait-corner bl" /><div className="portrait-corner br" />
            </div>
            <div className="portrait-cap mono">
              <span>{last?.toUpperCase()}</span>
              <span>№ {new Date().getFullYear()}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* publications marquee */}
        <div className="marquee" aria-hidden>
          <motion.div
            className="marquee-track"
            animate={reduce ? {} : { x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {[...pubs, ...pubs, ...pubs, ...pubs].map((pub, i) => (
              <span className="marquee-item" key={i}>
                {pub}<b className="marquee-star">✳</b>
              </span>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ============================== ABOUT ============================== */}
      <section id="about" className="about">
        <div className="wrap">
          <SectionHead code="00:01" kicker="About" title="Who she is" />
          <div className="about-grid">
            <motion.p
              className="about-lead"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-15% 0px' }}
            >
              {aboutLead}
            </motion.p>
            <motion.div
              className="about-body"
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-15% 0px' }}
            >
              {aboutBody.map((para, i) => (
                <motion.p key={i} variants={fadeUp}>{para}</motion.p>
              ))}
              <motion.ul className="focus" variants={fadeUp}>
                {focus.map((f, i) => <li key={i}>{f}</li>)}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================== EXPERIENCE ============================== */}
      <section id="experience" className="experience">
        <div className="wrap">
          <SectionHead code="00:02" kicker="Experience" title="The timeline" />
          <motion.div
            className="tl"
            ref={expRef}
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <span className="tl-spine-track" aria-hidden />
            <motion.span
              className="tl-spine"
              style={{ scaleY: spineScale }}
              aria-hidden
            />
            {(experience.length ? experience : PLACEHOLDER_EXP).map((item, i) => (
              <motion.div className="tl-item" key={item.id || i} variants={fadeUp}>
                <span className="tl-node" />
                <span className="tl-date mono">{item.dateLabel}</span>
                <h3 className="tl-role">{item.role}</h3>
                <div className="tl-org">{item.org}</div>
                {item.description && <p className="tl-desc">{item.description}</p>}
              </motion.div>
            ))}
          </motion.div>
          {!experience.length && <p className="empty-note mono">Add roles from Studio → Experience.</p>}
        </div>
      </section>

      {/* ============================== REELS ============================== */}
      <section id="reels" className="reels">
        <div className="wrap">
          <SectionHead code="00:03" kicker="Social Reels" title="Work in motion" light />
          {(reels.length ? reels : PLACEHOLDER_REELS).length > 0 && (
            <motion.div
              className="reel-row"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {(reels.length ? reels : PLACEHOLDER_REELS).map((r, i) => (
                <motion.a
                  className="reel"
                  key={r.id || i}
                  href={r.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  variants={fadeUp}
                  whileHover={reduce ? {} : { y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="reel-card">
                    {r.views && <span className="reel-views mono">▶ {r.views}</span>}
                    {r.thumbnailURL
                      ? <img src={r.thumbnailURL} alt={r.title} className="reel-thumb" loading="lazy" />
                      : <div className="reel-ph mono">9:16</div>}
                    <span className="reel-play"><Play size={20} fill="#fff" strokeWidth={0} /></span>
                    <span className="reel-shine" />
                  </div>
                  <div className="reel-meta">
                    <div className="reel-title">{r.title}</div>
                    <div className="reel-desc">{r.description}</div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
          {!reels.length && <p className="empty-note mono on-dark">Add reels from Studio → Reels.</p>}
          <div className="reel-hint mono">↔ drag / scroll · each card opens the live reel</div>
        </div>
      </section>

      {/* ============================== BYLINES ============================== */}
      <section id="work" className="bylines">
        <div className="wrap">
          <SectionHead code="00:04" kicker="Published Bylines" title="In print & online" />
          <motion.div
            className="by-grid"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-8% 0px' }}
          >
            {(bylines.length ? bylines : PLACEHOLDER_BYLINES).map((b, i) => (
              <motion.a
                className="byline"
                key={b.id || i}
                href={b.link || '#'}
                target="_blank"
                rel="noreferrer"
                variants={fadeUp}
              >
                <div className="by-media">
                  {b.publication && <span className="by-pub mono">{b.publication}</span>}
                  <ImgParallax
                    src={b.imageURL}
                    alt={b.title}
                    range={34}
                    fallback={<div className="by-ph mono">COVER</div>}
                  />
                </div>
                <div className="by-body">
                  <h3 className="by-title">{b.title}</h3>
                  <p className="by-sub">{b.subtitle}</p>
                  <span className="by-read mono">Read the piece <ArrowUpRight size={15} /></span>
                </div>
              </motion.a>
            ))}
          </motion.div>
          {!bylines.length && <p className="empty-note mono">Add published work from Studio → Published.</p>}
        </div>
      </section>

      {/* ============================== CONTACT / FOOTER ============================== */}
      <footer id="contact" className="foot" ref={footRef}>
        <div className="wrap">
          <motion.div
            className="foot-cta"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <motion.h2 className="foot-head" variants={fadeUp} style={{ y: footHeadY }}>
              Got a story,<br />or a <span className="accent">tip</span>?
            </motion.h2>
            <motion.div className="foot-right" variants={fadeUp}>
              <p className="foot-note">Available for freelance, internships &amp; full-time roles.</p>
              <a href={`mailto:${email}`} className="foot-mail">
                <Mail size={20} /> {email}
              </a>
              {cvURL && (
                <a href={cvURL} target="_blank" rel="noreferrer" className="foot-cv mono">
                  <Download size={15} /> Download CV / résumé
                </a>
              )}
            </motion.div>
          </motion.div>

          {socials.length > 0 && (
            <div className="foot-socials">
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="foot-social">
                  <span>{s.label}</span><ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          )}

          <div className="foot-bar mono">
            <span>© {new Date().getFullYear()} {name}</span>
            <span>Managed from /studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------- placeholders (only render until Studio has content) ------------- */
const PLACEHOLDER_EXP = [
  { dateLabel: '2025 — Present', role: 'Editor-in-Chief', org: 'The Campus Ledger', description: 'Lead a newsroom of 20; grew readership 3× with an investigations desk and a daily social edition.' },
  { dateLabel: 'Summer 2024', role: 'Editorial Intern', org: 'City Beat', description: 'Reported on local government; filed 30+ pieces and two front-page investigations.' },
  { dateLabel: '2023 — 2024', role: 'Social Video Producer', org: 'Reel Report', description: 'Scripted, shot and edited short-form explainers averaging 200k+ views.' },
];
const PLACEHOLDER_REELS = [
  { title: 'The permit backlog, explained', description: '400 homes stuck in a filing cabinet.', views: '240k' },
  { title: 'How tuition really breaks down', description: 'Following one dollar across campus.', views: '88k' },
  { title: 'Election night, in 60 seconds', description: 'The race called from the newsroom floor.', views: '1.2M' },
  { title: 'Inside the midnight print run', description: 'What it takes to make tomorrow’s paper.', views: '54k' },
];
const PLACEHOLDER_BYLINES = [
  { publication: 'City Beat', title: 'The 400 homes stuck in a filing cabinet', subtitle: 'How a paperwork backlog quietly stalled a neighborhood.' },
  { publication: 'The Dispatch', title: 'The professor who wouldn’t stop asking', subtitle: 'A decade-long fight over public records — and what it uncovered.' },
  { publication: 'The Campus Ledger', title: 'Where the student fee actually goes', subtitle: 'A line-by-line look at $12M nobody could explain.' },
  { publication: 'Nightwire', title: 'After the last call', subtitle: 'The workers who keep a college town running at 3 a.m.' },
];
