import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Students from '@/pages/Students';
import NoticesBoard from '@/pages/NoticesBoard';
import ExamSchedule from '@/pages/ExamSchedule';

type Page = 'home' | 'students' | 'notices' | 'exams';

export default function App() {
    const [activePage, setActivePage] = useState<Page>('home');

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
