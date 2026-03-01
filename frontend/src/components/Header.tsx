import { useState } from 'react';
import { Menu, X, GraduationCap, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'students', label: 'Students' },
    { id: 'notices', label: 'Notice Board' },
    { id: 'exams', label: 'Exam Schedule' },
    { id: 'advertisements', label: 'Advertisements', icon: <Megaphone className="w-3.5 h-3.5" /> },
];

export default function Header({ activePage, onNavigate }: HeaderProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNav = (page: string) => {
        onNavigate(page);
        setMobileOpen(false);
    };

    return (
        <header className="bg-maroon-600 text-primary-foreground shadow-lg sticky top-0 z-50">
            {/* Top bar */}
            <div className="bg-maroon-800 py-1 px-4 text-center text-xs tracking-widest font-sans text-gold-300 uppercase">
                Jawahar Navodaya Vidyalaya — Excellence in Education
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Logo + Title */}
                <button
                    onClick={() => handleNav('home')}
                    className="flex items-center gap-3 group focus:outline-none"
                    aria-label="Go to Home"
                >
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <img
                            src="/assets/generated/navodaya-emblem.dim_128x128.png"
                            alt="Navodaya Emblem"
                            className="w-12 h-12 rounded-full object-cover border-2 border-gold-400 shadow-md"
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                            }}
                        />
                        <div
                            className="w-12 h-12 rounded-full bg-gold-400 items-center justify-center hidden border-2 border-gold-300"
                            aria-hidden="true"
                        >
                            <GraduationCap className="w-6 h-6 text-maroon-700" />
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="font-serif font-bold text-lg leading-tight text-gold-300 group-hover:text-gold-200 transition-colors">
                            Suraj Navodaya App
                        </div>
                        <div className="text-xs text-primary-foreground/70 font-sans tracking-wide">
                            Student Information System
                        </div>
                    </div>
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNav(link.id)}
                            className={`px-3 py-2 rounded-md text-sm font-medium font-sans transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-1 focus:ring-offset-maroon-600 flex items-center gap-1.5
                                ${activePage === link.id
                                    ? 'bg-gold-400 text-maroon-800 shadow-sm font-semibold'
                                    : 'text-primary-foreground/85 hover:bg-maroon-500 hover:text-primary-foreground'
                                }`}
                        >
                            {link.icon && link.icon}
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* Mobile menu toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-primary-foreground hover:bg-maroon-500"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <nav className="md:hidden bg-maroon-700 border-t border-maroon-500 px-4 pb-4 pt-2 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNav(link.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium font-sans transition-all flex items-center gap-2
                                ${activePage === link.id
                                    ? 'bg-gold-400 text-maroon-800 font-semibold'
                                    : 'text-primary-foreground/85 hover:bg-maroon-500 hover:text-primary-foreground'
                                }`}
                        >
                            {link.icon && link.icon}
                            {link.label}
                        </button>
                    ))}
                </nav>
            )}
        </header>
    );
}
