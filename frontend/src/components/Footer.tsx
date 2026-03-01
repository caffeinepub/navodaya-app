import { Heart } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();
    const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'navodaya-portal');

    return (
        <footer className="bg-maroon-800 text-primary-foreground/70 mt-auto">
            <div className="border-t border-maroon-600">
                <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-sans">
                    <div className="flex items-center gap-2">
                        <span className="font-serif font-semibold text-gold-400">Navodaya Portal</span>
                        <span className="text-primary-foreground/40">·</span>
                        <span>© {year} All rights reserved</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary-foreground/60">
                        <span>Built with</span>
                        <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                        <span>using</span>
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
                        >
                            caffeine.ai
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
