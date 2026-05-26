'use client'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md mx-auto text-center p-8">
                <div className="text-5xl mb-4">😵</div>
                <h2 className="text-xl font-bold mb-2">Dashboard Error</h2>
                <p className="text-muted-foreground mb-6">
                    {error.message || 'Something went wrong loading this page.'}
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Retry
                </button>
            </div>
        </div>
    )
}
