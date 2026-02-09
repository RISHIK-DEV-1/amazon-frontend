import { useEffect, useRef } from "react";
import "./Banner.css";

const images = [
  "/banners/banner1.jpg",
  "/banners/banner2.jpg",
  "/banners/banner3.jpg",
  "/banners/banner4.jpg",
  "/banners/banner5.jpg",
];

function Banner() {
  const trackRef = useRef(null);
  const indexRef = useRef(0);

  // duplicate first image at end
  const slides = [...images, images[0]];

  useEffect(() => {
    const track = trackRef.current;
    const slideWidth = window.innerWidth;

    const interval = setInterval(() => {
      indexRef.current += 1;

      track.style.transition = "transform 0.6s ease-in-out";
      track.style.transform = `translateX(-${indexRef.current * slideWidth}px)`;

      // reached duplicate slide
      if (indexRef.current === images.length) {
        setTimeout(() => {
          track.style.transition = "none";
          track.style.transform = "translateX(0px)";
          indexRef.current = 0;
        }, 600);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="banner">
      <div className="banner-track" ref={trackRef}>
        {slides.map((img, i) => (
          <img key={i} src={img} alt="banner" />
        ))}
      </div>
    </section>
  );
}

export default Banner;
