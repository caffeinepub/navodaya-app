import { useState } from 'react';
import { Megaphone, Plus, ExternalLink, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { useGetAllAds, useAddAd, useToggleAd } from '@/hooks/useQueries';
import type { Ad } from '@/backend';

function AdCard({ ad, onToggle, isToggling }: { ad: Ad; onToggle: (id: bigint) => void; isToggling: boolean }) {
    return (
        <Card className={`shadow-card border-border transition-all duration-200 overflow-hidden ${!ad.isActive ? 'opacity-60' : 'hover:shadow-card-hover'}`}>
            {ad.imageUrl && (
                <div className="w-full h-40 overflow-hidden bg-muted">
                    <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.parentElement!.style.display = 'none';
                        }}
                    />
                </div>
            )}
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-maroon-50 dark:bg-maroon-900/40 flex items-center justify-center text-maroon-600 dark:text-gold-400 flex-shrink-0">
                            <Megaphone className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-semibold text-foreground text-base leading-tight truncate">
                            {ad.title}
                        </h3>
                    </div>
                    <Badge
                        variant={ad.isActive ? 'default' : 'outline'}
                        className={`flex-shrink-0 text-xs ${ad.isActive ? 'bg-gold-400 text-maroon-800 hover:bg-gold-300' : 'border-muted-foreground text-muted-foreground'}`}
                    >
                        {ad.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>

                <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-4 line-clamp-3">
                    {ad.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                    {ad.linkUrl && (
                        <a
                            href={ad.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-maroon-600 dark:text-gold-400 hover:text-maroon-800 dark:hover:text-gold-300 transition-colors border border-maroon-200 dark:border-maroon-700 rounded-md px-3 py-1.5"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Visit Link
                        </a>
                    )}
                    <button
                        onClick={() => onToggle(ad.id)}
                        disabled={isToggling}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-3 py-1.5 disabled:opacity-50"
                    >
                        {isToggling ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : ad.isActive ? (
                            <ToggleRight className="w-3 h-3" />
                        ) : (
                            <ToggleLeft className="w-3 h-3" />
                        )}
                        {ad.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Advertisements() {
    const { data: ads, isLoading } = useGetAllAds();
    const addAd = useAddAd();
    const toggleAd = useToggleAd();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', imageUrl: '', linkUrl: '' });
    const [formError, setFormError] = useState('');
    const [togglingId, setTogglingId] = useState<bigint | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!form.title.trim() || !form.description.trim()) {
            setFormError('Title and description are required.');
            return;
        }
        try {
            await addAd.mutateAsync({
                title: form.title.trim(),
                description: form.description.trim(),
                imageUrl: form.imageUrl.trim(),
                linkUrl: form.linkUrl.trim(),
            });
            setForm({ title: '', description: '', imageUrl: '', linkUrl: '' });
            setDialogOpen(false);
        } catch {
            setFormError('Failed to add advertisement. Please try again.');
        }
    };

    const handleToggle = async (id: bigint) => {
        setTogglingId(id);
        try {
            await toggleAd.mutateAsync(id);
        } finally {
            setTogglingId(null);
        }
    };

    const activeCount = ads?.filter((a) => a.isActive).length ?? 0;

    return (
        <div>
            <PageHeader
                title="Advertisements"
                subtitle={`${activeCount} active advertisement${activeCount !== 1 ? 's' : ''}`}
                icon={<Megaphone className="w-5 h-5" />}
                action={
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Advertisement
                    </Button>
                }
            />

            {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="shadow-card">
                            <Skeleton className="w-full h-40" />
                            <CardContent className="p-5 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : !ads || ads.length === 0 ? (
                <EmptyState
                    icon={<Megaphone className="w-8 h-8" />}
                    title="No advertisements yet"
                    description="Add the first advertisement using the button above."
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ads.map((ad) => (
                        <AdCard
                            key={ad.id.toString()}
                            ad={ad}
                            onToggle={handleToggle}
                            isToggling={togglingId === ad.id}
                        />
                    ))}
                </div>
            )}

            {/* Add Advertisement Dialog */}
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setFormError(''); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-maroon-700 dark:text-gold-400">
                            Add New Advertisement
                        </DialogTitle>
                        <DialogDescription className="font-sans">
                            Fill in the details for the new advertisement.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="ad-title" className="font-sans text-sm">Title *</Label>
                            <Input
                                id="ad-title"
                                placeholder="e.g. Annual Sports Day Registration"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                className="font-sans"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ad-description" className="font-sans text-sm">Description *</Label>
                            <Textarea
                                id="ad-description"
                                placeholder="Enter advertisement details…"
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                className="font-sans resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ad-imageUrl" className="font-sans text-sm">Image URL (optional)</Label>
                            <Input
                                id="ad-imageUrl"
                                placeholder="https://example.com/image.jpg"
                                value={form.imageUrl}
                                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                                className="font-sans"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="ad-linkUrl" className="font-sans text-sm">Link URL (optional)</Label>
                            <Input
                                id="ad-linkUrl"
                                placeholder="https://example.com"
                                value={form.linkUrl}
                                onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
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
                                disabled={addAd.isPending}
                                className="bg-maroon-600 hover:bg-maroon-500 text-primary-foreground font-sans gap-2"
                            >
                                {addAd.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Add Advertisement
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
