import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import InkMark from "./InkMark";
import "./about.css";
const base = import.meta.env.BASE_URL;
const clients = ["Verizon", "Google", "Lexus", "Iberdrola", "Unilever"];
const introduction =
  "Lucía Clavijo is an AI filmmaker and video editor based in Madrid. She crafts bold, high-impact stories for global brands and agencies, drawing on seven years of editing experience and a background in television commercials. Her work brings together creative instincts, technical precision and generative AI.";
function UpRight({ up = false }) {
  return (
    <svg
      className={up ? "about-arrow up" : "about-arrow"}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M4 20 20 4M5 4h15v15" />
    </svg>
  );
}
export default function AboutPage({ reduced, currentImage, onContact }) {
  const root = useRef(null),
    smooth = useRef(null),
    scrollProgress = useRef(null);
  const [client, setClient] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      if (!document.hidden) setClient((i) => (i + 1) % clients.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [reduced]);
  useEffect(() => {
    const element = root.current;
    const wrapper = element.closest("dialog");
    if (!reduced)
      smooth.current = new Lenis({
        wrapper,
        content: wrapper.firstElementChild,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: true,
      });
    const update = () => {
      const total = wrapper.scrollHeight - wrapper.clientHeight;
      if (scrollProgress.current)
        scrollProgress.current.style.transform = `scaleY(${total > 0 ? wrapper.scrollTop / total : 0})`;
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { root: wrapper, threshold: 0.12 },
    );
    element
      .querySelectorAll("[data-about-reveal]")
      .forEach((node) => observer.observe(node));
    wrapper.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      smooth.current?.destroy();
      smooth.current = null;
      observer.disconnect();
      wrapper.removeEventListener("scroll", update);
    };
  }, [reduced]);
  const toTop = () => {
    if (smooth.current)
      smooth.current.scrollTo(0, {
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    else
      root.current.closest("dialog").scrollTo({ top: 0, behavior: "instant" });
  };
  return (
    <article className="about-page" ref={root}>
      <div className="about-atmosphere" aria-hidden="true">
        <img src={`${base}placeholders/${currentImage}.jpg`} alt="" />
      </div>
      <aside className="about-side">
        <h2>About</h2>
        <div className="about-client-frame" aria-label="Selected clients">
          <span className="about-bracket top-left" />
          <span className="about-bracket top-right" />
          <span className="about-bracket bottom-left" />
          <span className="about-bracket bottom-right" />
          <span className="about-client-name" key={client} aria-hidden="true">
            {clients[client]}
          </span>
          <span className="visually-hidden">{clients.join(", ")}</span>
        </div>
      </aside>
      <div className="about-main">
        <p className="about-introduction">
          {introduction.split(" ").map((word, i) => (
            <span
              className={
                "about-word" + (word === "filmmaker" ? " ink-annotated" : "")
              }
              key={i}
            >
              <span
                className={word === "filmmaker" ? "about-ink-text" : undefined}
                style={{ "--word-delay": `${Math.min(i * 12, 420)}ms` }}
              >
                {word}
              </span>
              {word === "filmmaker" && (
                <InkMark className="ink-about-underline" delay={850} />
              )}{" "}
            </span>
          ))}
        </p>
        <dl className="about-meta">
          <div>
            <dt>Worked with:</dt>
            <dd>
              Verizon, Google, Lexus,
              <br className="desktop-break" /> Iberdrola and Unilever.
            </dd>
          </div>
          <div>
            <dt>Get in touch:</dt>
            <dd>
              <a
                href="https://www.linkedin.com/in/luciaclavijoferreira/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <br />
              <a
                href="https://www.behance.net/luciaclavijo"
                target="_blank"
                rel="noreferrer"
              >
                Behance
              </a>
              <br />
              <button onClick={onContact}>Contact Lucía</button>
            </dd>
          </div>
        </dl>
        <div className="about-location" data-about-reveal>
          <span>Madrid</span>
          <span>Spain</span>
        </div>
        <figure
          className="about-portrait"
          data-about-reveal
          aria-label="Placeholder for Lucía’s portrait"
        >
          <img
            src={`${base}brand/scissors-white.png`}
            width="1024"
            height="508"
            alt="Lucía Clavijo’s scissors-and-star logo"
          />
          <InkMark variant="edge" trigger="reveal" className="ink-portrait" />
          <figcaption>
            <span>LUCÍA CLAVIJO</span>
            <span>PORTRAIT TO BE ADDED</span>
          </figcaption>
        </figure>
        <section
          className="about-bio"
          data-about-reveal
          aria-labelledby="about-bio-title"
        >
          <h3 id="about-bio-title">[ Bio ]</h3>
          <div>
            <p>
              Lucía specializes in AI filmmaking and video editing. Her
              experience spans television commercials, branded films, production
              and post-production, with seven years of editing expertise.
            </p>
            <p>
              At WPP Production / Hogarth Spain, her work has developed from AI
              specialist to AI filmmaker. Her earlier experience includes video
              editing for The Ocean Race and editing and graphic design work in
              Lisbon.
            </p>
            <p>
              Alongside her filmmaking practice, she teaches visual storytelling
              and generative AI video at LABASAD — Barcelona School of Arts and
              Design.
            </p>
          </div>
        </section>
        <div className="about-signature" data-about-reveal>
          <img
            src={`${base}brand/scissors-white.png`}
            width="1024"
            height="508"
            alt=""
          />
          <span>Lucía Clavijo</span>
        </div>
        <button
          className="about-hello ink-action"
          onClick={onContact}
          data-about-reveal
        >
          <span className="ink-label">
            Say hello
            <InkMark
              variant="orbit"
              trigger="hover"
              className="ink-contact-loop"
            />
          </span>
          <InkMark
            variant="arrow"
            trigger="reveal"
            className="ink-contact-arrow"
          />
        </button>
        <div className="about-page-bottom">
          <button onClick={toTop}>
            BACK TO TOP
            <UpRight up />
          </button>
          <a
            href="https://www.behance.net/luciaclavijo"
            target="_blank"
            rel="noreferrer"
          >
            BEHANCE
          </a>
          <span>AI FILMMAKER & VIDEO EDITOR</span>
        </div>
      </div>
      <div className="about-scroll-track" aria-hidden="true">
        <span ref={scrollProgress} />
      </div>
    </article>
  );
}
