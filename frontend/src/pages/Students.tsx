import { useState } from 'react';
import { Users, Search, Plus, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { useGetAllStudents, useAddStudent } from '@/hooks/useQueries';

const HOUSE_COLORS: Record<string, string> = {
    Aravali: 'bg-blue-100 text-blue-800 border-blue-200',
    Nilgiri: 'bg-green-100 text-green-800 border-green-200',
    Shivalik: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Udaigiri: 'bg-red-100 text-red-800 border-red-200',
};

function getHouseColor(house: string): string {
    return HOUSE_COLORS[house] || 'bg-muted text-muted-foreground border-border';
}

function StudentCard({ name, classLevel, house, rollNumber }: {
    name: string;
    classLevel: bigint;
    house: string;
    rollNumber: bigint;
}) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 border-border group">
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-maroon-600 flex items-center justify-center text-gold-300 font-serif font-bold text-lg flex-shrink-0 group-hover:bg-maroon-500 transition-colors">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-serif font-semibold text-foreground text-base leading-tight truncate">
                            {name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs border-maroon-200 text-maroon-600 dark:border-maroon-700 dark:text-gold-400">
                                Class {classLevel.toString()}
                            </Badge>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getHouseColor(house)}`}>
                                {house}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-sans">
                            Roll No: <span className="font-semibold text-foreground">{rollNumber.toString()}</span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Students() {
    const { data: students, isLoading } = useGetAllStudents();
    const addStudent = useAddStudent();

    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ name: '', classLevel: '', house: '', rollNumber: '' });
    const [formError, setFormError] = useState('');

    const filtered = (students ?? []).filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.house.toLowerCase().includes(search.toLowerCase()) ||
            s.rollNumber.toString().includes(search)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!form.name.trim() || !form.classLevel || !form.house.trim() || !form.rollNumber) {
            setFormError('All fields are required.');
            return;
        }
        const classNum = parseInt(form.classLevel);
        const rollNum = parseInt(form.rollNumber);
        if (isNaN(classNum) || classNum < 6 || classNum > 12) {
            setFormError('Class must be between 6 and 12.');
            return;
        }
        if (isNaN(rollNum) || rollNum <= 0) {
            setFormError('Roll number must be a positive number.');
            return;
        }
        try {
            await addStudent.mutateAsync({
                name: form.name.trim(),
                classLevel: BigInt(classNum),
                house: form.house.trim(),
                rollNumber: BigInt(rollNum),
            });
            setForm({ name: '', classLevel: '', house: '', rollNumber: '' });
            setDialogOpen(false);
        } catch {
            setFormError('Failed to add student. Please try again.');
        }
    };

    return (
        <div>
            <PageHeader
                title="Students"
                subtitle={`${students?.length ?? 0} students enrolled`}
                icon={<Users className="w-5 h-5" />}
                action={
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Student
                    </Button>
                }
            />

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, house, or roll number…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 font-sans"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="shadow-card">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={<Users className="w-8 h-8" />}
                    title={search ? 'No students found' : 'No students yet'}
                    description={
                        search
                            ? 'Try a different search term.'
                            : 'Add the first student using the button above.'
                    }
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((student, i) => (
                        <StudentCard key={i} {...student} />
                    ))}
                </div>
            )}

            {/* Add Student Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-maroon-700 dark:text-gold-400">
                            Add New Student
                        </DialogTitle>
                        <DialogDescription className="font-sans">
                            Enter the student's details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="font-sans text-sm">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Rahul Kumar"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                className="font-sans"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="classLevel" className="font-sans text-sm">Class (6–12)</Label>
                                <Input
                                    id="classLevel"
                                    type="number"
                                    min={6}
                                    max={12}
                                    placeholder="e.g. 9"
                                    value={form.classLevel}
                                    onChange={(e) => setForm((f) => ({ ...f, classLevel: e.target.value }))}
                                    className="font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="rollNumber" className="font-sans text-sm">Roll Number</Label>
                                <Input
                                    id="rollNumber"
                                    type="number"
                                    min={1}
                                    placeholder="e.g. 42"
                                    value={form.rollNumber}
                                    onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
                                    className="font-sans"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="house" className="font-sans text-sm">House</Label>
                            <Input
                                id="house"
                                placeholder="e.g. Aravali, Nilgiri, Shivalik, Udaigiri"
                                value={form.house}
                                onChange={(e) => setForm((f) => ({ ...f, house: e.target.value }))}
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
                                disabled={addStudent.isPending}
                                className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground font-sans gap-2"
                            >
                                {addStudent.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add Student
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
