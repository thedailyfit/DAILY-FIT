"use client"

import * as React from "react"

const THEME_KEY = "dailyfit-theme"

type Theme = "cyber-bunker" | "minimalist" | "royal-blue" | "carbon"

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "cyber-bunker",
    setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "cyber-bunker",
    storageKey = THEME_KEY,
    ...props
}: {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
} & React.ComponentProps<"div">) {
    const [theme, setTheme] = React.useState<Theme>(
        () => (typeof window !== "undefined" ? (localStorage.getItem(storageKey) as Theme) || defaultTheme : defaultTheme)
    )

    React.useEffect(() => {
        const root = window.document.documentElement

        // Remove old theme attributes
        root.removeAttribute("data-theme")

        if (theme === "cyber-bunker") {
            // Default behavior (root vars)
            // We don't need a data-attribute for default, 
            // OR we can explicitly set it if our CSS requires it.
            // Based on globals.css, :root handles default.
            // But adding it doesn't hurt if we want specific overrides.
            // Let's leave it empty for default to match :root
        } else {
            root.setAttribute("data-theme", theme)
        }

        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = React.useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
