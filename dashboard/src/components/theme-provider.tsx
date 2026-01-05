"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="data-theme"
            defaultTheme="cyber-bunker"
            themes={["cyber-bunker", "carbon", "minimalist", "royal-blue", "royal-gold", "ember", "neon-purple"]}
            enableSystem={false}
            disableTransitionOnChange={false}
        >
            {children}
        </NextThemesProvider>
    )
}
