import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { readBezier, readNumber, readSeconds } from "../lib/tokens";

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);

/** The label and each service row rise into view the first time they reach the screen. */
export function useServicesMotion() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const ease = CustomEase.create("services-arrive", readBezier("--derived-motion-ease"));
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          const targets = gsap.utils.toArray<HTMLElement>(
            ".services__label-row, .services__row",
            section,
          );

          const rise = reduced ? 0 : readNumber("--motion-services-rise");
          const duration = reduced
            ? readSeconds("--motion-reduced-duration")
            : readSeconds("--motion-services-duration");
          const stagger = readSeconds("--motion-services-stagger");

          // Hidden only once the script is running, so the list never depends on it
          gsap.set(targets, { autoAlpha: 0, y: rise });

          ScrollTrigger.batch(targets, {
            start: "top 90%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration,
                stagger,
                ease: reduced ? "none" : ease,
                overwrite: true,
              }),
          });

          return () => gsap.set(targets, { clearProps: "visibility,opacity,transform" });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return { sectionRef };
}
