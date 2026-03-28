"use client";

import HeroSection from '@/components/HeroSection'
import Services from '@/components/Services'
import React, { useLayoutEffect, useRef } from 'react'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HowitWorks from '@/components/HowitWorks';
import Features from '@/components/Feature';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // TRIGGER 1: Switch to Light Mode (Services & HowItWorks)
      ScrollTrigger.create({
        trigger: ".services-trigger",
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#ffffff", color: "#000000", duration: 0.8 });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#0F0D0D", color: "#ffffff", duration: 0.8 });
        }
      });

      // TRIGGER 2: Switch back to Dark Mode (Features)
      ScrollTrigger.create({
        trigger: ".feature-trigger",
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          gsap.to(containerRef.current, { backgroundColor: "#0F0D0D", color: "#ffffff", duration: 0.8 });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, { backgroundColor: "#ffffff", color: "#000000", duration: 0.8 });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="bg-[#0F0D0D] text-white transition-colors duration-300"
    >
      <HeroSection />
      
      {/* Humne div structure ko clear kar diya hai */}
      <section className="services-trigger">
        <Services />
        <HowitWorks />
      </section>

      <section className="feature-trigger">
        <Features />
      </section>
      
      <div className="h-[20vh]" />
    </main>
  )
}

export default LandingPage