import { useEffect } from "react";
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

        <ul className="services__list" onMouseLeave={() => showBadge(null)}>
          {services.map((service, i) => (
            <li className="services__row" data-badge={i + 1} key={service.href}>
              <a
                className="services__item"
                href={service.href}
                onMouseEnter={() => showBadge(i + 1)}
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && showBadge(i + 1)}
                onBlur={() => showBadge(null)}
              >
                <span className="services__number text-label">{service.number}</span>
                <span className="services__title text-h3">{service.title}</span>
                <span className="services__summary text-body-small">{service.summary}</span>
                <span
                  className={`services__disc${service.glyph ? " services__disc--glyph" : ""}`}
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: service.glyph ?? asteriskSvg }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
