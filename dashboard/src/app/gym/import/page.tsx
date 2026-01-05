"use client";

import { useState } from 'react';
import { AnimatedPage, SlideIn, PopupCard } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet, X } from "lucide-react";

export default function ImportPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <AnimatedPage>
            <div className="p-8 max-w-4xl mx-auto space-y-8 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Import Members</h1>
                        <p className="text-muted-foreground mt-2">Bulk create accounts using Excel. AI will generate codes for them.</p>
                    </div>
                    <ThemeSwitcher variant="gym" />
                </div>

                {/* Step 1: Download Template */}
                <SlideIn direction="left" delay={0.1}>
                    <Card className="bg-card border-border shadow-lg">
                        <CardContent className="p-6 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-foreground">Step 1: Get the Template</h3>
                                <p className="text-sm text-muted-foreground">Download our formatted Excel sheet to avoid errors.</p>
                            </div>
                            <Button variant="outline" className="border-border text-foreground hover:bg-accent">
                                <Download className="mr-2 h-4 w-4" /> Download .XLSX
                            </Button>
                        </CardContent>
                    </Card>
                </SlideIn>

                {/* Step 2: Upload */}
                <SlideIn direction="right" delay={0.2}>
                    <Card
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-secondary'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                                <FileSpreadsheet className="h-8 w-8" />
                            </div>

                            {file ? (
                                <PopupCard className="space-y-4">
                                    <p className="text-lg font-bold text-foreground">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                    <div className="flex justify-center gap-3">
                                        <Button className="bg-primary text-primary-foreground hover:opacity-90">
                                            <Upload className="mr-2 h-4 w-4" /> Process Import
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setFile(null)}
                                            className="border-destructive text-destructive hover:bg-destructive/10"
                                        >
                                            <X className="mr-2 h-4 w-4" /> Remove
                                        </Button>
                                    </div>
                                </PopupCard>
                            ) : (
                                <>
                                    <p className="text-xl font-bold text-foreground">Drag & Drop your Excel file here</p>
                                    <p className="text-muted-foreground">or</p>
                                    <label className="inline-block">
                                        <Button variant="outline" className="border-border text-foreground hover:bg-accent cursor-pointer" asChild>
                                            <span>
                                                Browse Files
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                                                    accept=".xlsx,.csv"
                                                />
                                            </span>
                                        </Button>
                                    </label>
                                </>
                            )}
                        </div>
                    </Card>
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
