"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";

export function CreateLeadFormDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("New Year Special");
    const [generatedLink, setGeneratedLink] = useState("");

    const handleGenerate = () => {
        // Mock generation
        const link = `https://dailyfit.app/inquire?gym=iron-pump&campaign=${encodeURIComponent(title)}`;
        setGeneratedLink(link);
    };

    const copyLink = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        alert("Link copied to clipboard!");
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setGeneratedLink(""); }}>
            <DialogTrigger asChild>
                <Button className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold h-10 px-6 shadow-lg shadow-[#cbfe00]/20 transition-all">
                    <LinkIcon className="mr-2 h-4 w-4" /> Create Lead Form
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Lead Generation Form</DialogTitle>
                    <DialogDescription>
                        Generate a public link for potential members to enquire.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Campaign Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Body Challenge" />
                    </div>

                    {generatedLink && (
                        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                            <Label className="text-xs text-zinc-500 mb-1 block">Shareable Link</Label>
                            <div className="flex items-center gap-2">
                                <Input value={generatedLink} readOnly className="bg-white" />
                                <Button size="icon" variant="outline" onClick={copyLink}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {!generatedLink ? (
                        <Button onClick={handleGenerate} className="bg-black text-white hover:bg-zinc-800">Summarize & Generate Link</Button>
                    ) : (
                        <Button onClick={() => setOpen(false)} variant="outline">Done</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
