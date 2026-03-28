"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; 

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/' },
        { name: 'API', href: '/' },
        { name: 'Code', href: '/' },
    ];

    return (
        <nav className='w-full px-6 md:px-10 py-5 h-[88px] relative z-[100]'>
            <div className='flex items-center justify-between max-w-7xl mx-auto'>
                
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-5 h-5 bg-black dark:bg-white rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                    <p className="text-xl sm:text-2xl tracking-tighter antialiased">
                        <span className="font-bold text-foreground">auto</span>
                        <span className="font-light text-neutral-500">blogger</span>
                    </p>
                </Link>

                <ul className='hidden md:flex items-center gap-8 text-[14px] font-medium uppercase tracking-widest'>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-neutral-600 hover:text-black dark:hover:text-white transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </ul>


                <div className='flex items-center gap-4'>
                    <div className='h-7 rounded-full w-7 bg-black dark:bg-white border border-neutral-200 hidden sm:block overflow-hidden'>
                        {/* User Image Here */}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className='md:hidden p-2 text-foreground'
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            <div className={`
                fixed inset-0 bg-white dark:bg-neutral-950 z-[90] flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden
                ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
            `}>
                {navLinks.map((link) => (
                    <Link 
                        key={link.name} 
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-bold tracking-tighter uppercase"
                    >
                        {link.name}
                    </Link>
                ))}
           
                <div className='h-12 w-12 rounded-full bg-black dark:bg-white mt-4' />
            </div>
        </nav>
    )
}

export default Navbar;