import type { MouseEvent } from "react";
import { footerNav, footerSocials, studio } from "../content/footer";
import { RollText } from "./RollText";
import { useFooterMotion } from "./useFooterMotion";
import { useLocalTime } from "./useLocalTime";
import wordmarkSvg from "../assets/brand/block-wordmark.svg?raw";
import "./Footer.css";

function backToTop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export function Footer() {
  const { footerRef } = useFooterMotion();
  const clock = useLocalTime(studio.timeZone);

  return (
    <footer className="footer" id="contact" ref={footerRef} data-wordmark-shrink>
      <div className="footer__main">
        <nav className="footer__nav" aria-labelledby="footer-nav-label">
          {/* Same label as © SERVICES */}
          <p className="footer__label footer__label--mark text-label" id="footer-nav-label">
            <span aria-hidden="true">©</span>
            <span>NAVIGATION</span>
          </p>
          <ul className="footer__nav-list">
            {footerNav.map((item) => (
              <li className="footer__nav-row" key={item.href}>
                <a className="footer__nav-link roll-trigger" href={item.href}>
                  <RollText className="text-h2">{item.label}</RollText>
                </a>
                <span className="footer__rule" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__details">
          <p className="footer__label footer__label--caps text-subtext">(Studio details)</p>

          <ul className="footer__socials">
            {footerSocials.map((social) => (
              <li className="footer__lift" key={social.label}>
                <a
                  className="footer__social roll-trigger"
                  href={social.href}
                  {...(social.href !== "#" && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <RollText className="text-h5">
                    {social.label}
                    <span className="footer__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </RollText>
                </a>
              </li>
            ))}
          </ul>

          <p className="footer__location footer__lift text-body-small">
            {studio.location.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          <a className="footer__email footer__lift roll-trigger" href={studio.emailHref}>
            <RollText className="text-body-small">
              <span aria-hidden="true">↳ </span>
              <span className="footer__email-address">{studio.email}</span>
            </RollText>
          </a>
        </div>
      </div>

      <div className="footer__meta text-body-small">
        <p className="footer__clock footer__lift">
          <span>
            {studio.city} <time dateTime={clock.iso}>{clock.time}</time>
          </span>
          <span>
            {clock.date} ({clock.offset})
          </span>
        </p>

        <div className="footer__meta-end">
          <a className="footer__top footer__lift roll-trigger" href="#top" onClick={backToTop}>
            <RollText className="text-body-small">
              Back to top <span aria-hidden="true">↑</span>
            </RollText>
          </a>

          <p className="footer__copyright footer__lift">
            ©{new Date().getFullYear()} {studio.name}
          </p>
        </div>
      </div>

      {/* Mount point for the cursor-reactive WebGL piece. Empty until that ships. */}
      <div className="footer__canvas">
        <div className="footer__canvas-mount" data-footer-canvas />
        <div
          className="footer__wordmark"
          role="img"
          aria-label={studio.name}
          dangerouslySetInnerHTML={{ __html: wordmarkSvg }}
        />
      </div>
    </footer>
  );
}
