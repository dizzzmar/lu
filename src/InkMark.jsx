import { useId } from "react";
import "./ink.css";
// Original Bézier ribbons: separate edges give each gesture its own pressure,
// taper and overrun. SVG masks reveal the ink without moving surrounding type.
const gestures = {
  orbit: {
    box: "0 0 800 520",
    strokes: [
      {
        guide:
          "M665 58C548 13 365 14 210 55C87 87 25 166 33 252C39 365 166 445 332 471C513 501 689 452 754 350C813 260 777 148 701 107",
        fill: "M665 57C548 12 365 13 209 54C86 86 23 166 31 252C36 366 164 448 332 474C515 503 692 454 757 351C815 259 778 147 701 107L700 109C775 151 809 263 751 349C686 449 512 497 333 469C168 444 42 363 35 252C28 169 89 89 211 57C366 16 548 15 665 60Z",
      },
      {
        guide: "M45 182C3 300 84 414 237 458C419 510 639 481 729 403",
        fill: "M45 182C1 300 82 416 237 461C421 513 641 484 729 403L728 402C637 477 418 506 238 456C87 412 7 299 47 182Z",
      },
    ],
  },
  underline: {
    box: "0 0 300 32",
    strokes: [
      {
        guide: "M4 19C72 11 158 7 295 11",
        fill: "M3 19C72 9 159 6 296 10L295 12C167 10 78 14 4 21Z",
      },
      {
        guide: "M28 27C106 20 182 17 265 18",
        fill: "M28 27C107 18 182 16 266 18L265 19C180 18 103 22 28 28Z",
      },
    ],
  },
  arrow: {
    box: "0 0 180 110",
    strokes: [
      {
        guide: "M9 96C61 99 73 58 97 36C116 18 140 16 166 18",
        fill: "M8 96C58 96 72 55 96 34C116 15 141 14 167 17L167 20C140 19 118 22 99 39C75 61 62 103 9 98Z",
      },
      {
        guide: "M139 5C149 10 160 15 170 18C159 22 153 31 146 41",
        fill: "M140 4C150 10 163 14 171 17L172 19C160 24 154 32 146 42L144 41C149 32 155 24 166 18C157 16 147 11 138 6Z",
      },
    ],
  },
  edge: {
    box: "0 0 160 420",
    strokes: [
      {
        guide: "M42 8C110 68 138 153 119 251C109 317 75 372 19 408",
        fill: "M42 8C112 67 141 153 122 252C111 319 77 373 19 410L18 407C73 371 107 315 116 250C135 154 107 69 41 10Z",
      },
      {
        guide: "M132 137C156 248 106 364 55 393",
        fill: "M132 137C157 248 108 366 55 394L54 392C104 362 153 247 131 138Z",
      },
    ],
  },
};
export default function InkMark({
  variant = "underline",
  className = "",
  trigger = "once",
  delay = 0,
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const shape = gestures[variant];
  return (
    <svg
      className={`ink-mark ink-${variant} ink-${trigger} ${className}`}
      viewBox={shape.box}
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ "--ink-delay": `${delay}ms` }}
    >
      <defs>
        {shape.strokes.map((stroke, i) => (
          <mask
            id={`ink-${id}-${i}`}
            key={i}
            maskUnits="userSpaceOnUse"
            x="-10"
            y="-10"
            width="830"
            height="550"
          >
            <path
              className="ink-mask-path"
              d={stroke.guide}
              pathLength="1"
              fill="none"
              stroke="white"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="1 1"
              style={{ "--ink-pass": i }}
            />
          </mask>
        ))}
      </defs>
      {shape.strokes.map((stroke, i) => (
        <path key={i} d={stroke.fill} mask={`url(#ink-${id}-${i})`} />
      ))}
    </svg>
  );
}
