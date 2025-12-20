"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Dumbbell } from 'lucide-react';
import { useState } from 'react';

export function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        DailyFit AI
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        About
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Pricing
                    </Link>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/pricing">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/20">
                            Start Free Trial
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
                <div className="md:hidden bg-background border-b border-white/10 p-4 space-y-4 animate-in slide-in-from-top-4">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">Home</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">About</Link>
                    <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-white">Pricing</Link>
                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-center text-sm font-medium text-gray-300">Login</Link>
                        <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
