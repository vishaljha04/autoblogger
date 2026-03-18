"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const h1Ref1 = useRef(null);
  const h1Ref2 = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {

    const introTl = gsap.timeline();

    introTl
      .fromTo(
        [h1Ref1.current, h1Ref2.current],
        { y: 50, opacity: 0, x: -20 },
        { y: 0, opacity: 1, x: 0, duration: 1.2, stagger: 0.2, ease: "power4.out" }
      )
      .fromTo(
        videoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" },
        "-=0.8"
      );


    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=120%",
        scrub: 1.5,
        pin: true,
      },
    });

    scrollTl
      .to(textContainerRef.current, {
        z: -600,
        opacity: 0,
        scale: 0.8,
        ease: "power2.inOut",
      }, "sync")


      .to(videoRef.current, {
        scale: 1.2,
        y: -20,
        ease: "power2.inOut",
      }, "sync");

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center py-[10vw] overflow-hidden bg-white dark:bg-neutral-950"
      style={{ perspective: "1200px" }}
    >
      <div className="container mx-auto px-4 z-10">

        <div ref={textContainerRef} className="will-change-transform">
          <h1
            ref={h1Ref1}
            className="text-[8vw] font-medium tracking-tighter leading-[0.85] ml-[5vw] md:ml-[10vw] text-neutral-900 dark:text-neutral-100"
          >
            Digitally crafted
          </h1>

          <h1
            ref={h1Ref2}
            className="text-[8vw] font-medium tracking-tighter leading-[0.85] ml-[15vw] md:ml-[33vw] text-neutral-400"
          >
            blogs experiences
          </h1>
        </div>

        <div className="relative mt-[10vh] flex justify-center z-20">
          <video
            ref={videoRef}
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full md:w-[85%] rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 will-change-transform"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;