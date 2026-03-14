import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeProvider"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { mode, toggleMode, resolvedMode } = useTheme()
  const [isDark, setIsDark] = useState(resolvedMode === "dark")
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsDark(resolvedMode === "dark")
  }, [resolvedMode])

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    // Aplicar tema imediatamente - a animação é apenas visual
    toggleMode()

    // Se não suporta View Transition API, termina aqui
    if (typeof document.startViewTransition !== "function") {
      return
    }

    // Animação circular do clique
    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {})
      })

      const ready = transition?.ready
      if (ready && typeof ready.then === "function") {
        ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          )
        }).catch(() => {
          // Falha na animação é OK, tema já foi aplicado
        })
      }
    } catch (error) {
      // Se a animação falhar, o tema já foi aplicado
      console.debug('View transition animation failed:', error)
    }
  }, [toggleMode, duration])

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
