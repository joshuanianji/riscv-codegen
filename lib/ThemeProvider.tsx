import React, { createContext, useState } from 'react'
import { GeistProvider, CssBaseline } from '@geist-ui/react'

/**
 * Wrapper for the GeistProvider that also allows for the manipulation of the theme
 */

interface Context {
    theme: Theme,
    switchTheme: () => void,
}

type Theme = 'dark' | 'light';

const defaultCtx: Context = { theme: 'dark', switchTheme: () => { } }

const ThemeContext: React.Context<Context> = createContext(defaultCtx);


const ThemeProvider: React.FC = ({ children }) => {
    const [themeType, setThemeType] = useState<Theme>('dark')
    const switchTheme = () => {
        const newTheme = themeType === 'dark' ? 'light' : 'dark'
        setThemeType(newTheme)
    }

    const value: Context = { theme: themeType, switchTheme }

    return (
        <ThemeContext.Provider value={value}>
            <GeistProvider themeType={themeType}>
                <CssBaseline />
                {children}
            </GeistProvider>
        </ThemeContext.Provider>
    )
}

const useThemeProvider = (): Context => {
    const context = React.useContext(ThemeContext)
    return context
}

export { ThemeProvider, useThemeProvider }