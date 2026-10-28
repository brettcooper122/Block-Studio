import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { readBezier, readNumber, readSeconds } from "../lib/tokens";

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);

/**
 * The first time the footer reaches the screen, the nav words rise out of their masks one
 * after another while the hairlines under them draw left to right, then the studio details
 * and the bottom row lift into place.
 */
export function useFooterMotion() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      const ease = CustomEase.create("footer-arrive", readBezier("--derived-motion-ease"));
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          const q = gsap.utils.selector(footer);
          const words = q(".footer__nav .roll__stack");
          const rules = q(".footer__rule");
          const lifts = q(".footer__label, .footer__lift");

          const duration = reduced
            ? readSeconds("--motion-reduced-duration")
            : readSeconds("--motion-footer-duration");
          const stagger = reduced ? 0 : readSeconds("--motion-footer-stagger");
          const rise = reduced ? 0 : readNumber("--motion-footer-rise");

          // Hidden only once the script is running, so the footer never depends on it.
          // A word starts one line down, below its window, which is half its two-copy stack.
          gsap.set(words, reduced ? { autoAlpha: 0 } : { yPercent: 50 });
          gsap.set(rules, reduced ? { autoAlpha: 0 } : { scaleX: 0, transformOrigin: "left center" });
          gsap.set(lifts, { autoAlpha: 0, y: rise });

          const tl = gsap.timeline({
            paused: true,
            defaults: { duration, ease: reduced ? "none" : ease },
          });

          tl.to(lifts.filter((el) => el.classList.contains("footer__label")), { autoAlpha: 1, y: 0 }, 0)
            // clearProps hands the stack back to the CSS hover roll once it has landed
            .to(words, reduced ? { autoAlpha: 1 } : { yPercent: 0, stagger, clearProps: "transform" }, 0.1)
            .to(
              rules,
              reduced
                ? { autoAlpha: 1 }
                : { scaleX: 1, stagger, duration: readSeconds("--motion-footer-rule-duration") },
              0.1,
            )
            .to(
              lifts.filter((el) => el.classList.contains("footer__lift")),
              { autoAlpha: 1, y: 0, stagger },
              reduced ? 0 : 0.35,
            );

          const trigger = ScrollTrigger.create({
            trigger: footer,
            start: "top 75%",
            once: true,
            onEnter: () => tl.play(),
          });

          return () => {
            trigger.kill();
            tl.kill();
            gsap.set([...words, ...rules, ...lifts], { clearProps: "visibility,opacity,transform" });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: footerRef },
  );

  return { footerRef };
}
