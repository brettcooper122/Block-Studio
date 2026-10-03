import { services } from "../content/services";
import asteriskSvg from "../assets/brand/block-asterisk.svg?raw";
import "./ServicesBackdrop.css";

/**
 * A full-screen, blurred version of each service's badge. Which one shows follows the
 * data-service attribute on <html>, which the services list sets as rows are hovered.
 * It is drawn twice, in the section and in the pinned wordmark band, and both copies are
 * fixed to the viewport so they line up as one background.
 */
export function ServicesBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      {services.map((service, i) => (
        <div className="backdrop__layer" data-badge={i + 1} key={service.href}>
          <div className="backdrop__art">
            <span className="backdrop__glyph" dangerouslySetInnerHTML={{ __html: service.glyph ?? asteriskSvg }} />
          </div>
          <div className="backdrop__scrim" />
        </div>
      ))}
    </div>
  );
}
