import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <div className='w-full px-10 py-5  h-[88px]'>
            <div className='flex items-center justify-between'>

                <div className={`flex items-center gap-2 `}>

                    <div className="w-5 h-5 bg-white rounded-sm rotate-45" />

                    <p className="text-xl sm:text-2xl tracking-tighter antialiased">
                        <span className="font-bold text-foreground">auto</span>
                        <span className="font-light text-neutral-600">blogger</span>
                    </p>
                </div>

                <ul className='flex items-center justify-center gap-6 text-[16px] uppercase'>
                    <Link href={'/'}>
                        <span>Home</span>
                    </Link>
                    <Link href={'/'}>
                        <span>Docs</span>
                    </Link>
                    <Link href={'/'}>
                        <span>API</span>
                    </Link>
                    <Link href={'/'}>
                        <span>Code</span>
                    </Link>
                </ul>

                <div className='h-10 rounded-full w-10 bg-foreground' >

                </div>
            </div>
        </div>
    )
}

export default Navbar
