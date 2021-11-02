import { Button } from '@geist-ui/react'
import { useThemeProvider } from '@lib/ThemeProvider'
import { Moon, Sun } from '@geist-ui/react-icons'


// literally only toggles the theme


const ThemeToggle: React.FC = () => {
    const { theme, switchTheme } = useThemeProvider()

    const icon = theme === 'dark' ? <Sun /> : <Moon />

    return (
        <Button iconRight={icon} auto scale={1 / 2} onClick={() => switchTheme()} />
    )

}

export default ThemeToggle