"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, CheckCircle, LifeBuoy } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SupportPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Insert into support_tickets table (or similar table on backend)
                await supabase.from('support_tickets').insert({
                    user_id: user.id,
                    subject,
                    message,
                    status: 'open',
                    created_at: new Date().toISOString()
                });
            }
            
            setSubmitted(true);
            setSubject("");
            setMessage("");
        } catch (err) {
            console.error("Error submitting support request", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <LifeBuoy className="h-8 w-8 text-primary" /> Support Request
                </h1>
                <p className="text-muted-foreground mt-2">
                    Submit an issue or feature request directly to the DailyFit Admin Team.
                </p>
            </div>

            <Card className="max-w-2xl bg-card border-border">
                <CardHeader>
                    <CardTitle>How can we help?</CardTitle>
                    <CardDescription>We typically respond within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in">
                            <div className="h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">Request Submitted!</h3>
                            <p className="text-muted-foreground max-w-md">
                                Your support ticket has been sent to our admin team. We will be in touch shortly.
                            </p>
                            <Button variant="outline" onClick={() => setSubmitted(false)}>
                                Submit Another Request
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input 
                                    id="subject"
                                    placeholder="Brief description of the issue..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message Details</Label>
                                <Textarea 
                                    id="message"
                                    placeholder="Please provide as much detail as possible..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="min-h-[150px] bg-background border-border"
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                                {loading ? "Sending..." : "Submit Request"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
