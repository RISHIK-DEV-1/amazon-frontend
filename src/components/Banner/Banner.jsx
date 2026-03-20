import { useEffect, useRef } from "react";
import "./Banner.css";

const images = [
  "https://assets.aboutamazon.com/dims4/default/74acd11/2147483647/strip/true/crop/1279x720+0+0/resize/768x432!/format/webp/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2Fe9%2F9f%2F7bf86c7a4dd9ba2211cccbbd9789%2Fabout-agif-blog-lead-banner-1.jpg",
  "https://sm.ign.com/t/ign_in/screenshot/default/prime-cover_fu3a.2560.png",
  "https://assets.aboutamazon.com/dims4/default/1bd69e4/2147483647/strip/true/crop/1277x720+1+0/resize/1320x744!/format/webp/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2Fbb%2F2a%2F872ae6d643099d6590b7758defa3%2Fliveblog.jpg",
  "https://images.moneycontrol.com/static-mcnews/2019/09/Amazon-Flipkart-770x433.png?impolicy=website&width=770&height=431",
  "https://inc42.com/cdn-cgi/image/quality=90/https://asset.inc42.com/2022/09/Festive-season_Social-Image.jpeg",
];

function Banner() {
  const trackRef = useRef(null);
  const indexRef = useRef(0);

  const slides = [...images, images[0]];

  useEffect(() => {
    const track = trackRef.current;
    const slideWidth = window.innerWidth;

    const interval = setInterval(() => {
      indexRef.current += 1;

      track.style.transition = "transform 0.6s ease-in-out";
      track.style.transform = `translateX(-${indexRef.current * slideWidth}px)`;

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
