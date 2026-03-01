import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginScreen from '@/components/LoginScreen';
import Home from '@/pages/Home';
import Students from '@/pages/Students';
import NoticesBoard from '@/pages/NoticesBoard';
import ExamSchedule from '@/pages/ExamSchedule';
import Advertisements from '@/pages/Advertisements';

type Page = 'home' | 'students' | 'notices' | 'exams' | 'advertisements';

export default function App() {
    const [activePage, setActivePage] = useState<Page>('home');
    const { identity, isInitializing } = useInternetIdentity();

    const isAuthenticated = !!identity;

    // Show a minimal loading state while identity is being restored
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-gold-400/30 border-t-gold-400 animate-spin" />
                    <p className="text-gold-400/70 text-sm font-medium">लोड हो रहा है...</p>
                </div>
            </div>
        );
    }

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <Home onNavigate={(p) => setActivePage(p as Page)} />;
            case 'students':
                return <Students />;
            case 'notices':
                return <NoticesBoard />;
            case 'exams':
                return <ExamSchedule />;
            case 'advertisements':
                return <Advertisements />;
            default:
                return <Home onNavigate={(p) => setActivePage(p as Page)} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header activePage={activePage} onNavigate={(p) => setActivePage(p as Page)} />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}
