'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-gray-400 mb-6">
                        {error.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    )
}
