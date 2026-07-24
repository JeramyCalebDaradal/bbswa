import { useEffect } from 'react'
import { initializeMsal } from '../auth/msal'

/**
 * MSAL Initialization Component
 * Runs once at app startup to initialize MSAL and handle redirect responses
 * This component renders null - it only performs side effects
 */
export default function MsalInitializer() {
  useEffect(() => {
    let mounted = true

    const initMsal = async () => {
      try {
        const initialized = await initializeMsal()
        if (mounted && initialized) {
          console.log('[MSAL] Initialized successfully')
        } else if (!mounted) {
          console.log('[MSAL] Initialization cancelled - component unmounted')
        }
      } catch (error) {
        console.error('[MSAL] Initialization failed:', error)
      }
    }

    initMsal()

    return () => {
      mounted = false
    }
  }, [])

  return null
}