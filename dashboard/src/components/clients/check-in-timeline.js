"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInTimeline = CheckInTimeline;
const card_1 = require("@/components/ui/card");
const scroll_area_1 = require("@/components/ui/scroll-area");
const badge_1 = require("@/components/ui/badge");
const date_fns_1 = require("date-fns");
const lucide_react_1 = require("lucide-react");
function CheckInTimeline({ entries }) {
    // Sort entries by date descending
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sortedEntries.length === 0) {
        return (<card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle className="text-sm font-medium">Check-in History</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                        No check-ins recorded yet.
                    </div>
                </card_1.CardContent>
            </card_1.Card>);
    }
    return (<card_1.Card className="h-full flex flex-col">
            <card_1.CardHeader>
                <card_1.CardTitle className="text-sm font-medium">Check-in History</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="flex-1 p-0">
                <scroll_area_1.ScrollArea className="h-[400px] px-6 pb-6">
                    <div className="relative border-l border-muted ml-2 space-y-8">
                        {sortedEntries.map((entry, index) => (<div key={entry.id} className="relative pl-6">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"/>

                                <div className="flex flex-col gap-2">
                                    {/* Date Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">
                                                {(0, date_fns_1.format)(new Date(entry.date), "MMM d, yyyy")}
                                            </span>
                                            {index === 0 && (<badge_1.Badge variant="secondary" className="text-[10px] h-5">Latest</badge_1.Badge>)}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {(0, date_fns_1.format)(new Date(entry.date), "EEEE")}
                                        </span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <lucide_react_1.Weight className="w-3 h-3"/>
                                            <span className="text-foreground font-medium">{entry.weight_kg} kg</span>
                                        </div>
                                        {entry.body_fat_pct && (<div className="flex items-center gap-2 text-muted-foreground">
                                                <lucide_react_1.Activity className="w-3 h-3"/>
                                                <span className="text-foreground font-medium">{entry.body_fat_pct}% BF</span>
                                            </div>)}
                                        {entry.adherence_score && (<div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                                <span className="text-xs">Adherence:</span>
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`h-1.5 w-3 rounded-full ${i < entry.adherence_score
                        ? "bg-green-500"
                        : "bg-muted"}`}/>))}
                                                </div>
                                                <span className="text-xs font-medium ml-1">{entry.adherence_score}/10</span>
                                            </div>)}
                                    </div>

                                    {/* Notes */}
                                    {entry.notes && (<div className="mt-1 bg-muted/50 p-3 rounded-md text-xs text-muted-foreground italic">
                                            "{entry.notes}"
                                        </div>)}

                                    {/* Photos Badge */}
                                    {entry.photos && entry.photos.length > 0 && (<div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                            <lucide_react_1.FileText className="w-3 h-3"/>
                                            <span>{entry.photos.length} photos attached</span>
                                        </div>)}
                                </div>
                            </div>))}
                    </div>
                </scroll_area_1.ScrollArea>
            </card_1.CardContent>
        </card_1.Card>);
}
