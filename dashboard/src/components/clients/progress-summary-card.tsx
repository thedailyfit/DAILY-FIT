"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogProgressDialog } from "@/components/clients/log-progress-dialog"
import { generateProgressSummary } from "@/app/actions/generate-progress-summary"
import { Loader2, Sparkles } from "lucide-react"

interface ProgressSummaryCardProps {
    clientId: string
    clientName: string
    progressEntries: any[]
}

export function ProgressSummaryCard({ clientId, clientName, progressEntries }: ProgressSummaryCardProps) {
    const [summary, setSummary] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const result = await generateProgressSummary(clientName, progressEntries)
            setSummary(result)
        } catch (error) {
            console.error("Error:", error)
            setSummary("Failed to generate summary.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">
                    Status & AI Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    Track progress and get AI-powered insights based on client logs.
                </p>
                <div className="flex gap-2">
                    <LogProgressDialog clientId={clientId} />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate AI Summary
                            </>
                        )}
                    </Button>
                </div>

                {summary ? (
                    <div className="rounded-md bg-muted p-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {summary}
                    </div>
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                        {progressEntries.length > 0
                            ? "Click 'Generate AI Summary' to analyze the data."
                            : "Log some progress data to generate insights."}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
