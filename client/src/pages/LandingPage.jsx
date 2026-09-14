import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Library,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BackToTop from "../components/landing/BackToTop";

/* =========================================================
   LIBRYO LOGO MARK
========================================================= */

function LibryoLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="libryo-logo-mark"
    >
      <defs>
        <linearGradient id="logoCyan" x1="15" y1="15" x2="85" y2="85">
          <stop offset="0%" stopColor="#dfffff" />
          <stop offset="40%" stopColor="#59e7ff" />
          <stop offset="100%" stopColor="#138bad" />
        </linearGradient>

        <linearGradient id="logoMetal" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#b7d7e4" />
          <stop offset="65%" stopColor="#f8ffff" />
          <stop offset="100%" stopColor="#6e9daf" />
        </linearGradient>

        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer architecture */}

      <path
        d="M50 5L87 27V73L50 95L13 73V27L50 5Z"
        stroke="url(#logoCyan)"
        strokeWidth="2"
        opacity=".9"
        filter="url(#logoGlow)"
      />

      <path
        d="M50 14L79 31V69L50 86L21 69V31L50 14Z"
        stroke="#3fdcf7"
        strokeWidth="1"
        opacity=".55"
      />

      {/* Inner cube */}

      <path
        d="M50 20L72 33L50 46L28 33L50 20Z"
        fill="#103b4d"
        stroke="#7defff"
        strokeWidth="1.5"
      />

      <path
        d="M28 33L50 46V78L28 65V33Z"
        fill="#082533"
        stroke="#54dff7"
        strokeWidth="1.3"
      />

      <path
        d="M50 46L72 33V65L50 78V46Z"
        fill="#061a25"
        stroke="#32cce9"
        strokeWidth="1.3"
      />

      {/* Book */}

      <path
        d="M32 53L43 47L49 50V70L42 67L32 71V53Z"
        fill="url(#logoMetal)"
        stroke="#e9ffff"
        strokeWidth="1.5"
      />

      <path
        d="M51 50L57 47L68 53V71L58 67L51 70V50Z"
        fill="url(#logoMetal)"
        stroke="#e9ffff"
        strokeWidth="1.5"
      />

      <path
        d="M50 49V71"
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Digital core */}

      <circle cx="50" cy="28" r="2" fill="#ffffff" />
      <circle cx="43" cy="32" r="1.5" fill="#62ebff" />
      <circle cx="57" cy="34" r="1.5" fill="#62ebff" />

      <path
        d="M50 28L43 32L50 36L57 34L50 28Z"
        stroke="#53e7ff"
        strokeWidth="1"
        opacity=".8"
      />

      {/* Corner lights */}

      <circle cx="13" cy="27" r="1.8" fill="#ffffff" />
      <circle cx="87" cy="27" r="1.8" fill="#ffffff" />
      <circle cx="13" cy="73" r="1.8" fill="#ffffff" />
      <circle cx="87" cy="73" r="1.8" fill="#ffffff" />
    </svg>
  );
}


/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="landing-navbar">
      <div className="landing-container navbar-inner">

        <Link to="/" className="brand" onClick={closeMenu}>
          <LibryoLogo size={43} />

          <div className="brand-copy">
            <span className="brand-name">LIBRYO</span>
            <span className="brand-caption">
              DIGITAL LIBRARY
            </span>
          </div>
        </Link>

        <nav
          className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`}
        >
          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How it works
          </a>

          <a href="#library" onClick={closeMenu}>
            Library
          </a>

          <a href="#about" onClick={closeMenu}>
            About
          </a>

          <Link
            to="/login"
            className="nav-signin"
            onClick={closeMenu}
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="nav-cta"
            onClick={closeMenu}
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </nav>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>
    </header>
  );
}
/* =========================================================
   HERO
========================================================= */

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-grid" />
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />

      <div className="landing-container hero-content">

        <div className="hero-copy">

          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            THE DIGITAL ARCHITECTURE FOR MODERN CAMPUSES
          </div>

          <h1>
            A smarter library
            <span>starts here.</span>
          </h1>

          <p className="hero-description">
            Discover books, manage your borrowing, track due dates,
            and stay connected with your campus library — all from
            one beautifully designed digital space.
          </p>

          <div className="hero-actions">

            <Link to="/signup" className="primary-button">
              Start exploring
              <ArrowRight size={17} />
            </Link>

            <a href="#library" className="secondary-button">
              Browse the library
            </a>

          </div>

          <div className="hero-trust">

            <div className="trust-item">
              <CheckCircle2 size={15} />
              <span>Simple borrowing</span>
            </div>

            <div className="trust-item">
              <CheckCircle2 size={15} />
              <span>Due-date tracking</span>
            </div>

            <div className="trust-item">
              <CheckCircle2 size={15} />
              <span>Student focused</span>
            </div>

          </div>
        </div>


        {/* HERO ARCHITECTURE */}

        <div className="hero-visual">

          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="hero-architecture">

            <div className="architecture-glow" />

            <div className="architecture-hex">

              <div className="hex-line hex-line-1" />
              <div className="hex-line hex-line-2" />
              <div className="hex-line hex-line-3" />

              <div className="architecture-core">

                <LibryoLogo size={230} />

                <div className="core-label">
                  <span>LIBRARY</span>
                  <strong>CONNECTED</strong>
                </div>

              </div>

            </div>

            <div className="floating-card card-books">
              <BookOpen size={17} />
              <div>
                <strong>2,480+</strong>
                <span>Books available</span>
              </div>
            </div>

            <div className="floating-card card-borrow">
              <Clock3 size={17} />
              <div>
                <strong>3 active</strong>
                <span>Borrow limit</span>
              </div>
            </div>

            <div className="floating-node node-one" />
            <div className="floating-node node-two" />
            <div className="floating-node node-three" />

          </div>
        </div>
      </div>

      <div className="hero-bottom-fade" />
    </section>
  );
}


/* =========================================================
   STATS
========================================================= */

function Stats() {
  return (
    <section className="stats-section">
      <div className="landing-container stats-grid">

        <div className="stat">
          <strong>2,480+</strong>
          <span>Books to discover</span>
        </div>

        <div className="stat-divider" />

        <div className="stat">
          <strong>3</strong>
          <span>Active books per student</span>
        </div>

        <div className="stat-divider" />

        <div className="stat">
          <strong>24/7</strong>
          <span>Library access</span>
        </div>

        <div className="stat-divider" />

        <div className="stat">
          <strong>1 place</strong>
          <span>For your library journey</span>
        </div>

      </div>
    </section>
  );
}


/* =========================================================
   FEATURES
========================================================= */

function Features() {
  const features = [
    {
      number: "01",
      icon: Search,
      title: "Discover with clarity",
      description:
        "Find the books you need without navigating through a complicated library system.",
    },
    {
      number: "02",
      icon: BookOpen,
      title: "Borrow with ease",
      description:
        "Check availability and keep your borrowing experience simple from start to finish.",
    },
    {
      number: "03",
      icon: CalendarDays,
      title: "Stay ahead of returns",
      description:
        "Know what you've borrowed, when it is due, and what needs your attention.",
    },
    {
      number: "04",
      icon: ShieldCheck,
      title: "Built for your campus",
      description:
        "A dedicated digital experience designed around students and academic libraries.",
    },
  ];

  return (
    <section id="features" className="features-section">

      <div className="landing-container">

        <div className="section-heading">

          <div className="section-kicker">
            <Sparkles size={14} />
            BUILT AROUND STUDENTS
          </div>

          <h2>
            Everything you need.
            <span>Nothing you don't.</span>
          </h2>

          <p>
            Libryo removes the friction from everyday library
            management and puts the things that matter most
            within reach.
          </p>

        </div>

        <div className="feature-grid">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.number}>

                <div className="feature-top">

                  <span className="feature-number">
                    {feature.number}
                  </span>

                  <div className="feature-icon">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>

                </div>

                <div className="feature-content">
                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <a href="#how-it-works">
                    Learn more
                    <ChevronRight size={15} />
                  </a>
                </div>

              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
}


/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section">
      <div className="landing-container">

        <div className="how-layout">

          <div className="how-intro">

            <div className="section-kicker">
              <Library size={14} />
              HOW LIBRYO WORKS
            </div>

            <h2>
              From search
              <span>to shelf.</span>
            </h2>

            <p>
              Your library experience should be as easy as
              opening a book. Libryo keeps every step clear.
            </p>

          </div>


          <div className="steps">

            {/* STEP 01 */}
            <div className="step">

              <div className="step-number">
                01
              </div>

              <div className="step-line" />

              <div className="step-content">

                <h3>
                  Find your book
                </h3>

                <p>
                  Search through the library collection and
                  see availability at a glance.
                </p>

              </div>

            </div>


            {/* STEP 02 */}
            <div className="step">

              <div className="step-number">
                02
              </div>

              <div className="step-line" />

              <div className="step-content">

                <h3>
                  Borrow it
                </h3>

                <p>
                  Request the book and keep your active
                  borrowing list organized.
                </p>

              </div>

            </div>


            {/* STEP 03 */}
            <div className="step">

              <div className="step-number">
                03
              </div>

              {/* THIS WAS MISSING */}
              <div className="step-line" />

              <div className="step-content">

                <h3>
                  Read & return
                </h3>

                <p>
                  Keep track of your due date and return
                  your book on time.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   LIBRARY PREVIEW
========================================================= */

function LibraryPreview() {
  const books = [
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      category: "TECHNOLOGY",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "COMPUTING",
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      category: "ENGINEERING",
    },
  ];

  return (
    <section id="library" className="library-section">

      <div className="landing-container">

        <div className="library-heading">

          <div>
            <div className="section-kicker">
              <BookOpen size={14} />
              THE COLLECTION
            </div>

            <h2>
              Knowledge worth
              <span>opening.</span>
            </h2>
          </div>

          <a href="/books" className="text-link">
            Explore all books
            <ArrowRight size={16} />
          </a>

        </div>


        <div className="books-grid">

          {books.map((book, index) => (
            <article className="book-card" key={book.title}>

              <div className={`book-cover cover-${index + 1}`}>

                <div className="book-cover-grid" />

                <div className="book-cover-mark">
                  <LibryoLogo size={42} />
                </div>

                <span>{book.category}</span>

                <strong>{book.title}</strong>

                <small>{book.author}</small>

              </div>

              <div className="book-card-footer">

                <div>
                  <span>STATUS</span>
                  <strong>
                    <i />
                    Available
                  </strong>
                </div>

                <ArrowRight size={17} />

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   ABOUT
========================================================= */

function AboutSection() {
  return (
    <section id="about" className="about-section">

      <div className="landing-container">

        <div className="about-box">

          <div className="about-visual">

            <div className="about-grid" />

            <LibryoLogo size={180} />

            <div className="about-orbit" />

          </div>


          <div className="about-copy">

            <div className="section-kicker">
              <UserRound size={14} />
              MADE FOR CAMPUS LIFE
            </div>

            <h2>
              Your library should
              <span>work for you.</span>
            </h2>

            <p>
              Libryo brings discovery, borrowing and library
              management together in one focused experience.
              Whether you're finding your next textbook or
              checking a return date, everything stays clear.
            </p>

            <Link to="/signup" className="outline-button">
              Create your account
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   CTA
========================================================= */

function CTA() {
  return (
    <section className="cta-section">

      <div className="cta-architecture" />

      <div className="landing-container cta-content">

        <div className="cta-logo">
          <LibryoLogo size={75} />
        </div>

        <div className="section-kicker">
          YOUR NEXT CHAPTER STARTS HERE
        </div>

        <h2>
          Ready to explore
          <span>your library?</span>
        </h2>

        <p>
          Join your campus library digitally and make every
          book easier to discover, borrow and manage.
        </p>

        <Link to="/signup" className="primary-button">
          Get started with Libryo
          <ArrowRight size={17} />
        </Link>

      </div>

    </section>
  );
}


/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="landing-footer">

      <div className="landing-container footer-inner">

        <Link to="/" className="footer-brand">

          <LibryoLogo size={38} />

          <div>
            <strong>LIBRYO</strong>

            <span>
              THE DIGITAL ARCHITECTURE FOR MODERN CAMPUSES.
            </span>
          </div>

        </Link>

        <p className="copyright">
          © {new Date().getFullYear()} Libryo. Built for modern campuses.
        </p>

      </div>

    </footer>
  );
}


/* =========================================================
   PAGE
========================================================= */

function LandingPage() {
  return (
    <div className="landing-page">

      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <LibraryPreview />
        <AboutSection />
        <CTA />
      </main>

      <Footer />
      
      <BackToTop />
      
    </div>
  );
}

export default LandingPage;