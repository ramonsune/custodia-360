'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

export default function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in')
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getAnimationClass = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-8 opacity-0'
      case 'down':
        return '-translate-y-8 opacity-0'
      case 'left':
        return 'translate-x-8 opacity-0'
      case 'right':
        return '-translate-x-8 opacity-0'
      case 'scale':
        return 'scale-95 opacity-0'
      default:
        return 'translate-y-8 opacity-0'
    }
  }

  return (
    <>
      <style jsx global>{`
        .scroll-animate {
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .scroll-animate.animate-in {
          transform: translate(0) scale(1) !important;
          opacity: 1 !important;
        }

        /* Animaciones específicas para móvil */
        @media (max-width: 768px) {
          .scroll-animate {
            transition: all 0.4s ease-out;
          }
        }
      `}</style>

      <div
        ref={elementRef}
        className={`scroll-animate ${getAnimationClass()} ${className}`}
      >
        {children}
      </div>
    </>
  )
}

// Hook personalizado para detectar si es móvil
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}
