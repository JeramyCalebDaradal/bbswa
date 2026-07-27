// MSAL Configuration for Microsoft Entra ID
// This file contains the MSAL instance and authentication helpers

import { PublicClientApplication, EventType, InteractionStatus } from '@azure/msal-browser'

// MSAL Configuration - will be populated from environment
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID || 'common'}`,
    redirectUri: `${window.location.origin}/auth/callback`,
    postLogoutRedirectUri: `${window.location.origin}/`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return
        switch (level) {
          case 0: // Error
            console.error('[MSAL]', message)
            break
          case 1: // Warning
            console.warn('[MSAL]', message)
            break
          case 2: // Info
            console.info('[MSAL]', message)
            break
          case 3: // Verbose
            console.debug('[MSAL]', message)
            break
        }
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
}

let msalInstance = null
let isInitializing = false
let initializationPromise = null
let restorePromise = null

export function getMsalInstance() {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig)
  }
  return msalInstance
}

export async function initializeMsal() {
  if (initializationPromise) return initializationPromise

  isInitializing = true
  initializationPromise = (async () => {
    try {
      const instance = getMsalInstance()
      await instance.initialize()
      isInitializing = false
      return true
    } catch (err) {
      isInitializing = false
      initializationPromise = null
      console.error('[MSAL] Initialization failed:', err)
      return false
    }
  })()

  return initializationPromise
}

/**
 * Restore MSAL account on app startup - called once when app loads
 * This enables persistent sessions across page refreshes
 */
export async function restoreSession() {
  if (restorePromise) return restorePromise

  restorePromise = (async () => {
    try {
      const instance = getMsalInstance()
      const accounts = instance.getAllAccounts()

      if (accounts.length > 0) {
        // Account exists in cache, session can be restored
        // The active account will be used for silent token acquisition
        console.log('[MSAL] Session restored, account found:', accounts[0].username)
        return accounts[0]
      }

      console.log('[MSAL] No cached account found')
      return null
    } catch (err) {
      console.error('[MSAL] Session restore failed:', err)
      return null
    }
  })()

  return restorePromise
}

export async function loginRedirect() {
  // Make sure MSAL is initialized AND any pending redirect from a previous
  // navigation has been processed (which clears the interaction_in_progress
  // flag from sessionStorage). Without this, calling loginRedirect while the
  // flag is stale throws BrowserAuthError: interaction_in_progress.
  await initializeMsal()
  const instance = getMsalInstance()
  try {
    await instance.handleRedirectPromise()
  } catch (err) {
    console.warn('[MSAL] handleRedirectPromise before login failed:', err)
  }

  if (isInteractionInProgress()) {
    console.warn('[MSAL] loginRedirect called while interaction in progress; ignoring')
    return
  }

  const clientId = import.meta.env.VITE_MSAL_CLIENT_ID
  // Request the backend API scope during login so consent is granted upfront.
  // This ensures acquireTokenSilent for api://<clientId>/.default succeeds later.
  const scopes = ['User.Read']
  if (clientId) {
    scopes.push(`api://${clientId}/.default`)
  }
  return instance.loginRedirect({
    scopes,
    prompt: 'select_account',
  })
}

export function logoutRedirect() {
  const instance = getMsalInstance()
  return instance.logoutRedirect({
    postLogoutRedirectUri: `${window.location.origin}/`,
  })
}

export function getAccount() {
  const instance = getMsalInstance()
  const accounts = instance.getAllAccounts()
  if (accounts.length === 0) return null
  return accounts[0]
}

export function getActiveAccount() {
  const instance = getMsalInstance()
  return instance.getActiveAccount()
}

export function setActiveAccount(account) {
  const instance = getMsalInstance()
  if (account) {
    instance.setActiveAccount(account)
  }
}

export async function getAccessToken(scopes = ['User.Read']) {
  // Ensure MSAL is fully initialized before any token operations.
  // Silent/interactive APIs will throw otherwise, and acquireTokenRedirect
  // called before initialize() can leave a stale interaction_in_progress flag.
  await initializeMsal()

  const instance = getMsalInstance()
  const account = getActiveAccount() || getAccount()

  if (!account) {
    throw new Error('No active account')
  }

  try {
    const response = await instance.acquireTokenSilent({
      scopes,
      account,
    })
    return response.accessToken
  } catch (silentErr) {
    // Silent acquisition failed — token expired or consent required
    if (silentErr.name === 'InteractionRequiredAuthError' || silentErr.name === 'ServerError') {
      // Guard: never start a new interactive redirect while one is already
      // in progress. Doing so throws BrowserAuthError: interaction_in_progress
      // and leaves MSAL in a wedged state.
      if (isInteractionInProgress()) {
        console.warn('[MSAL] Silent token failed but interaction already in progress; skipping redirect')
        throw silentErr
      }
      console.log('[MSAL] Silent token acquisition failed, falling back to interactive redirect')
      // acquireTokenRedirect navigates away — this promise never resolves.
      await instance.acquireTokenRedirect({ scopes, account })
      // Should not reach here; return to satisfy the type contract.
      throw silentErr
    }
    throw silentErr
  }
}

export function addEventCallback(callback) {
  const instance = getMsalInstance()
  return instance.addEventCallback(callback)
}

export function getInteractionStatus() {
  const instance = getMsalInstance()
  return instance.getInteractionStatus()
}

export function isInteractionInProgress() {
  return getInteractionStatus() === InteractionStatus.InProgress
}

export { EventType, InteractionStatus }