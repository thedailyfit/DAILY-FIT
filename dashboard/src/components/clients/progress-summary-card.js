"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressSummaryCard = ProgressSummaryCard;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const log_progress_dialog_1 = require("@/components/clients/log-progress-dialog");
const generate_progress_summary_1 = require("@/app/actions/generate-progress-summary");
const lucide_react_1 = require("lucide-react");
function ProgressSummaryCard({ clientId, clientName, progressEntries }) {
    const [summary, setSummary] = (0, react_1.useState)(null);
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const handleGenerate = () => __awaiter(this, void 0, void 0, function* () {
        setIsGenerating(true);
        try {
            const result = yield (0, generate_progress_summary_1.generateProgressSummary)(clientName, progressEntries);
            setSummary(result);
        }
        catch (error) {
            console.error("Error:", error);
            setSummary("Failed to generate summary.");
        }
        finally {
            setIsGenerating(false);
        }
    });
    return (<card_1.Card>
            <card_1.CardHeader>
                <card_1.CardTitle className="text-sm font-medium">
                    Status & AI Insights
                </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    Track progress and get AI-powered insights based on client logs.
                </p>
                <div className="flex gap-2">
                    <log_progress_dialog_1.LogProgressDialog clientId={clientId}/>
                    <button_1.Button size="sm" variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (<>
                                <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Analyzing...
                            </>) : (<>
                                <lucide_react_1.Sparkles className="mr-2 h-4 w-4"/>
                                Generate AI Summary
                            </>)}
                    </button_1.Button>
                </div>

                {summary ? (<div className="rounded-md bg-muted p-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {summary}
                    </div>) : (<div className="flex h-32 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                        {progressEntries.length > 0
                ? "Click 'Generate AI Summary' to analyze the data."
                : "Log some progress data to generate insights."}
                    </div>)}
            </card_1.CardContent>
        </card_1.Card>);
}
