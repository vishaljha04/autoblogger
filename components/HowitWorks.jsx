"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Globe, Cpu, CalendarClock, Mail, Share2 } from 'lucide-react';

const HowitWorks = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const steps = [
        {
            number: "01",
            title: "Deep-Web Crawling",
            desc: "Our smart crawler analyzes your product website and competitors' latest strategies to extract real-time market data.",
            icon: <Globe className="w-6 h-6" />,
            color: "bg-blue-100 text-blue-600",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop"
        },
        {
            number: "02",
            title: "Data-Driven Insights",
            desc: "AI transforms raw analytics into high-converting blog topics and content strategies that actually resonate.",
            icon: <Cpu className="w-6 h-6" />,
            color: "bg-purple-100 text-purple-600",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop"
        },
        {
            number: "03",
            title: "AI Generation",
            desc: "Generate human-grade blogs automatically. You control the pace—publish instantly or schedule.",
            icon: <CalendarClock className="w-6 h-6" />,
            color: "bg-emerald-100 text-emerald-600",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop"
        },
        {
            number: "04",
            title: "Smart Newsletters",
            desc: "Automatically sync new blogs with subscribers. Deliver value newsletters without hitting the spam folder.",
            icon: <Mail className="w-6 h-6" />,
            color: "bg-pink-100 text-pink-600",
            image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=500&auto=format&fit=crop"
        },
        {
            number: "05",
            title: "Multi-Channel Socials",
            desc: "Auto-generate viral-ready posts for LinkedIn, Twitter, and Instagram to lead the market conversation.",
            icon: <Share2 className="w-6 h-6" />,
            color: "bg-orange-100 text-orange-600",
            image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=500&auto=format&fit=crop"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="w-full px-6 md:px-10 py-24 bg-transparent">
            <div className="max-w-7xl mx-auto">

                {/* --- Header --- */}
                <div
                    className="mb-20 space-y-4 transition-all duration-700"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="h-[2px] w-10 bg-neutral-800 dark:bg-neutral-200" />
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-neutral-500">
                            The Workflow
                        </p>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-inherit leading-[0.9]">
                        Autopilot your <br />
                        <span className="text-neutral-400">entire marketing.</span>
                    </h2>
                </div>

                {/* --- Steps Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col p-8 rounded-[2.5rem] border text-white border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                                transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s, box-shadow 0.5s, translate 0.5s`,
                            }}
                        >
                            {/* Top row: Icon and Number */}
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-12 h-12 rounded-2xl  flex items-center justify-center`}>
                                    {step.icon}
                                </div>
                                <span className="text-4xl font-black text-neutral-100 dark:text-neutral-800 group-hover:text-neutral-200 dark:group-hover:text-neutral-700 transition-colors">
                                    {step.number}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-4 mb-8 h-full">
                                <h3 className="text-2xl font-bold tracking-tight text-inherit">
                                    {step.title}
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Image Mockup */}
                            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Interactive underline */}
                            <div className="absolute bottom-6 left-8 h-[2px] w-0 bg-black dark:bg-white group-hover:w-12 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowitWorks;