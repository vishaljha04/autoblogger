"use client";

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Globe, Zap, Cpu } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const leftColRef = useRef(null);
    const rightColRef = useRef(null);
    const dividerRef = useRef(null);
    const badgeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.fromTo(headingRef.current, 
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top bottom",
                        end: "top 30%",
                        scrub: 1,
                        // yoyo effect - goes back on scroll up
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            gsap.fromTo(leftColRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: leftColRef.current,
                        start: "top bottom",
                        end: "top 40%",
                        scrub: 1.5,
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            gsap.fromTo(".mission-line",
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".mission-line",
                        start: "top bottom",
                        end: "top 50%",
                        scrub: 2,
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            gsap.fromTo(badgeRef.current,
                { y: 30, opacity: 0, scale: 0.8 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: rightColRef.current,
                        start: "top bottom",
                        end: "top 60%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

            const rightElements = rightColRef.current.querySelectorAll('.anim-right');
            rightElements.forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "top 70%",
                            scrub: 1,
                            toggleActions: "play reverse play reverse",
                        },
                    }
                );
            });

            gsap.to(".badge-ping", {
                scale: 1.5,
                opacity: 0,
                repeat: -1,
                duration: 1.5,
                ease: "power2.out",
                yoyo: true,
            });

            gsap.to(".btn-glow", {
                backgroundPosition: "200% 0",
                repeat: -1,
                duration: 2,
                ease: "linear",
                yoyo: true,
            });

            gsap.fromTo(dividerRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: dividerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.5,
                        toggleActions: "play reverse play reverse",
                    },
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef}>
            <section className="w-full px-6 md:px-10 py-20 bg-transparent transition-colors duration-700">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10 md:mb-20">
                        <h1 
                            ref={headingRef} 
                            className="text-inherit font-bold text-[10vw] md:text-[5vw] leading-[0.9] tracking-tighter"
                            style={{ paddingBottom: '0.05em' }} 
                        >
                            We are Auto<span className="text-neutral-400 font-medium">BloggeR,</span>
                        </h1>
                    </div>

                    <div className="w-full flex flex-col md:flex-row items-start justify-between gap-10 md:gap-20">

                        <div className="w-full md:w-[50%]" ref={leftColRef}>
                            <h2 className="anim-left text-2xl md:text-4xl text-neutral-500 uppercase leading-[1.1] font-medium tracking-tight">
                                A Creative collective made to unlock your brand&apos;s insights through
                                <span className="text-inherit"> generative intelligence</span> and human-centric design.
                            </h2>

                            <div className="anim-left mission-line mt-10 flex items-center gap-2 group cursor-pointer">
                                <div className="h-[1px] w-12 bg-neutral-400 group-hover:w-20 transition-all duration-500" />
                                <span className="uppercase text-sm font-bold tracking-widest">Our Mission</span>
                            </div>
                        </div>

                        <div className="w-full md:w-[35%] flex flex-col gap-6 border-l border-neutral-200 dark:border-neutral-800 pl-8" ref={rightColRef}>

                            <div ref={badgeRef} className="anim-right flex items-center gap-3">
                                <div className="relative flex h-2 w-2">
                                    <span className="badge-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-500">
                                    Now in Early Access
                                </p>
                            </div>

                            <div className="anim-right">
                                <h4 className="text-sm font-bold uppercase tracking-tight text-inherit">
                                    The Future of Automated SEO
                                </h4>
                            </div>

                            <div className="anim-right">
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    AutoBlogger is our first step towards a fully autonomous content ecosystem. We&apos;re currently fine-tuning our proprietary LLM models to ensure your brand&apos;s voice remains authentic at scale.
                                </p>
                            </div>

                            {/* Button */}
                            <div className="anim-right">
                                <button className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-[12px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-neutral-800 active:scale-95 shadow-lg hover:shadow-xl border border-black/10 overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started
                                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                            ↗
                                        </span>
                                    </span>
                                    <div className="btn-glow absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <div ref={dividerRef} className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-300 origin-left" />
        </div>
    );
};

export default Services;