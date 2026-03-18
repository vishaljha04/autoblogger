import React from 'react'
import { ArrowUpRight, Globe, Zap, Cpu } from 'lucide-react'

const Services = () => {
    return (
        <>
            <section className="w-full px-6 md:px-10 py-20 bg-transparent transition-colors duration-700">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10 md:mb-20">
                        <h1 className="text-inherit font-bold text-[10vw] md:text-[5vw] leading-[0.9] tracking-tighter">
                            We are Auto<span className="text-neutral-400 font-medium">BloggeR,</span>
                        </h1>
                    </div>

                    <div className='w-full flex flex-col md:flex-row items-start justify-between gap-10 md:gap-20'>

                        <div className='w-full md:w-[50%]'>
                            <h2 className="text-2xl md:text-4xl text-neutral-500 uppercase leading-[1.1] font-medium tracking-tight">
                                A Creative collective made to unlock your brand's insights through
                                <span className="text-inherit"> generative intelligence</span> and human-centric design.
                            </h2>

                            <div className="mt-10 flex items-center gap-2 group cursor-pointer">
                                <div className="h-[1px] w-12 bg-neutral-400 group-hover:w-20 transition-all duration-500" />
                                <span className="uppercase text-sm font-bold tracking-widest">Our Mission</span>
                            </div>
                        </div>

                        <div className='w-full md:w-[35%] flex flex-col gap-6 border-l border-neutral-200 dark:border-neutral-800 pl-8'>
                            {/* Product Status Badge */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-500">
                                    Now in Early Access
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-tight text-inherit">
                                    The Future of Automated SEO
                                </h4>

                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    AutoBlogger is our first step towards a fully autonomous content ecosystem. We're currently fine-tuning our proprietary LLM models to ensure your brand's voice remains authentic at scale.
                                </p>

                                <div className="space-y-3">


                                    <button className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-[12px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-neutral-800 active:scale-95 shadow-lg hover:shadow-xl border border-black/10 overflow-hidden">

                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Started
                                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                                                ↗
                                            </span>
                                        </span>


                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>



            </section>
            <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-300" />
        </>
    )
}

export default Services