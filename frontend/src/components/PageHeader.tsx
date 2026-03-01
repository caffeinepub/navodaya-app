interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-maroon-600 flex items-center justify-center text-gold-400 flex-shrink-0">
                        {icon}
                    </div>
                )}
                <div>
                    <h1 className="font-serif text-2xl font-bold text-maroon-700 dark:text-gold-400 leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-0.5 font-sans">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
