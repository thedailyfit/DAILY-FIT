import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Video, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sessions | DailyFit Trainer Dashboard",
};

export default async function SessionsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch upcoming sessions from calendar_events
    const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('trainer_id', user?.id)
        .in('event_type', ['Session', 'Consult'])
        .order('event_date', { ascending: true });

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen text-foreground transition-colors duration-300">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Upcoming Sessions
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your scheduled 1-on-1 and group sessions.
                    </p>
                </div>
                <Link href="/dashboard/calendar">
                    <Button className="bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-xl transition-all border-none">
                        <CalendarDays className="mr-2 h-4 w-4" /> Go to Calendar
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events.length > 0 ? (
                    events.map((event: any) => (
                        <Card key={event.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold flex items-center justify-between">
                                    {event.title}
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                        {event.event_type}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="mr-2 h-4 w-4 text-primary" />
                                        {event.event_time || "TBD"}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border flex gap-2">
                                    <Button className="w-full bg-muted text-foreground hover:bg-muted/80">
                                        Reschedule
                                    </Button>
                                    <Button variant="outline" className="w-10 p-0 border-border">
                                        <Video className="h-4 w-4 text-primary" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No upcoming sessions</p>
                        <p className="text-sm">Schedule a session in the calendar to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
