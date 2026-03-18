"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const h1Ref1 = useRef(null);
  const h1Ref2 = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();


    const introTl = gsap.timeline();
    introTl
      .fromTo(
        [h1Ref1.current, h1Ref2.current],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
      )
      .fromTo(
        videoRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
        "-=0.6"
      );


    mm.add("(min-width: 1024px)", () => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1.5,
          pin: true,
        },
      });

      scrollTl
        .to(h1Ref1.current, { x: -80, ease: "power2.inOut" }, "sync")
        .to(h1Ref2.current, { x: 80, ease: "power2.inOut" }, "sync")
        .to(videoRef.current, { scale: 1.15, y: -20, ease: "power2.inOut" }, "sync");

      return () => {
        if (ScrollTrigger.getById("mainPin")) ScrollTrigger.getById("mainPin").kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center py-12 md:py-[5vw] overflow-hidden "
    >
      <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-10 z-10">

        <div className="flex flex-col space-y-2 md:space-y-0">
          <h1
            ref={h1Ref1}
            className="text-[13vw] sm:text-[11vw] md:text-[8vw] font-bold tracking-tighter leading-[0.9] text-neutral-900 dark:text-neutral-100 text-left md:ml-[5vw]"
          >
            Digitally crafted
          </h1>

          <h1
            ref={h1Ref2}
            className="text-[13vw] sm:text-[11vw] md:text-[8vw] font-bold tracking-tighter leading-[0.9] text-neutral-400 text-right md:text-left md:ml-[25vw]"
          >
            blogs experiences
          </h1>
        </div>

        <div className="relative mt-12 md:mt-[15vh] flex justify-center z-20">
          <video
            ref={videoRef}
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full md:w-[85%] aspect-video object-cover rounded-[1.25rem] md:rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;