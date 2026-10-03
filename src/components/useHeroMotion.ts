import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { readBezier, readColor, readNumber, readSeconds } from "../lib/tokens";

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger, SplitText);

/**
 * Five moves for the hero, all timed from tokens:
 *  - the headline rises into view line by line, each line clipped by its own mask
 *  - the wordmark travels left as the page scrolls, and eases back as it scrolls up
 *  - the statement scrolls at 120% of the page, so it climbs away faster and settles back at the top
 *  - the hero background fades from orange to charcoal across its scroll
 *  - the asterisk turns clockwise forever, faster the faster the page scrolls, in either direction
 */
export function useHeroMotion() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const content = contentRef.current;
      const headline = headlineRef.current;
      const wordmark = wordmarkRef.current;
      if (!hero || !content || !headline || !wordmark) return;

      const ease = CustomEase.create("hero-arrive", readBezier("--derived-motion-ease"));
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
          let split: SplitText | undefined;
          let cancelled = false;

          document.fonts.ready.then(() => {
            if (cancelled) return;

            if (reduced) {
              gsap.to(headline, {
                autoAlpha: 1,
                duration: readSeconds("--motion-reduced-duration"),
                ease: "none",
              });
              return;
            }

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

                const lineStagger = readSeconds("--motion-headline-line-stagger");
                const tl = gsap.timeline({ delay: readSeconds("--motion-headline-delay") });
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

          // Orange fades to charcoal in step with the scroll and lands only once the hero has left.
          // A colour change carries no movement, so it stays on with reduced motion too.
          gsap.to(hero, {
            backgroundColor: readColor("--hero-bg-scrolled"),
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          // The wordmark stays put when motion is reduced
          if (!reduced) {
            gsap.to(wordmark, {
              x: () => {
                const inset = parseFloat(getComputedStyle(wordmark).marginLeft);
                return -(wordmark.offsetLeft + wordmark.offsetWidth - (hero.clientWidth - inset));
              },
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: readSeconds("--motion-wordmark-smoothing"),
                invalidateOnRefresh: true,
              },
            });
          }

          if (!reduced) {
            // 120% scroll speed: the extra 20% is a rise of 0.2 times the distance scrolled
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

          // The asterisk turns for as long as the hero is on screen
          let stopSpin: (() => void) | undefined;
          const asterisk = wordmark.querySelector(".wordmark__asterisk");
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
            cancelled = true;
            split?.revert();
            gsap.set(headline, { clearProps: "visibility,opacity" });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return { heroRef, contentRef, headlineRef, wordmarkRef };
}
