import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createFilmCanvas } from "./FilmCanvas";
import "./style.css";
const base = import.meta.env.BASE_URL;
const films = [
  {
    name: "Untitled 01",
    type: "AI film",
    image: "dunes",
    alt: "Sunlit desert rock formations",
    lines: ["UNTITLED", "01"],
  },
  {
    name: "Untitled 02",
    type: "Brand film",
    image: "ocean",
    alt: "Turquoise ocean waves",
    lines: ["UNTITLED", "02"],
  },
  {
    name: "Untitled 03",
    type: "Visual study",
    image: "mountains",
    alt: "A mountain beneath a pastel sky",
    lines: ["UNTITLED", "03"],
  },
  {
    name: "Untitled 04",
    type: "Experimental",
    image: "light",
    alt: "Mountains reflected in a quiet lake",
    lines: ["UNTITLED", "04"],
  },
];
const reducedQuery = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)");
function Arrow({ down = false }) {
  return (
    <svg
      className={"arrow" + (down ? " down" : "")}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}
function Wordmark({ large = false }) {
  return (
    <span className={"wordmark" + (large ? " large" : "")}>
      <span className="wordmark-line">
        <span>LUCÍA</span>
      </span>
      <span className="wordmark-line">
        <span>CLAVIJO</span>
      </span>
      <small>FILMMAKER & VIDEO EDITOR</small>
    </span>
  );
}
function TicketButton({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={"ticket-button " + className}
      {...props}
    >
      <span>{children}</span>
      <span className="ticket-arrow">
        <Arrow />
      </span>
    </button>
  );
}
function App() {
  const [reduced, setReduced] = useState(reducedQuery().matches);
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem("lucia-entered-v2") === "true",
  );
  const [intro, setIntro] = useState(
    () => sessionStorage.getItem("lucia-entered-v2") !== "true",
  );
  const [active, setActive] = useState(0),
    [panel, setPanel] = useState(null),
    [canvasReady, setCanvasReady] = useState(false),
    [dragging, setDragging] = useState(false);
  const canvas = useRef(null),
    lenis = useRef(null),
    dialog = useRef(null),
    lastFocus = useRef(null),
    closingAnimation = useRef(null),
    dirty = useRef(true),
    pointer = useRef(null),
    cursor = useRef(null),
    introTimer = useRef(null),
    footer = useRef(null);
  const activeRef = useRef(0);
  useEffect(() => {
    const q = reducedQuery();
    const change = () => setReduced(q.matches);
    q.addEventListener("change", change);
    return () => q.removeEventListener("change", change);
  }, []);
  useEffect(() => () => clearTimeout(introTimer.current), []);
  useEffect(() => {
    const sections = [...document.querySelectorAll(".film")];
    const surfaces = sections.map((e) => e.querySelector(".film-surface"));
    const images = sections.map((e) => e.querySelector(".film-image"));
    let renderer = null,
      frame = 0,
      lastY = scrollY,
      bend = 0,
      lastTime = 0;
    setCanvasReady(false);
    if (!reduced) {
      lenis.current = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
      });
      try {
        renderer = createFilmCanvas(canvas.current, images, () => {
          setCanvasReady(true);
          dirty.current = true;
        });
      } catch (error) {
        console.warn("Film surface fallback:", error.message);
        renderer = null;
      }
    }
    const mark = () => {
      dirty.current = true;
    };
    window.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("resize", mark);
    const contextLost = (e) => {
      e.preventDefault();
      setCanvasReady(false);
    };
    canvas.current.addEventListener("webglcontextlost", contextLost);
    const animate = (time) => {
      frame = requestAnimationFrame(animate);
      lenis.current?.raf(time);
      const y = scrollY,
        delta = y - lastY;
      lastY = y;
      const dt = Math.min(32, time - lastTime || 16);
      lastTime = time;
      const target = reduced
        ? 0
        : Math.max(-1.3, Math.min(1.3, delta / (dt * 0.95)));
      bend += (target - bend) * (1 - Math.exp(-dt / 110));
      if (!dirty.current && Math.abs(bend) < 0.001) return;
      dirty.current = false;
      const rects = surfaces.map((e) => e.getBoundingClientRect());
      renderer?.draw(rects, bend);
      let closest = 0,
        distance = Infinity;
      rects.forEach((r, i) => {
        const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
        if (d < distance) {
          distance = d;
          closest = i;
        }
        const inView =
          r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.2;
        sections[i].classList.toggle("in-view", inView);
      });
      if (closest !== activeRef.current) {
        activeRef.current = closest;
        setActive(closest);
      }
      const footerRect = footer.current?.getBoundingClientRect();
      document.body.classList.toggle(
        "at-footer",
        footerRect?.top < innerHeight * 0.42,
      );
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", mark);
      window.removeEventListener("resize", mark);
      canvas.current?.removeEventListener("webglcontextlost", contextLost);
      lenis.current?.destroy();
      lenis.current = null;
      renderer?.destroy();
      document.body.classList.remove("at-footer");
    };
  }, [reduced]);
  useEffect(() => {
    document.body.style.overflow = !entered || panel ? "hidden" : "";
    if (!entered || panel) lenis.current?.stop();
    else {
      lenis.current?.start();
      dirty.current = true;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered, panel, reduced]);
  useEffect(() => {
    if (!panel) return;
    lastFocus.current = document.activeElement;
    if (!dialog.current.open) dialog.current.showModal();
    closingAnimation.current?.cancel();
    const el = dialog.current;
    el.animate(
      reduced
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
      { duration: reduced ? 150 : 500, easing: "cubic-bezier(0.23,1,0.32,1)" },
    );
  }, [panel, reduced]);
  const close = useCallback(() => {
    if (!dialog.current.open) return;
    closingAnimation.current?.cancel();
    const animation = dialog.current.animate(
      reduced
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }],
      { duration: reduced ? 100 : 240, easing: "cubic-bezier(0.23,1,0.32,1)" },
    );
    closingAnimation.current = animation;
    animation.onfinish = () => {
      dialog.current.close();
      setPanel(null);
      lastFocus.current?.focus();
    };
  }, [reduced]);
  const move = useCallback(
    (i) => {
      const target = document.getElementById("film-" + i);
      if (!target) return;
      if (panel) {
        closingAnimation.current?.cancel();
        dialog.current.close();
        setPanel(null);
      }
      lenis.current?.start();
      const top = target.offsetTop;
      if (lenis.current && !reduced)
        lenis.current.scrollTo(top, {
          duration: 1.3,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      else window.scrollTo({ top, behavior: "instant" });
      dirty.current = true;
    },
    [panel, reduced],
  );
  useEffect(() => {
    if (!entered || panel) return;
    const key = (e) => {
      if (e.target.closest("button,a,input,textarea,select")) return;
      if (
        ["ArrowDown", "PageDown", "ArrowUp", "PageUp", "Home", "End"].includes(
          e.key,
        )
      ) {
        e.preventDefault();
        move(
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? 3
              : Math.max(
                  0,
                  Math.min(
                    3,
                    activeRef.current +
                      (["ArrowDown", "PageDown"].includes(e.key) ? 1 : -1),
                  ),
                ),
        );
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [entered, panel, move]);
  const enter = () => {
    setEntered(true);
    sessionStorage.setItem("lucia-entered-v2", "true");
    introTimer.current = setTimeout(
      () => {
        setIntro(false);
        document.querySelector(".current-film")?.focus({ preventScroll: true });
      },
      reduced ? 160 : 850,
    );
  };
  const start = (e) => {
    if (
      e.pointerType !== "mouse" ||
      e.button !== 0 ||
      e.target.closest("button,a")
    )
      return;
    pointer.current = {
      y: e.clientY,
      last: e.clientY,
      scroll: scrollY,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    lenis.current?.stop();
  };
  const pointerMove = (e) => {
    if (cursor.current) {
      cursor.current.classList.add("positioned");
      cursor.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
    }
    if (!pointer.current) return;
    const d = pointer.current;
    if (Math.abs(d.y - e.clientY) > 4) {
      d.moved = true;
      setDragging(true);
    }
    const now = performance.now();
    d.velocity = (d.last - e.clientY) / Math.max(8, now - d.lastTime);
    d.last = e.clientY;
    d.lastTime = now;
    const top = d.scroll + d.y - e.clientY;
    lenis.current
      ? lenis.current.scrollTo(top, { immediate: true, force: true })
      : window.scrollTo({ top, behavior: "instant" });
    dirty.current = true;
  };
  const stop = () => {
    const d = pointer.current;
    if (!d) return;
    pointer.current = null;
    setDragging(false);
    lenis.current?.start();
    if (d.moved && !reduced && performance.now() - d.lastTime < 100)
      lenis.current?.scrollTo(scrollY + d.velocity * 180, {
        duration: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
  };
  return (
    <div
      className={`site ${entered ? "entered" : ""} ${canvasReady && !reduced ? "webgl-ready" : ""} ${dragging ? "is-dragging" : ""}`}
    >
      <a
        className="skip"
        href="#film-0"
        onClick={() => {
          setEntered(true);
          setIntro(false);
        }}
      >
        Skip to films
      </a>
      <canvas ref={canvas} className="film-canvas" aria-hidden="true" />
      {intro && (
        <div
          className={"entrance " + (entered ? "leaving" : "")}
          aria-label="Portfolio entrance"
        >
          <div className="entrance-meta">
            <span>MADRID, SPAIN</span>
            <span>AI FILMMAKING · EDITING</span>
          </div>
          <Wordmark large />
          <div className="entrance-bottom">
            <span>
              SELECTED WORK
              <br />
              FOUR PLACEHOLDER FILMS
            </span>
            <TicketButton onClick={enter}>Enter</TicketButton>
            <span>
              SOUND OFF
              <br />
              SCROLL TO EXPLORE
            </span>
          </div>
        </div>
      )}
      <header className="site-header" inert={!entered || !!panel}>
        <a
          href="#film-0"
          onClick={(e) => {
            e.preventDefault();
            move(0);
          }}
          className="brand"
          aria-label="Lucía Clavijo home"
        >
          <Wordmark />
        </a>
        <nav className="nav-ticket" aria-label="Main navigation">
          <div className="ticket-film">
            <button
              className="current-film"
              onClick={() => setPanel("index")}
              aria-haspopup="dialog"
            >
              <img
                key={active + "img"}
                src={`${base}placeholders/${films[active].image}.jpg`}
                alt=""
              />
              <span className="current-film-label" key={active}>
                {films[active].name}
              </span>
              <Arrow down />
            </button>
            <div className="ticket-meta">
              <span>{films[active].type}</span>
              <span>0{active + 1} / 04</span>
              <span>PLACEHOLDER</span>
            </div>
          </div>
          <button
            className="menu-button"
            onClick={() => setPanel("menu")}
            aria-label="Open menu"
          >
            <span />
            <span />
          </button>
        </nav>
      </header>
      <main
        id="work"
        inert={!entered || !!panel}
        onPointerDown={start}
        onPointerMove={pointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      >
        {films.map((film, i) => (
          <section
            className="film"
            id={"film-" + i}
            key={film.name}
            aria-label={`${film.name}, placeholder film`}
          >
            <div className="film-surface">
              <img
                className="film-image"
                src={`${base}placeholders/${film.image}.jpg`}
                alt={film.alt}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
              <div className="shade" />
              <div className="film-top-left">
                <span>0{i + 1} / 04</span>
                <p>
                  {film.type}
                  <br />
                  PLACEHOLDER FILM
                </p>
              </div>
              <div className="film-top-right">
                DEMONSTRATION STILL
                <br />
                NOT CLIENT WORK
              </div>
              <div className="film-content">
                <h1 aria-label={film.name}>
                  {film.lines.map((line, j) => (
                    <span className="title-mask" key={line}>
                      <span style={{ "--line": j }}>{line}</span>
                    </span>
                  ))}
                </h1>
                <dl className="film-credits">
                  <div>
                    <dt>FILMMAKER</dt>
                    <dd>LUCÍA CLAVIJO</dd>
                  </div>
                  <div>
                    <dt>FORMAT</dt>
                    <dd>{film.type}</dd>
                  </div>
                  <div>
                    <dt>STATUS</dt>
                    <dd>COMING SOON</dd>
                  </div>
                </dl>
              </div>
              <TicketButton
                className="explore"
                onClick={() => setPanel("film-" + i)}
              >
                Explore
              </TicketButton>
            </div>
          </section>
        ))}
        <footer ref={footer} className="closing">
          <div className="footer-top">
            <span>FOR PROJECTS & COLLABORATIONS</span>
            <button
              className="footer-contact"
              onClick={() => setPanel("contact")}
            >
              LET’S TALK
              <Arrow />
            </button>
          </div>
          <div className="footer-name" aria-hidden="true">
            LUCÍA CLAVIJO
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} LUCÍA CLAVIJO</span>
            <button onClick={() => setPanel("about")}>ABOUT</button>
            <a
              href="https://www.linkedin.com/in/luciaclavijoferreira/"
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN
            </a>
            <a
              href="https://www.behance.net/luciaclavijo"
              target="_blank"
              rel="noreferrer"
            >
              BEHANCE
            </a>
            <button className="back-top" onClick={() => move(0)}>
              BACK TO TOP <Arrow />
            </button>
          </div>
        </footer>
      </main>
      <aside
        className="film-rail"
        aria-label="Film navigation"
        inert={!entered || !!panel}
      >
        {films.map((f, i) => (
          <button
            key={i}
            className={i === active ? "selected" : ""}
            aria-label={`Go to film ${i + 1}: ${f.name}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => move(i)}
          >
            <span>0{i + 1}</span>
            <i />
          </button>
        ))}
      </aside>
      <div className="gallery-instructions" aria-hidden="true">
        <span className="scroll-icon">
          <i />
        </span>
        SCROLL OR DRAG TO EXPLORE
      </div>
      <div
        ref={cursor}
        className={"drag-cursor " + (dragging ? "held" : "")}
        aria-hidden="true"
      >
        <span>DRAG</span>
      </div>
      <dialog
        data-lenis-prevent
        ref={dialog}
        className={
          "overlay " + (panel === "menu" || panel === "index" ? "wide" : "")
        }
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-label={
          panel === "menu"
            ? "Navigation"
            : panel === "index"
              ? "Film index"
              : panel === "contact"
                ? "Contact Lucía"
                : panel === "about"
                  ? "About Lucía"
                  : "Placeholder film details"
        }
      >
        <div className="panel">
          <div className="panel-top">
            <Wordmark />
            <button
              className="close-button"
              onClick={close}
              aria-label="Close dialog"
            >
              CLOSE{" "}
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m5 5 14 14M19 5 5 19" />
              </svg>
            </button>
          </div>
          {panel === "menu" && (
            <div className="menu-grid">
              <div className="big-links">
                {[
                  ["Work", "index"],
                  ["About", "about"],
                  ["Contact", "contact"],
                ].map(([label, id], i) => (
                  <button
                    style={{ "--item": i }}
                    onClick={() => setPanel(id)}
                    key={id}
                  >
                    <span>{label}</span>
                    <Arrow />
                  </button>
                ))}
              </div>
              <div className="menu-aside">
                <p>
                  Lucía Clavijo
                  <br />
                  AI filmmaker & video editor.
                </p>
                <p>
                  Based in Madrid.
                  <br />
                  Working with brands & agencies.
                </p>
                <a
                  href="https://www.behance.net/luciaclavijo"
                  target="_blank"
                  rel="noreferrer"
                >
                  BEHANCE <Arrow />
                </a>
                <a
                  href="https://www.linkedin.com/in/luciaclavijoferreira/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LINKEDIN <Arrow />
                </a>
                <small>
                  FOUR PLACEHOLDER FILMS.
                  <br />
                  PROJECTS TO BE ADDED.
                </small>
              </div>
            </div>
          )}
          {panel === "index" && (
            <>
              <h2 className="index-title">
                WORK INDEX<span>01—04</span>
              </h2>
              <div className="film-list">
                {films.map((f, i) => (
                  <button
                    style={{ "--item": i }}
                    key={i}
                    onClick={() => move(i)}
                  >
                    <span className="index-number">0{i + 1}</span>
                    <div className="index-image">
                      <img src={`${base}placeholders/${f.image}.jpg`} alt="" />
                    </div>
                    <b>{f.name}</b>
                    <small>
                      {f.type}
                      <br />
                      PLACEHOLDER
                    </small>
                    <Arrow />
                  </button>
                ))}
              </div>
            </>
          )}
          {panel === "about" && (
            <div className="editorial-panel">
              <h2>
                ABOUT
                <br />
                LUCÍA.
              </h2>
              <div>
                <p className="body-copy">
                  I’m Lucía Clavijo, an AI filmmaker and video editor crafting
                  bold, high-impact stories for global brands and agencies.
                </p>
                <p className="body-copy">
                  With seven years of editing experience, I bring creative
                  instincts and technical precision to every project.
                </p>
                <dl className="about-facts">
                  <div>
                    <dt>BASED IN</dt>
                    <dd>Madrid, Spain</dd>
                  </div>
                  <div>
                    <dt>FOCUS</dt>
                    <dd>AI filmmaking · Video editing</dd>
                  </div>
                  <div>
                    <dt>TEACHING</dt>
                    <dd>Visual storytelling & generative AI at LABASAD</dd>
                  </div>
                </dl>
                <TicketButton
                  className="dark-ticket"
                  onClick={() => setPanel("contact")}
                >
                  Get in touch
                </TicketButton>
              </div>
            </div>
          )}
          {panel === "contact" && (
            <div className="editorial-panel">
              <h2>
                LET’S
                <br />
                TALK.
              </h2>
              <div>
                <p className="body-copy">
                  For projects, collaborations, or a conversation about film.
                </p>
                <a
                  className="contact-link"
                  href="https://www.linkedin.com/in/luciaclavijoferreira/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <Arrow />
                </a>
                <a
                  className="contact-link"
                  href="https://www.behance.net/luciaclavijo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Behance <Arrow />
                </a>
                <p className="panel-note">
                  A direct contact address will be added before launch.
                </p>
              </div>
            </div>
          )}
          {panel?.startsWith("film-") &&
            (() => {
              const i = Number(panel.slice(5)),
                f = films[i];
              return (
                <div className="detail">
                  <div className="detail-image">
                    <img
                      src={`${base}placeholders/${f.image}.jpg`}
                      alt={f.alt}
                    />
                  </div>
                  <div className="detail-copy">
                    <h2>{f.name}</h2>
                    <div>
                      <p className="body-copy">
                        Placeholder film. Video, project information, and
                        credits will be added here.
                      </p>
                      <p className="panel-note">
                        DEMONSTRATION STILL · NOT CLIENT WORK
                      </p>
                      <TicketButton
                        className="dark-ticket"
                        onClick={() => move((i + 1) % films.length)}
                      >
                        Next film
                      </TicketButton>
                    </div>
                  </div>
                </div>
              );
            })()}
          <div className="panel-bottom">
            <span>LUCÍA CLAVIJO</span>
            <span>MADRID, SPAIN</span>
            <span>AI FILMMAKING & EDITING</span>
          </div>
        </div>
      </dialog>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
