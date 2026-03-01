import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { BookOpen, GraduationCap, Bell, Calendar, Loader2, LogIn } from 'lucide-react';

export default function LoginScreen() {
    const { login, loginStatus } = useInternetIdentity();
    const isLoggingIn = loginStatus === 'logging-in';

    const handleLogin = async () => {
        try {
            await login();
        } catch (error: any) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700">
            {/* Top decorative bar */}
            <div className="h-1.5 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500" />

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

                {/* Card */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Card header with emblem */}
                    <div className="bg-gradient-to-b from-maroon-700/60 to-transparent px-8 pt-10 pb-6 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gold-400/20 border-2 border-gold-400/60 flex items-center justify-center shadow-lg overflow-hidden">
                                <img
                                    src="/assets/generated/navodaya-emblem.dim_128x128.png"
                                    alt="Suraj Navodaya Emblem"
                                    className="w-20 h-20 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <GraduationCap className="w-10 h-10 text-gold-400 absolute opacity-0 [img:not([style*='none'])~&]:opacity-0 [img[style*='none']~&]:opacity-100" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold-400 flex items-center justify-center shadow">
                                <BookOpen className="w-3.5 h-3.5 text-maroon-800" />
                            </div>
                        </div>

                        <div className="text-center">
                            <h1 className="font-serif text-3xl font-bold text-gold-300 tracking-wide leading-tight">
                                Suraj Navodaya
                            </h1>
                            <p className="text-gold-400/80 text-sm font-medium tracking-widest uppercase mt-1">
                                विद्यालय प्रबंधन प्रणाली
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-8 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

                    {/* Features list */}
                    <div className="px-8 py-6 space-y-3">
                        <p className="text-white/70 text-sm text-center mb-4">
                            छात्रों, सूचनाओं और परीक्षाओं का प्रबंधन करें
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 border border-white/10">
                                <GraduationCap className="w-5 h-5 text-gold-400" />
                                <span className="text-white/80 text-xs text-center font-medium">छात्र</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 border border-white/10">
                                <Bell className="w-5 h-5 text-gold-400" />
                                <span className="text-white/80 text-xs text-center font-medium">सूचनाएं</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 border border-white/10">
                                <Calendar className="w-5 h-5 text-gold-400" />
                                <span className="text-white/80 text-xs text-center font-medium">परीक्षा</span>
                            </div>
                        </div>
                    </div>

                    {/* Login button */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={handleLogin}
                            disabled={isLoggingIn}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-maroon-900 font-bold text-base py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-gold-400/30 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>लॉगिन हो रहा है...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>लॉगिन करें</span>
                                </>
                            )}
                        </button>
                        <p className="text-white/40 text-xs text-center mt-3">
                            Internet Identity द्वारा सुरक्षित
                        </p>
                    </div>
                </div>

                {/* Tagline below card */}
                <p className="mt-6 text-gold-400/60 text-sm text-center max-w-xs">
                    "ज्ञान ही शक्ति है" — शिक्षा के माध्यम से उज्जवल भविष्य
                </p>
            </div>

            {/* Bottom decorative bar */}
            <div className="h-1.5 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" />
        </div>
    );
}
