import { Bell, Users, Calendar, BookOpen, ArrowRight, TrendingUp, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllNotices } from '@/hooks/useQueries';
import { useGetAllStudents } from '@/hooks/useQueries';
import { useGetAllExams } from '@/hooks/useQueries';
import { useGetAllAds } from '@/hooks/useQueries';

interface HomeProps {
    onNavigate: (page: string) => void;
}

function StatCard({
    icon,
    label,
    value,
    loading,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    loading?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group w-full text-left bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 p-5 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:ring-offset-2"
        >
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-maroon-50 dark:bg-maroon-900/40 flex items-center justify-center text-maroon-600 dark:text-gold-400">
                    {icon}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-maroon-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-4">
                {loading ? (
                    <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                    <div className="text-3xl font-serif font-bold text-maroon-700 dark:text-gold-400">{value}</div>
                )}
                <div className="text-sm text-muted-foreground font-sans mt-1">{label}</div>
            </div>
        </button>
    );
}

export default function Home({ onNavigate }: HomeProps) {
    const { data: notices, isLoading: noticesLoading } = useGetAllNotices();
    const { data: students, isLoading: studentsLoading } = useGetAllStudents();
    const { data: exams, isLoading: examsLoading } = useGetAllExams();
    const { data: ads, isLoading: adsLoading } = useGetAllAds();

    const recentNotices = notices
        ? [...notices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
        : [];

    const upcomingExams = exams
        ? [...exams]
              .filter((e) => e.date >= new Date().toISOString().split('T')[0])
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 3)
        : [];

    const activeAds = ads ? ads.filter((a) => a.isActive).slice(0, 3) : [];

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <section className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                    src="/assets/generated/navodaya-hero-banner.dim_1200x400.png"
                    alt="Navodaya Vidyalaya Campus"
                    className="w-full h-48 sm:h-64 md:h-80 object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/80 via-maroon-800/60 to-transparent flex items-end">
                    <div className="p-6 sm:p-8">
                        <Badge className="bg-gold-400 text-maroon-800 hover:bg-gold-300 mb-3 font-sans text-xs tracking-wider uppercase">
                            Welcome
                        </Badge>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight max-w-lg">
                            Jawahar Navodaya Vidyalaya
                        </h2>
                        <p className="text-white/80 text-sm mt-2 font-sans max-w-md">
                            Empowering rural talent through quality education since 1986.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section>
                <h2 className="font-serif text-lg font-semibold text-maroon-700 dark:text-gold-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Users className="w-5 h-5" />}
                        label="Total Students"
                        value={studentsLoading ? '—' : (students?.length ?? 0)}
                        loading={studentsLoading}
                        onClick={() => onNavigate('students')}
                    />
                    <StatCard
                        icon={<Bell className="w-5 h-5" />}
                        label="Notices"
                        value={noticesLoading ? '—' : (notices?.length ?? 0)}
                        loading={noticesLoading}
                        onClick={() => onNavigate('notices')}
                    />
                    <StatCard
                        icon={<Calendar className="w-5 h-5" />}
                        label="Upcoming Exams"
                        value={examsLoading ? '—' : upcomingExams.length}
                        loading={examsLoading}
                        onClick={() => onNavigate('exams')}
                    />
                    <StatCard
                        icon={<BookOpen className="w-5 h-5" />}
                        label="Total Exams"
                        value={examsLoading ? '—' : (exams?.length ?? 0)}
                        loading={examsLoading}
                        onClick={() => onNavigate('exams')}
                    />
                </div>
            </section>

            {/* Recent Notices + Upcoming Exams */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Notices */}
                <Card className="shadow-card border-border">
                    <CardHeader className="pb-3 border-b border-border">
                        <CardTitle className="font-serif text-base flex items-center justify-between">
                            <span className="flex items-center gap-2 text-maroon-700 dark:text-gold-400">
                                <Bell className="w-4 h-4" />
                                Latest Notices
                            </span>
                            <button
                                onClick={() => onNavigate('notices')}
                                className="text-xs font-sans text-maroon-500 hover:text-maroon-700 dark:text-gold-500 dark:hover:text-gold-300 flex items-center gap-1 transition-colors"
                            >
                                View all <ArrowRight className="w-3 h-3" />
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {noticesLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            ))
                        ) : recentNotices.length === 0 ? (
                            <p className="text-sm text-muted-foreground font-sans py-4 text-center">
                                No notices yet.
                            </p>
                        ) : (
                            recentNotices.map((notice, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate font-sans">
                                            {notice.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                                            {notice.date}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Exams */}
                <Card className="shadow-card border-border">
                    <CardHeader className="pb-3 border-b border-border">
                        <CardTitle className="font-serif text-base flex items-center justify-between">
                            <span className="flex items-center gap-2 text-maroon-700 dark:text-gold-400">
                                <Calendar className="w-4 h-4" />
                                Upcoming Exams
                            </span>
                            <button
                                onClick={() => onNavigate('exams')}
                                className="text-xs font-sans text-maroon-500 hover:text-maroon-700 dark:text-gold-500 dark:hover:text-gold-300 flex items-center gap-1 transition-colors"
                            >
                                View all <ArrowRight className="w-3 h-3" />
                            </button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {examsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))
                        ) : upcomingExams.length === 0 ? (
                            <p className="text-sm text-muted-foreground font-sans py-4 text-center">
                                No upcoming exams.
                            </p>
                        ) : (
                            upcomingExams.map((exam, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-maroon-500 mt-1.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground truncate font-sans">
                                            {exam.subject}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                                            {exam.date} · {exam.time} · Class {exam.classLevel.toString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Active Advertisements Preview */}
            {(adsLoading || activeAds.length > 0) && (
                <section>
                    <Card className="shadow-card border-border">
                        <CardHeader className="pb-3 border-b border-border">
                            <CardTitle className="font-serif text-base flex items-center justify-between">
                                <span className="flex items-center gap-2 text-maroon-700 dark:text-gold-400">
                                    <Megaphone className="w-4 h-4" />
                                    Advertisements
                                </span>
                                <button
                                    onClick={() => onNavigate('advertisements')}
                                    className="text-xs font-sans text-maroon-500 hover:text-maroon-700 dark:text-gold-500 dark:hover:text-gold-300 flex items-center gap-1 transition-colors"
                                >
                                    View all <ArrowRight className="w-3 h-3" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {adsLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-3 gap-3">
                                    {activeAds.map((ad) => (
                                        <div
                                            key={ad.id.toString()}
                                            className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                                                    <Megaphone className="w-3 h-3 text-gold-600 dark:text-gold-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-foreground truncate font-sans">
                                                    {ad.title}
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed">
                                                {ad.description}
                                            </p>
                                            {ad.linkUrl && (
                                                <a
                                                    href={ad.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-maroon-600 dark:text-gold-400 hover:underline flex items-center gap-1 mt-auto"
                                                >
                                                    <ArrowRight className="w-3 h-3" />
                                                    Learn more
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
}
