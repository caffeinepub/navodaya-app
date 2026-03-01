import { useState } from 'react';
import { Bell, Plus, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { useGetAllNotices, useAddNotice } from '@/hooks/useQueries';

function NoticeCard({ title, content, date }: { title: string; content: string; date: string }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = content.length > 180;

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 border-border border-l-4 border-l-gold-400">
            <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="font-serif text-base font-semibold text-maroon-700 dark:text-gold-400 leading-snug">
                        {title}
                    </CardTitle>
                    <Badge variant="outline" className="flex-shrink-0 text-xs border-maroon-200 text-maroon-500 dark:border-maroon-700 dark:text-gold-500 gap-1 font-sans">
                        <Calendar className="w-3 h-3" />
                        {date}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
                <p className={`text-sm text-muted-foreground font-sans leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
                    {content}
                </p>
                {isLong && (
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="text-xs text-maroon-600 dark:text-gold-500 hover:underline mt-1.5 font-sans font-medium"
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </CardContent>
        </Card>
    );
}

export default function NoticesBoard() {
    const { data: notices, isLoading } = useGetAllNotices();
    const addNotice = useAddNotice();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', date: '' });
    const [formError, setFormError] = useState('');

    const sorted = notices ? [...notices].sort((a, b) => b.date.localeCompare(a.date)) : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!form.title.trim() || !form.content.trim() || !form.date) {
            setFormError('All fields are required.');
            return;
        }
        try {
            await addNotice.mutateAsync({
                title: form.title.trim(),
                content: form.content.trim(),
                date: form.date,
            });
            setForm({ title: '', content: '', date: '' });
            setDialogOpen(false);
        } catch {
            setFormError('Failed to add notice. Please try again.');
        }
    };

    return (
        <div>
            <PageHeader
                title="Notice Board"
                subtitle="School announcements and circulars"
                icon={<Bell className="w-5 h-5" />}
                action={
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Post Notice
                    </Button>
                }
            />

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="shadow-card border-l-4 border-l-gold-400">
                            <CardContent className="p-5 space-y-2">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-3 w-1/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <EmptyState
                    icon={<Bell className="w-8 h-8" />}
                    title="No notices yet"
                    description="Post the first school notice using the button above."
                />
            ) : (
                <div className="space-y-4">
                    {sorted.map((notice, i) => (
                        <NoticeCard key={i} {...notice} />
                    ))}
                </div>
            )}

            {/* Add Notice Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-maroon-700 dark:text-gold-400">
                            Post New Notice
                        </DialogTitle>
                        <DialogDescription className="font-sans">
                            Fill in the notice details to publish it on the board.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="notice-title" className="font-sans text-sm">Title</Label>
                            <Input
                                id="notice-title"
                                placeholder="e.g. Annual Sports Day Announcement"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                className="font-sans"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="notice-date" className="font-sans text-sm">Date</Label>
                            <Input
                                id="notice-date"
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                className="font-sans"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="notice-content" className="font-sans text-sm">Content</Label>
                            <Textarea
                                id="notice-content"
                                placeholder="Write the notice content here…"
                                rows={4}
                                value={form.content}
                                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                className="font-sans resize-none"
                            />
                        </div>
                        {formError && (
                            <p className="text-sm text-destructive font-sans">{formError}</p>
                        )}
                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setDialogOpen(false); setFormError(''); }}
                                className="font-sans"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={addNotice.isPending}
                                className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground font-sans gap-2"
                            >
                                {addNotice.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Post Notice
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
