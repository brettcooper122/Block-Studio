import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { readBezier, readColor, readNumber, readSeconds } from "../lib/tokens";

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger, SplitText);

/**
 * Six moves for the hero, all timed from tokens:
 *  - the emblem and then the headline rise into view line by line, and the wordmark letter by letter, each line clipped by its own mask
 *  - the wordmark travels left as the page scrolls, and eases back as it scrolls up
 *  - the statement scrolls at 120% of the page and fades as it climbs out of view
 *  - the wordmark stays fixed to the top of the viewport once it reaches it
 *  - the hero background fades from orange to charcoal across its scroll
 *  - the asterisk turns clockwise forever, faster the faster the page scrolls, in either direction
 */
export function useHeroMotion() {
  const heroRef = useRef<HTMLElement>(null);
  const wordmarkSlotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const wordmarkSlot = wordmarkSlotRef.current;
      const content = contentRef.current;
      const eyebrow = eyebrowRef.current;
      const headline = headlineRef.current;
      const wordmark = wordmarkRef.current;
      const track = trackRef.current;
      if (!hero || !wordmarkSlot || !content || !eyebrow || !headline || !wordmark || !track) return;

      const ease = CustomEase.create("hero-arrive", readBezier("--derived-motion-ease"));
      const travelEase = CustomEase.create("hero-travel", readBezier("--motion-wordmark-ease"));
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          // Hidden until the fonts are in, so lines break once and never reflow mid-entrance
          gsap.set(headline, { autoAlpha: 0 });
          gsap.set(eyebrow, reduced ? { autoAlpha: 0 } : { yPercent: readNumber("--motion-headline-travel") });
          let split: SplitText | undefined;
          let cancelled = false;

          document.fonts.ready.then(() => {
            if (cancelled) return;

            if (reduced) {
              gsap.to([eyebrow, headline], {
                autoAlpha: 1,
                duration: readSeconds("--motion-reduced-duration"),
                ease: "none",
              });
              return;
            }

            // The emblem is the first line of the entrance, and the headline lines follow it
            const entranceDelay = readSeconds("--motion-headline-delay");
            const lineStagger = readSeconds("--motion-headline-line-stagger");
            gsap.to(eyebrow, {
              yPercent: 0,
              duration: readSeconds("--motion-headline-duration"),
              delay: entranceDelay,
              ease,
            });

            split = SplitText.create(headline, {
              type: "lines,words",
              mask: "lines",
              linesClass: "hero__line",
              wordsClass: "hero__word",
              autoSplit: true,
              onSplit(self) {
                // The first-line indent moves from the heading onto the first line itself
                self.lines[0]?.classList.add("hero__line--indent");
                gsap.set(headline, { autoAlpha: 1 });

                const tl = gsap.timeline({ delay: entranceDelay + lineStagger });
                self.lines.forEach((line, i) => {
                  tl.from(
                    self.words.filter((word) => line.contains(word)),
                    {
                      yPercent: readNumber("--motion-headline-travel"),
                      duration: readSeconds("--motion-headline-duration"),
                      stagger: readSeconds("--motion-headline-word-stagger"),
                      ease,
                    },
                    i * lineStagger,
                  );
                });
                return tl;
              },
            });
          });

          // The wordmark letters arrive one at a time, each rising from below the graphic's edge,
          // which clips them. The asterisk counts as a letter.
          const letters = gsap.utils.toArray<SVGPathElement>("path", track);
          const wordmarkSvg = track.querySelector("svg");
          const letterTravel = wordmarkSvg ? wordmarkSvg.viewBox.baseVal.height : 0;
          gsap.set(letters, reduced ? { autoAlpha: 0 } : { y: letterTravel });
          gsap.to(letters, {
            ...(reduced ? { autoAlpha: 1 } : { y: 0 }),
            duration: reduced
              ? readSeconds("--motion-reduced-duration")
              : readSeconds("--motion-headline-duration"),
            delay: readSeconds("--motion-headline-delay"),
            stagger: reduced ? 0 : readSeconds("--motion-wordmark-letter-stagger"),
            ease: reduced ? "none" : ease,
          });

          // Colour changes finish after a set share of a screen's height has been scrolled
          const colourRange = {
            trigger: hero,
            start: "top top",
            end: () => `+=${readNumber("--motion-background-complete") * window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          };

          // Orange fades to charcoal in step with the scroll and lands once that share is scrolled.
          // A colour change carries no movement, so it stays on with reduced motion too.
          gsap.to(hero, {
            backgroundColor: readColor("--hero-bg-scrolled"),
            ease: "none",
            scrollTrigger: colourRange,
          });

          // The wordmark stays put when motion is reduced
          if (!reduced) {
            gsap.to(track, {
              x: () => {
                const inset = readNumber("--hero-wordmark-inset");
                return -(track.offsetLeft + track.offsetWidth - (hero.clientWidth - inset));
              },
              ease: travelEase,
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: readSeconds("--motion-wordmark-smoothing"),
                invalidateOnRefresh: true,
              },
            });
          }

          // The statement scrolls at 120% of the page, so it climbs out of view faster than the page
          if (!reduced) {
            gsap.to(content, {
              y: () => -(readNumber("--motion-statement-speed") - 1) * hero.offsetHeight,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          }

          // The statement fades as it climbs, and is gone as it leaves the top of the screen.
          // A fade carries no movement, so it stays on with reduced motion too.
          gsap.to(content, {
            opacity: readNumber("--motion-statement-fade-to"),
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () => {
                const rate = reduced ? 1 : readNumber("--motion-statement-speed");
                return `+=${(content.offsetTop + content.offsetHeight) / rate}`;
              },
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // The wordmark rides the foot of the hero, then stays fixed to the top of the viewport
          // once it gets there, for the sections that follow
          const holdSpace = new ResizeObserver(() => {
            wordmarkSlot.style.minHeight = `${wordmark.offsetHeight}px`;
          });
          holdSpace.observe(wordmark);

          const pinned = "hero__wordmark--pinned";
          const pinPoint = () => wordmarkSlot.offsetTop;
          const syncPin = (self: ScrollTrigger) =>
            wordmark.classList.toggle(pinned, self.scroll() >= pinPoint());
          const pin = ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: syncPin,
            onRefresh: syncPin,
          });

          // The asterisk turns for as long as the hero is on screen
          let stopSpin: (() => void) | undefined;
          const asterisk = track.querySelector(".wordmark__asterisk");

          // The asterisk turns white as the background darkens, on the same range
          if (asterisk) {
            gsap.to(asterisk, {
              fill: readColor("--hero-wordmark-asterisk-scrolled"),
              ease: "none",
              scrollTrigger: colourRange,
            });
          }

          if (!reduced && asterisk) {
            const spin = gsap.to(asterisk, {
              rotation: 360,
              transformOrigin: "50% 50%",
              duration: readSeconds("--motion-glyph-period"),
              ease: "none",
              repeat: -1,
            });
            const sensitivity = readNumber("--motion-glyph-sensitivity");
            const maxBoost = readNumber("--motion-glyph-max-boost");
            const response = readSeconds("--motion-glyph-response") * 1000;
            let lastY = window.scrollY;
            let speed = 1;
            const follow = (_time: number, delta: number) => {
              const y = window.scrollY;
              const scrollSpeed = Math.abs(y - lastY) / Math.max(delta / 1000, 0.001);
              lastY = y;
              const target = 1 + Math.min(scrollSpeed / sensitivity, maxBoost);
              speed += (target - speed) * (1 - Math.exp(-delta / response));
              spin.timeScale(speed);
            };
            gsap.ticker.add(follow);
            const visibility = ScrollTrigger.create({
              trigger: hero,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => (self.isActive ? spin.resume() : spin.pause()),
            });
            stopSpin = () => {
              gsap.ticker.remove(follow);
              visibility.kill();
            };
          }

          return () => {
            stopSpin?.();
            pin.kill();
            holdSpace.disconnect();
            wordmark.classList.remove(pinned);
            wordmarkSlot.style.minHeight = "";
            cancelled = true;
            split?.revert();
            gsap.set(letters, { clearProps: "visibility,opacity" });
            gsap.set([eyebrow, headline], { clearProps: "visibility,opacity,transform" });
            gsap.set(content, { clearProps: "opacity" });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return { heroRef, wordmarkSlotRef, contentRef, eyebrowRef, headlineRef, wordmarkRef, trackRef };
}
