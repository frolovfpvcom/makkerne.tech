"use client";

import * as React from "react";

/* ── the curved row ──────────────────────────────────────────────
 * One row of screenshots streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each end
 * tile curves along its length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into SLICES vertical strips,
 * each a flat facet of the cylinder showing its share of the image. The
 * strips sit still inside their tile, each turned its own few degrees round
 * the cylinder's axis, and the tile (preserve-3d) is what moves: one rotateY
 * about that same axis carries the whole tile along the arc. Only a tile's
 * delay differs, and that sets where on the arc it sits.
 *
 * Hovering any tile pauses every tile and lifts that one off the arc toward
 * you, and a tile is a link to its example. Pressing and dragging scrubs the
 * row back and forth instead; only a click that didn't drag opens a tile.
 * The JS is a ResizeObserver that sizes the loop, a handler that hands a tile
 * its next example each time it wraps, out of sight, and the drag.
 * ─────────────────────────────────────────────────────────────── */

// Strips per tile. Each is a few degrees of arc, too little to read as a facet.
const SLICES = 12;

// Camera distance from the screen, as a multiple of the cylinder's radius.
const CAMERA = 1.6;

/**
 * Cylinder radius, as a share of the row's width, that puts the frame's edge
 * `bend` radians round the arc as seen through the camera:
 * r·sinθ · CAMERA / (CAMERA − 1 + cosθ) = width / 2, solved for r.
 */
function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

// A tile is never wider than this share of the row, so a phone still shows its neighbours.
const MAX_WIDTH = 70;

// A strip's outline: its full width, less the pixel it shares with each neighbour along the top
// and bottom pixel.
const EDGE_CLIP = [
  "1px 0", "calc(100% - 1px) 0", "calc(100% - 1px) 1px", "100% 1px",
  "100% calc(100% - 1px)", "calc(100% - 1px) calc(100% - 1px)", "calc(100% - 1px) 100%",
  "1px 100%", "1px calc(100% - 1px)", "0 calc(100% - 1px)", "0 1px", "1px 1px",
].join(",");

// How far, in pixels, a press can wander before it counts as a drag rather than a click.
const SLOP = 6;

// Corner radius, as a share of the tile's height.
const RADIUS = 0.035;

/**
 * Lays the loop on the cylinder. Angles come back in degrees: `unit` is the arc one tile-height
 * spans, `limit` how far round a tile's centre can go before the whole tile is off-screen, and
 * `sweep` how far round the loop's ends sit. The loop reaches past `limit`, so a tile only ever
 * wraps out of sight, and is a whole number of tiles so the gap never stretches.
 */
function measure(width: number, height: number, tile: number, aspect: number, gap: number, bend: number) {
  const h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  // Capped so a row squeezed to a sliver can't mount hundreds of tiles.
  const columns = Math.min(40, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export type CurvedRowItem = { src: string; href: string };

type Props = {
  items: CurvedRowItem[];
  /** Seconds for the row to advance by one tile. */
  speed?: number;
  /** Tile height, as a percentage of the row's height. */
  tileHeight?: number;
  /** Tile width divided by tile height. */
  aspectRatio?: number;
  /** Space between tiles, as a percentage of a tile's height. */
  gap?: number;
  /** How far the row has bent round by the frame's edge, in degrees. Clamped to 5–85. */
  curve?: number;
  /** Width of the fade at each end, as a percentage of the row's width. */
  fade?: number;
  /** Called with the item under the pointer, or null when it leaves. */
  onHover?: (index: number | null) => void;
  className?: string;
};

export function CurvedRow({ items, speed = 9, tileHeight = 64, aspectRatio = 16 / 9, gap = 6, curve = 35, fade = 10, onHover, className = "" }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `cr-o-${id}`;
  const band = `cr-b-${id}`;
  const tile = `cr-t-${id}`;
  const lift = `cr-l-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  // Null until the observer has measured the row; the band stays hidden until then.
  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(null);
  // The item each tile shows, as a position in the run of items. Changes only when the tile wraps.
  const [shown, setShown] = React.useState<Record<number, number>>({});
  const bandRef = React.useRef<HTMLDivElement>(null);
  // The press under way: where the pointer last was, and whether it has become a drag.
  const press = React.useRef<{ x: number; moved: boolean } | null>(null);
  // Set when a drag ends, so the click that follows it doesn't open a tile.
  const swallow = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) => {
        if (prev?.columns === next.columns && prev.sweep === next.sweep && prev.unit === next.unit) return prev;
        // A new tile count remounts every tile (see the key below), so their wrap counts start over.
        if (prev?.columns !== next.columns) setShown({});
        return next;
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  // Fetch every image up front; a tile picks up its next one just before it comes back into view.
  React.useEffect(() => {
    for (const { src } of items) new Image().src = src;
  }, [items]);

  const { columns, sweep, unit, limit } = layout ?? measure(1200, 520, tileHeight, aspectRatio, gap, bend);

  // Every length is a multiple of the tile's height, which follows the row's height until
  // MAX_WIDTH caps it on narrow screens.
  const u = (n: number) => `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(MAX_WIDTH / aspectRatio).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  // Out to the axis, round it, back in: a box sits on the cylinder at the angle rotateY gives it.
  const turn = (deg: number) => `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  // Beyond `limit` a tile is wholly off-screen, so it is hidden there, which is also where it wraps.
  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${+(hide + 0.001).toFixed(4)}%,${+(100 - hide - 0.001).toFixed(4)}%{visibility:visible}}` +
    // Hovering any tile stops the whole row, so the one under the pointer holds still to be clicked.
    // !important because the inline `animation` shorthand sets the play state too.
    `.${band}:has(.${tile}:hover) .${tile}{animation-play-state:paused!important}` +
    // The tile under the pointer comes forward off the arc and grows a little. Its own transform
    // carries it round the cylinder, so the lift sits on a wrapper inside it.
    `.${lift}{transition:transform 320ms cubic-bezier(.2,.8,.2,1)}` +
    // One flat shadow behind the strips; a shadow on each strip would fall on its neighbour as a stripe.
    `.${lift}>i{opacity:0;transition:opacity 320ms ease-out}` +
    `.${tile}:hover .${lift}>i{opacity:1}` +
    `.${tile}:hover .${lift}{transform:translateZ(${u(0.3)}) scale(1.14);transition-duration:220ms}` +
    // The tiles stack in page order, not by depth, so the hovered one is lifted above both
    // neighbours, and stays there until it has settled back.
    `.${tile}{transition:z-index 0s 320ms}` +
    `.${tile}:hover{z-index:2;transition-delay:0s}` +
    // A drag holds the row still while it scrubs it, and the page's text isn't selected under it.
    `.${band}[data-drag] .${tile}{animation-play-state:paused!important}` +
    `.${band}[data-drag]{cursor:grabbing}` +
    `.${band}{user-select:none;-webkit-user-select:none}` +
    // Pausing rather than removing the motion leaves the row as a finished still.
    `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused!important}}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;

  // Scrubbing moves every tile's animation clock by the same amount, so the row keeps its spacing.
  const orbits = () =>
    (bandRef.current?.getAnimations({ subtree: true }) ?? []).filter(
      (a): a is CSSAnimation => a instanceof CSSAnimation && a.animationName === orbit,
    );

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    swallow.current = false;
    press.current = { x: e.clientX, moved: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    const p = press.current;
    const el = bandRef.current;
    if (!p || !el) return;
    const dx = e.clientX - p.x;
    const anims = orbits();
    if (!p.moved) {
      if (Math.abs(dx) < SLOP) return;
      p.moved = true;
      el.dataset.drag = "";
      el.setPointerCapture(e.pointerId);
      // Leave room to scrub backwards. Whole loops times the item count land every tile on the
      // same example it shows now, so nothing visibly changes.
      const loop = Math.max(items.length, 1) * duration * 1000;
      for (const a of anims) if (Number(a.currentTime) < duration * 1000) a.currentTime = Number(a.currentTime) + loop;
    }
    // One tile's pitch in pixels takes `speed` seconds; the row streams leftward, so dragging
    // right winds it back.
    const tileEl = el.querySelector<HTMLElement>(`.${tile}`);
    const pitch = (tileEl?.offsetHeight ?? 0) * (aspectRatio + gap / 100);
    if (pitch > 0) {
      const dt = (-dx / pitch) * speed * 1000;
      for (const a of anims) a.currentTime = Math.max(0, Number(a.currentTime) + dt);
    }
    p.x = e.clientX;
  }

  function onPointerEnd(e: React.PointerEvent) {
    const p = press.current;
    press.current = null;
    if (!p?.moved) return;
    swallow.current = true;
    const el = bandRef.current;
    if (el) {
      delete el.dataset.drag;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    }
  }

  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ containerType: "size" }}>
      <style>{css}</style>
      {/* Decorative for screen readers; the section lists the same examples as plain links. */}
      <div
        ref={bandRef}
        aria-hidden
        className={`${band} pointer-events-none absolute inset-0 transition-opacity duration-500`}
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: "50% 50%",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
        onMouseLeave={() => onHover?.(null)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => {
          if (!swallow.current) return;
          swallow.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          // Tile `columns - 1` starts nearest the exit, so this numbers tiles in the order they come on.
          const first = columns - 1 - t;
          const i = (shown[t] ?? first) % Math.max(items.length, 1);
          const item = items[i];
          if (!item) return null;
          return (
            <a
              // Keyed by the tile count too, so a resize that adds tiles starts them all together;
              // a tile mounted later would run behind the others and overlap its neighbour.
              key={`${columns}-${t}`}
              href={item.href}
              target="_blank"
              rel="noopener"
              tabIndex={-1}
              draggable={false}
              className={`${tile} pointer-events-auto absolute block`}
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(50% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                // Sideways drags are the row's; up and down still scroll the page.
                touchAction: "pan-y",
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onMouseEnter={() => onHover?.(i)}
              onAnimationIteration={(e) => {
                // elapsedTime counts whole loops, missed events included.
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              <span className={`${lift} absolute inset-0 block`} style={{ transformStyle: "preserve-3d" }}>
                <i
                  className="absolute inset-0 block"
                  style={{ borderRadius: u(RADIUS), boxShadow: `0 ${u(0.05)} ${u(0.12)} rgb(0 0 0 / 0.18)`, transform: `translateZ(${u(-0.02)})` }}
                />
                {Array.from({ length: SLICES }, (_, k) => (
                  <span
                    key={k}
                    className="absolute block overflow-hidden bg-paper-2"
                    style={{
                      // Only the outer strips round off, so the tile reads as one card with soft corners.
                      borderRadius: k === 0 ? `${u(RADIUS)} 0 0 ${u(RADIUS)}` : k === SLICES - 1 ? `0 ${u(RADIUS)} ${u(RADIUS)} 0` : undefined,
                      // Every strip reaches a pixel past both its neighbours, so no hairline opens between facets.
                      left: `calc(${u((aspectRatio - share) / 2)} - 1px)`,
                      width: `calc(${u(share)} + 2px)`,
                      top: -1,
                      height: `calc(${u(1)} + 2px)`,
                      // A clear pixel round the tile's outer edges. A 3D-turned box's own edges are drawn
                      // unsmoothed and step at every facet, so the visible edge sits inside it instead,
                      // where the browser smooths it like any image edge.
                      borderStyle: "solid",
                      borderColor: "transparent",
                      borderWidth: `1px ${k === SLICES - 1 ? 1 : 0}px 1px ${k === 0 ? 1 : 0}px`,
                      backgroundClip: "padding-box",
                      // The overlap stops short of the top and bottom edges. Where two strips overlap, their
                      // smoothed edge pixels stack and show as a dark tick at every seam.
                      clipPath: `polygon(${EDGE_CLIP})`,
                      transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- one image cut into strips */}
                    <img
                      src={item.src}
                      alt=""
                      draggable={false}
                      className="absolute top-0 max-w-none object-cover object-top"
                      style={{ left: k === 0 ? u(0) : `calc(${u(-k * share)} + 1px)`, width: u(aspectRatio), height: u(1) }}
                    />
                  </span>
                ))}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
