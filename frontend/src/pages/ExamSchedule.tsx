import { useState } from 'react';
import { Calendar, Plus, Clock, BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { useGetAllExams, useAddExam } from '@/hooks/useQueries';

function isUpcoming(date: string): boolean {
    return date >= new Date().toISOString().split('T')[0];
}

export default function ExamSchedule() {
    const { data: exams, isLoading } = useGetAllExams();
    const addExam = useAddExam();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ subject: '', date: '', time: '', classLevel: '' });
    const [formError, setFormError] = useState('');

    const sorted = exams ? [...exams].sort((a, b) => a.date.localeCompare(b.date)) : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!form.subject.trim() || !form.date || !form.time || !form.classLevel) {
            setFormError('All fields are required.');
            return;
        }
        const classNum = parseInt(form.classLevel);
        if (isNaN(classNum) || classNum < 6 || classNum > 12) {
            setFormError('Class must be between 6 and 12.');
            return;
        }
        try {
            await addExam.mutateAsync({
                subject: form.subject.trim(),
                date: form.date,
                time: form.time,
                classLevel: BigInt(classNum),
            });
            setForm({ subject: '', date: '', time: '', classLevel: '' });
            setDialogOpen(false);
        } catch {
            setFormError('Failed to add exam. Please try again.');
        }
    };

    return (
        <div>
            <PageHeader
                title="Exam Schedule"
                subtitle="Upcoming and past examination timetable"
                icon={<Calendar className="w-5 h-5" />}
                action={
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Exam
                    </Button>
                }
            />

            {isLoading ? (
                <Card className="shadow-card">
                    <CardContent className="p-0">
                        <div className="space-y-0 divide-y divide-border">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : sorted.length === 0 ? (
                <EmptyState
                    icon={<Calendar className="w-8 h-8" />}
                    title="No exams scheduled"
                    description="Add the first exam to the timetable using the button above."
                />
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <Card className="shadow-card border-border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-maroon-50 dark:bg-maroon-900/30 hover:bg-maroon-50 dark:hover:bg-maroon-900/30">
                                        <TableHead className="font-serif font-semibold text-maroon-700 dark:text-gold-400 w-12">#</TableHead>
                                        <TableHead className="font-serif font-semibold text-maroon-700 dark:text-gold-400">Subject</TableHead>
                                        <TableHead className="font-serif font-semibold text-maroon-700 dark:text-gold-400">Date</TableHead>
                                        <TableHead className="font-serif font-semibold text-maroon-700 dark:text-gold-400">Time</TableHead>
                                        <TableHead className="font-serif font-semibold text-maroon-700 dark:text-gold-400">Class</TableHead>
                                        <TableHead className="font-serif font-semibold text-maroon-700 dark:text-gold-400">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sorted.map((exam, i) => {
                                        const upcoming = isUpcoming(exam.date);
                                        return (
                                            <TableRow
                                                key={i}
                                                className={`font-sans transition-colors ${upcoming ? '' : 'opacity-60'}`}
                                            >
                                                <TableCell className="text-muted-foreground text-sm">{i + 1}</TableCell>
                                                <TableCell className="font-medium text-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-maroon-400 flex-shrink-0" />
                                                        {exam.subject}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-foreground">{exam.date}</TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {exam.time}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-maroon-200 text-maroon-600 dark:border-maroon-700 dark:text-gold-400">
                                                        Class {exam.classLevel.toString()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {upcoming ? (
                                                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs">
                                                            Upcoming
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Completed
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {sorted.map((exam, i) => {
                            const upcoming = isUpcoming(exam.date);
                            return (
                                <Card
                                    key={i}
                                    className={`shadow-card border-border border-l-4 ${upcoming ? 'border-l-green-500' : 'border-l-muted opacity-70'}`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="w-4 h-4 text-maroon-500" />
                                                    <span className="font-serif font-semibold text-foreground">
                                                        {exam.subject}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-sans mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {exam.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {exam.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <Badge variant="outline" className="text-xs border-maroon-200 text-maroon-600 dark:border-maroon-700 dark:text-gold-400">
                                                    Class {exam.classLevel.toString()}
                                                </Badge>
                                                {upcoming ? (
                                                    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs">
                                                        Upcoming
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Done
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Add Exam Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-maroon-700 dark:text-gold-400">
                            Add Exam to Schedule
                        </DialogTitle>
                        <DialogDescription className="font-sans">
                            Enter the exam details to add it to the timetable.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="subject" className="font-sans text-sm">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="e.g. Mathematics"
                                value={form.subject}
                                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                className="font-sans"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-date" className="font-sans text-sm">Date</Label>
                                <Input
                                    id="exam-date"
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                    className="font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="exam-time" className="font-sans text-sm">Time</Label>
                                <Input
                                    id="exam-time"
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                                    className="font-sans"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="exam-class" className="font-sans text-sm">Class (6–12)</Label>
                            <Input
                                id="exam-class"
                                type="number"
                                min={6}
                                max={12}
                                placeholder="e.g. 10"
                                value={form.classLevel}
                                onChange={(e) => setForm((f) => ({ ...f, classLevel: e.target.value }))}
                                className="font-sans"
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
                                disabled={addExam.isPending}
                                className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground font-sans gap-2"
                            >
                                {addExam.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add Exam
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
