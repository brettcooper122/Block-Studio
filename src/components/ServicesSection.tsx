import { services } from "../content/services";
import asteriskSvg from "../assets/brand/block-asterisk.svg?raw";
import { useServicesMotion } from "./useServicesMotion";
import "./ServicesSection.css";

export function ServicesSection() {
  const { sectionRef } = useServicesMotion();

  return (
    <section className="services" id="services" ref={sectionRef} aria-labelledby="services-label">
      <div className="services__wash" aria-hidden="true" />

      <div className="services__container">
        <div className="services__label-row">
          <h2 className="services__label text-subtext" id="services-label">
            Services
          </h2>
        </div>

        <ul className="services__list">
          {services.map((service) => (
            <li className="services__row" key={service.href}>
              <a className="services__item" href={service.href}>
                <span className="services__number text-label">{service.number}</span>
                <span className="services__title text-h3">{service.title}</span>
                <span className="services__summary text-body-small">{service.summary}</span>
                <span
                  className="services__disc"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: asteriskSvg }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
