import { NavItem } from "./NavItem";
import { useHeroMotion } from "./useHeroMotion";
import stickerUrl from "../assets/brand/block-sticker.svg";
import wordmarkSvg from "../assets/brand/block-wordmark.svg?raw";
import "./Hero.css";

export function Hero() {
  const { heroRef, contentRef, headlineRef, wordmarkRef } = useHeroMotion();

  return (
    <section className="hero" ref={heroRef}>
      <header className="hero__nav">
        <a className="hero__logo" href="#top" aria-label="Block Studio home">
          <img className="hero__logo-img" src={stickerUrl} alt="" />
        </a>
        <nav aria-label="Primary" className="hero__links">
          <NavItem href="#works">Works</NavItem>
          <NavItem href="#about">About</NavItem>
          <NavItem href="#contact">Contact</NavItem>
        </nav>
      </header>

      <div className="hero__content" ref={contentRef}>
        <p className="hero__eyebrow text-label">
          <span aria-hidden="true">©</span> BLOCK STUDIO
        </p>
        <h1 className="hero__headline text-h2" ref={headlineRef}>
          We are a Toronto-based AI-native creative consulting studio, enabling B2B/B2C startup
          founders and growth-stage agencies to{" "}
          <span className="hero__accent text-h2-serif">
            identify the right problems before investing build cycles crafting the wrong solutions,
          </span>{" "}
          pairing velocity with analytics to ship at warp-speed.
        </h1>
      </div>

      <div
        className="hero__wordmark"
        ref={wordmarkRef}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: wordmarkSvg }}
      />
    </section>
  );
}
