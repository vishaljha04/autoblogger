"use client";

import HeroSection from '@/components/HeroSection'
import Services from '@/components/Services'
import React, { useEffect, useRef } from 'react'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HowitWorks from '@/components/HowitWorks';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: ".services-trigger", 
        start: "top 60%",            
        end: "top 30%",               
        scrub: true,                 
        // markers: true,              
      },
      backgroundColor: "#ffffff",     
      color: "#000000",               
      duration: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className=" transition-colors duration-500 ease-in-out"
    >
      <HeroSection />
      <div className="services-trigger">
        <Services />
      </div>
      <HowitWorks/>
      <div className="h-[50vh]" />
    </main>
  )
}

export default LandingPage