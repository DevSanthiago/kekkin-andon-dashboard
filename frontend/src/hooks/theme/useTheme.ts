import { useCallback, useSyncExternalStore } from 'react'
import { STORAGE_KEYS } from '../../constants/storage/storageKeys'

export type Theme = 'dark' | 'light'

const listeners = new Set<() => void>()

function readInitialTheme(): Theme {
  return localStorage.getItem(STORAGE_KEYS.THEME) === 'light' ? 'light' : 'dark'
}

let currentTheme: Theme = readInitialTheme()

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

applyTheme(currentTheme)

function setTheme(theme: Theme) {
  currentTheme = theme
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
  applyTheme(theme)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => currentTheme)

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme }
}
