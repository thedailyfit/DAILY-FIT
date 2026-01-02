"use client"

import * as React from "react"
import { Monitor, Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                    <div className={`h-4 w-4 rounded-full ${theme === 'cyber-bunker' ? 'bg-[#cbfe00]' :
                            theme === 'royal-blue' ? 'bg-[#38bdf8]' :
                                theme === 'tokyo' ? 'bg-[#d946ef]' : 'bg-black'
                        }`} />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 bg-popover border-border text-popover-foreground">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Select Theme</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => setTheme("cyber-bunker")} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer focus:bg-accent">
                    <div className="h-8 w-12 rounded bg-[#0a0a0a] border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-1 left-1 w-6 h-1 bg-[#cbfe00]/50 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Cyber Bunker</span>
                        <span className="text-xs text-muted-foreground">Default Dark</span>
                    </div>
                    {theme === 'cyber-bunker' && <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("minimalist")} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer focus:bg-accent">
                    <div className="h-8 w-12 rounded bg-white border border-zinc-200 relative overflow-hidden">
                        <div className="absolute top-1 left-1 w-6 h-1 bg-black/10 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Minimalist</span>
                        <span className="text-xs text-muted-foreground">Clean Light</span>
                    </div>
                    {theme === 'minimalist' && <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("royal-blue")} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer focus:bg-accent">
                    <div className="h-8 w-12 rounded bg-[#0f172a] border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-1 left-1 w-6 h-1 bg-[#38bdf8]/50 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Royal Blue</span>
                        <span className="text-xs text-muted-foreground">Deep Navy</span>
                    </div>
                    {theme === 'royal-blue' && <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("tokyo")} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer focus:bg-accent">
                    <div className="h-8 w-12 rounded bg-[#09090b] border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-1 left-1 w-6 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Tokyo</span>
                        <span className="text-xs text-muted-foreground">Neon Night</span>
                    </div>
                    {theme === 'tokyo' && <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>}
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
