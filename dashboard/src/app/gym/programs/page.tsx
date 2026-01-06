"use client";

import { GymProgramManager } from "@/components/gym/gym-program-manager";
import { AnimatedPage, SlideIn } from "@/components/animated-components";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function GymProgramsPage() {
    return (
        <AnimatedPage>
            <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase text-foreground">Gym Admin Custom Plans</h2>
                        <p className="text-muted-foreground">Create standard workout templates for your trainers.</p>
                    </div>
                    <ThemeSwitcher variant="gym" />
                </div>

                <SlideIn direction="up" delay={0.1}>
                    <GymProgramManager />
                </SlideIn>
            </div>
        </AnimatedPage>
    );
}
