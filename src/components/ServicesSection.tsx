import { useEffect, useRef } from "react";
import { services } from "../content/services";
import asteriskSvg from "../assets/brand/block-asterisk.svg?raw";
import { ServicesBackdrop } from "./ServicesBackdrop";
import { useServicesMotion } from "./useServicesMotion";
import "./ServicesSection.css";

/** Tells the backdrop, in the section and in the wordmark band, which badge to show. */
function showBadge(index: number | null) {
  const root = document.documentElement;
  if (index === null) delete root.dataset.service;
  else root.dataset.service = String(index);
}

export function ServicesSection() {
  const { sectionRef } = useServicesMotion();
  // Each badge's diagram is its own page in an iframe, which cannot see the row's hover, so the
  // row passes it in: the hovered row's diagram is held at its point, and the others let go.
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);

  const hover = (index: number | null) => {
    showBadge(index === null ? null : index + 1);
    frames.current.forEach((frame, i) => {
      const diagram = services[i].diagram;
      if (!frame?.contentWindow || !diagram) return;
      frame.contentWindow.postMessage(i === index ? { hairline: "enter", at: diagram.at } : { hairline: "leave" }, location.origin);
    });
  };

  useEffect(() => () => showBadge(null), []);

  return (
    <section className="services" id="services" ref={sectionRef} aria-labelledby="services-label">
      <ServicesBackdrop />

      <div className="services__container">
        <div className="services__label-row">
          <h2 className="services__label text-label" id="services-label">
            <span aria-hidden="true">©</span>
            <span>SERVICES</span>
          </h2>
        </div>

        <ul className="services__list" onMouseLeave={() => hover(null)}>
          {services.map((service, i) => (
            <li className="services__row" data-badge={i + 1} key={service.href}>
              <a
                className="services__item"
                href={service.href}
                onMouseEnter={() => hover(i)}
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && hover(i)}
                onBlur={() => hover(null)}
              >
                <span className="services__number text-label">{service.number}</span>
                <span className="services__title text-h3">{service.title}</span>
                <span className="services__summary text-body-small">{service.summary}</span>
              </a>
              {/* The badge sits beside the link, not in it: a link cannot hold an iframe */}
              {service.diagram ? (
                <span className="services__disc services__disc--diagram" aria-hidden="true">
                  <iframe
                    className="services__diagram"
                    ref={(el) => {
                      frames.current[i] = el;
                    }}
                    src={`${service.diagram.src}?bg=none&pad=0.84`}
                    title={`${service.title} diagram`}
                    tabIndex={-1}
                    loading="lazy"
                  />
                </span>
              ) : (
                <span
                  className={`services__disc${service.glyph ? " services__disc--glyph" : ""}`}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: service.glyph ?? asteriskSvg }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
