const careerJourney = [
  {
    role: "Software Development Engineer",
    company: "INRIX",
    period: "Sep 2021 - Jan 2024",
    location: "Los Angeles, California",
    highlights: [
      "Built a data-driven application from scratch with enterprise-ready features.",
      "Automated manual workflows to improve data handling and team efficiency.",
      "Led demos, code quality improvements, and collaborative cross-team delivery."
    ]
  },
  {
    role: "Full Stack Developer",
    company: "2G Digital",
    period: "Aug 2018 - Sep 2021",
    location: "Burbank, California",
    highlights: [
      "Designed and maintained internal platforms used across multiple departments.",
      "Delivered end-to-end tests that validated system behavior and external integrations.",
      "Championed process improvements and independently shipped high-impact features."
    ]
  },
  {
    role: "Full Stack Web Developer Student",
    company: "Coding Dojo",
    period: "Jan 2018 - Aug 2018",
    location: "Burbank, California",
    highlights: [
      "Completed an immersive 1000+ hour bootcamp spanning frontend and backend stacks.",
      "Built projects across React, Angular, Python/Django, Node.js, and Ruby.",
      "Developed a strong foundation in shipping complete full stack applications."
    ]
  },
  {
    role: "Account Associate",
    company: "KCAL Insurance Agency",
    period: "Dec 2016 - May 2017",
    location: "Hacienda Heights, California",
    highlights: [
      "Researched and compared insurance plans to identify best-fit options for clients.",
      "Managed application workflows while supporting team operations.",
      "Contributed to promotional campaigns and client-facing marketing assets."
    ]
  },
  {
    role: "Product Manager and Sales",
    company: "LULUTRIP",
    period: "May 2015 - Jun 2016",
    location: "San Jose, California",
    highlights: [
      "Analyzed customer behavior and market trends to improve product positioning.",
      "Built pricing and launch strategies for stronger market competitiveness.",
      "Coordinated cross-functional teams across sales, design, IT, and testing."
    ]
  }
];

const capabilities = [
  "TypeScript + JavaScript",
  "Python + Django",
  "React + Next.js",
  "Node.js + APIs",
  "PostgreSQL + MySQL",
  "CI/CD + Jenkins"
];

export default function Home() {
  return (
    <main className="site-shell">
      <div className="noise-layer" />
      <header className="top-nav content-width">
        <div className="brand-mark">AL</div>
        <nav>
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#connect">Connect</a>
        </nav>
      </header>

      <section className="hero content-width">
        <p className="eyebrow">FULL STACK SOFTWARE ENGINEER</p>
        <h1>Enterprise precision. Edgy execution.</h1>
        <p className="lead">
          I am Anna Li, a full stack engineer with 5+ years of experience building and
          scaling software for enterprise teams. I combine product intuition with robust
          engineering to deliver outcomes that are clean, fast, and measurable.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="https://www.annali.dev/" target="_blank" rel="noreferrer">
            View Portfolio
          </a>
          <a className="btn btn-secondary" href="https://www.linkedin.com/in/anna-h-li" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </section>

      <section id="about" className="content-width panel">
        <div className="panel-title-wrap">
          <p className="eyebrow">ABOUT ME</p>
          <h2>Building software that moves teams forward</h2>
        </div>
        <p>
          I specialize in architecting full stack systems from the ground up and modernizing
          existing products for scale. My work spans frontend experience, backend reliability,
          data flow optimization, and delivery discipline. I am comfortable owning projects
          independently while partnering deeply with teams.
        </p>
        <ul className="chip-list">
          {capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </section>

      <section className="content-width metrics-grid">
        <article>
          <p className="metric-label">Years Building</p>
          <p className="metric-value">5+</p>
        </article>
        <article>
          <p className="metric-label">Primary Focus</p>
          <p className="metric-value">Enterprise Web</p>
        </article>
        <article>
          <p className="metric-label">Edge</p>
          <p className="metric-value">Speed + Clarity</p>
        </article>
      </section>

      <section id="journey" className="content-width panel">
        <div className="panel-title-wrap">
          <p className="eyebrow">CAREER JOURNEY</p>
          <h2>From product mindset to enterprise engineering</h2>
        </div>
        <div className="timeline">
          {careerJourney.map((item) => (
            <article key={`${item.company}-${item.role}`} className="timeline-item">
              <div className="timeline-node" />
              <div className="timeline-content">
                <p className="timeline-meta">
                  {item.period} | {item.location}
                </p>
                <h3>
                  {item.role} <span>@ {item.company}</span>
                </h3>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="connect" className="content-width cta">
        <h2>Let&apos;s build something unforgettable.</h2>
        <p>
          Open to impactful full stack opportunities where product vision and engineering
          excellence meet.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="mailto:annalideveloper@gmail.com">
            Email Me
          </a>
          <a className="btn btn-secondary" href="https://www.annali.dev/" target="_blank" rel="noreferrer">
            Explore Work
          </a>
        </div>
      </section>
    </main>
  );
}
