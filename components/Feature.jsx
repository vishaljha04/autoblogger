"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { Globe2, Languages, ShieldCheck, BarChart3, ArrowUpRight, Sparkles, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const Features = () => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Humne timeline ko 'pause' nahi kiya, ye immediately check karega
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%", // Thoda jaldi start hoga
                    toggleActions: "play none none none",
                }
            });

            tl.from(".anim-header", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            })
            .from(".bento-card", {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all" // Animation khatam hote hi GSAP styles hata dega taaki visibility issue na ho
            }, "-=0.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Layout fix: added min-h to ensure visibility
    const cardStyles = "bento-card group relative overflow-hidden rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 will-change-transform min-h-[200px]";

    return (
        <section 
            ref={containerRef} 
            className="w-full px-6 md:px-10 py-32 bg-transparent opacity-100 visible" // Added explicit visibility
            style={{ minHeight: '100vh' }}
        >
            <div className="max-w-7xl mx-auto">

                {/* --- Header --- */}
                <div className="mb-20 space-y-4">
                    <div className="anim-header flex items-center gap-2">
                        <div className="h-[2px] w-10 bg-current" /> {/* Current color used for line */}
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60">Core Engine</p>
                    </div>
                    <h2 className="anim-header text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] pb-2">
                        Built for <br /> <span className="text-neutral-500">Precision.</span>
                    </h2>
                    <p className="anim-header text-sm opacity-70 max-w-md font-medium leading-relaxed pt-4">
                        Every feature is engineered to remove the friction between data crawling and viral content.
                    </p>
                </div>

                {/* --- Bento Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-5 auto-rows-[200px]">
                    
                    {/* 01: Global SEO */}
                    <div className={`${cardStyles} md:col-span-4 lg:col-span-4 lg:row-span-2 p-10`}>
                        <div className="z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Globe2 size={24} />
                                </div>
                                <span className="text-6xl font-black opacity-10 transition-colors group-hover:opacity-20">01</span>
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4">Global SEO 2.0 <br />Optimization</h3>
                            <p className="opacity-60 max-w-sm text-sm">Auto-inject semantic keywords and schema markup based on real-time search trends.</p>
                        </div>
                        <div className="absolute bottom-[-30px] right-[-30px] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none z-0">
                            <Globe2 size={280} strokeWidth={0.8} />
                        </div>
                    </div>

                    {/* 02: Languages */}
                    <div className={`${cardStyles} md:col-span-2 lg:col-span-2`}>
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center"><Languages size={18} /></div>
                            <span className="text-3xl font-black opacity-10">02</span>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold tracking-tight">50+ Languages</h4>
                            <p className="text-xs opacity-60 mt-1">Localize perfectly for any market.</p>
                        </div>
                    </div>

                    {/* 03: Plagiarism */}
                    <div className={`${cardStyles} md:col-span-2 lg:col-span-2`}>
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center"><ShieldCheck size={18} /></div>
                            <span className="text-3xl font-black opacity-10">03</span>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold tracking-tight">Plagiarism Free</h4>
                            <p className="text-xs opacity-60 mt-1">100% original content guaranteed.</p>
                        </div>
                    </div>

                    {/* 04: AI Tone */}
                    <div className={`${cardStyles} md:col-span-2 lg:col-span-3`}>
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center"><Sparkles size={18} /></div>
                            <span className="text-3xl font-black opacity-10">04</span>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold tracking-tight">AI-Powered Tone</h4>
                            <p className="text-xs opacity-60 mt-1">Maintains your unique brand voice.</p>
                        </div>
                    </div>

                    {/* 05: Auto Publish */}
                    <div className={`${cardStyles} md:col-span-2 lg:col-span-3`}>
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-pink-500/10 text-pink-600 rounded-xl flex items-center justify-center"><Rocket size={18} /></div>
                            <span className="text-3xl font-black opacity-10">05</span>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xl font-bold tracking-tight">Auto Publish</h4>
                            <p className="text-xs opacity-60 mt-1">Instant sync across all platforms.</p>
                        </div>
                    </div>

                    {/* 06: Analytics Dashboard (Inverted for impact) */}
                    <div className="bento-card group md:col-span-4 lg:col-span-6 lg:row-span-2 relative rounded-[2.5rem] border border-neutral-800 bg-neutral-950 text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between overflow-hidden hover:shadow-2xl transition-all duration-500 min-h-[300px]">
                        <div className="z-10 space-y-6 md:max-w-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><BarChart3 size={18} /></div>
                                <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">Insights Dashboard</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9]">Real-time Analytics <br />& Performance</h3>
                            <p className="opacity-50 text-sm max-w-sm">Monitor growth, crawl depth, and conversion rates in one place.</p>
                            <button className="flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                                View Demo <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <div className="relative w-full md:w-1/3 h-48 md:h-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                            <div className="absolute w-40 h-40 rounded-full border border-white/20 animate-pulse" />
                            <BarChart3 size={100} strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;