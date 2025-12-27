"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { BookDemoModal } from '@/components/book-demo-modal';

export function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                        DailyFit
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        About
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Blog
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Pricing
                    </Link>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button className="bg-white hover:bg-gray-200 text-black font-bold rounded-full px-6 h-10 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                            Start 7-Day Free Trial
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-[#0F0F0F] border border-white/10 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top-4 shadow-2xl z-50">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">Home</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">About</Link>
                    <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">Blog</Link>
                    <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">Pricing</Link>
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                Start 7-Day Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
