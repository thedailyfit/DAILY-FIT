"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Palette } from "lucide-react"

// Trainer Dashboard themes (original)
const trainerThemes = [
    {
        id: "cyber-bunker",
        name: "Cyber Bunker",
        description: "Dark Neon",
        preview: { bg: "#0a0a0a", accent: "#cbfe00", border: "#27272a" }
    },
    {
        id: "minimalist",
        name: "Minimalist",
        description: "Clean Light",
        preview: { bg: "#ffffff", accent: "#18181b", border: "#e4e4e7" }
    },
    {
        id: "royal-blue",
        name: "Royal Blue",
        description: "Premium Blue",
        preview: { bg: "#0f172a", accent: "#3b82f6", border: "#1e293b" }
    },
    {
        id: "carbon",
        name: "Carbon",
        description: "Monochrome Dark",
        preview: { bg: "#121212", accent: "#ffffff", border: "#333333" }
    }
]

// Gym Admin Dashboard themes (new)
const gymThemes = [
    {
        id: "carbon",
        name: "Carbon",
        description: "Monochrome Dark",
        preview: { bg: "#121212", accent: "#ffffff", border: "#333333" }
    },
    {
        id: "minimalist",
        name: "Minimal",
        description: "Clean Light",
        preview: { bg: "#ffffff", accent: "#18181b", border: "#e4e4e7" }
    },
    {
        id: "royal-gold",
        name: "Royal Gold",
        description: "Luxury Amber",
        preview: { bg: "#0c0a09", accent: "#f59e0b", border: "#44403c" }
    },
    {
        id: "neon-purple",
        name: "Neon Purple",
        description: "Gradient Glow",
        preview: { bg: "#0a0a0a", accent: "#a855f7", border: "#3f3f46", gradient: true }
    }
]

interface ThemeSwitcherProps {
    variant?: "trainer" | "gym"
}

export function ThemeSwitcher({ variant = "trainer" }: ThemeSwitcherProps) {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const themes = variant === "gym" ? gymThemes : trainerThemes
    const currentTheme = themes.find(t => t.id === theme) || themes[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full border border-border bg-card hover:bg-accent transition-all"
                >
                    <Palette className="h-4 w-4" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Select Theme
                </DropdownMenuLabel>

                {themes.map((t) => (
                    <DropdownMenuItem
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                    >
                        {/* Theme Preview */}
                        <div
                            className="h-10 w-14 rounded-md relative overflow-hidden border"
                            style={{
                                backgroundColor: t.preview.bg,
                                borderColor: t.preview.border
                            }}
                        >
                            {/* Accent bar */}
                            <div
                                className="absolute bottom-1 left-1 right-1 h-1.5 rounded-full"
                                style={{
                                    background: (t.preview as any).gradient
                                        ? `linear-gradient(90deg, ${t.preview.accent} 0%, #ec4899 100%)`
                                        : t.preview.accent
                                }}
                            />
                            {/* Mock content lines */}
                            <div
                                className="absolute top-1.5 left-1 w-4 h-1 rounded-full opacity-40"
                                style={{ backgroundColor: t.preview.accent }}
                            />
                            <div
                                className="absolute top-3.5 left-1 w-6 h-0.5 rounded-full opacity-20"
                                style={{ backgroundColor: t.preview.accent }}
                            />
                        </div>

                        {/* Theme Info */}
                        <div className="flex flex-col flex-1">
                            <span className="font-semibold text-sm">{t.name}</span>
                            <span className="text-xs text-muted-foreground">{t.description}</span>
                        </div>

                        {/* Selected indicator */}
                        {theme === t.id && (
                            <Check className="h-4 w-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
