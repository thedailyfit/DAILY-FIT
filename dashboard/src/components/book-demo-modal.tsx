"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

export function BookDemoModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        {submitted ? "You're all set!" : "Book a Live Demo"}
                    </DialogTitle>
                </DialogHeader>

                {submitted ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                            <span className="text-3xl">✅</span>
                        </div>
                        <p className="text-gray-300">
                            Thanks for your interest! Our expert will call you shortly at <strong>+91 89192 05848</strong> (or your provided number) to schedule the session.
                        </p>
                        <Button onClick={() => setOpen(false)} className="w-full mt-4">Close</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input id="name" required placeholder="John Doe" className="bg-background/50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gym">Gym Name</Label>
                            <Input id="gym" required placeholder="Muscle Factory" className="bg-background/50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" required placeholder="+91 98765 43210" className="bg-background/50" />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? "Booking..." : "Confirm Booking"}
                        </Button>

                        <p className="text-xs text-center text-gray-500">
                            Direct Support: +91 89192 05848
                        </p>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
