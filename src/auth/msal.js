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
      logLevel: import.meta.env.DEV ? 3 : 1,
    },
  },
}

// Login request - requests access token for our backend API
const loginRequest = {
  scopes: [
    `api://${import.meta.env.VITE_MSAL_CLIENT_ID || ''}/access_as_user`,
    'openid',
    'profile',
    'email',
    'User.Read',
  ],
  prompt: 'select_account',
}

// Silent request for token renewal
const silentRequest = {
  scopes: [
    `api://${import.meta.env.VITE_MSAL_CLIENT_ID || ''}/access_as_user`,
    'openid',
    'profile',
    'email',
    'User.Read',
  ],
}

// Initialize MSAL
export const msalInstance = new PublicClientApplication(msalConfig)

// Initialize MSAL and handle redirect response
export async function initializeMsal() {
  try {
    await msalInstance.initialize()
    
    // Handle redirect promise (for redirect flow)
    const response = await msalInstance.handleRedirectPromise()
    if (response) {
      console.log('[MSAL] Redirect handled, user:', response.account?.username)
    }
    
    // Set active account if exists
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0])
      console.log('[MSAL] Active account set:', accounts[0].username)
    }
    
    return true
  } catch (error) {
    console.error('[MSAL] Initialization failed:', error)
    return false
  }
}

// Login with redirect (recommended for SPA)
export function loginRedirect() {
  msalInstance.loginRedirect({
    ...loginRequest,
    redirectUri: `${window.location.origin}/auth/callback`,
  })
}

// Login with popup (alternative)
export async function loginPopup() {
  try {
    const response = await msalInstance.loginPopup({
      ...loginRequest,
      redirectUri: `${window.location.origin}/auth/callback`,
    })
    msalInstance.setActiveAccount(response.account)
    return response
  } catch (error) {
    console.error('[MSAL] Popup login failed:', error)
    throw error
  }
}

// Logout
export function logout() {
  const account = msalInstance.getActiveAccount()
  if (account) {
    msalInstance.logoutRedirect({
      account,
      postLogoutRedirectUri: `${window.location.origin}/`,
    })
  }
}

// Get access token for backend API (silent if possible)
export async function getAccessToken() {
  const account = msalInstance.getActiveAccount()
  if (!account) {
    throw new Error('No active account')
  }

  try {
    // Try silent first
    const response = await msalInstance.acquireTokenSilent({
      ...silentRequest,
      account,
    })
    return response.accessToken
  } catch (silentError) {
    // If silent fails, try popup
    if (silentError.name === 'InteractionRequiredAuthError') {
      try {
        const response = await msalInstance.acquireTokenPopup({
          ...silentRequest,
          account,
        })
        return response.accessToken
      } catch (popupError) {
        console.error('[MSAL] Popup token acquisition failed:', popupError)
        throw popupError
      }
    }
    throw silentError
  }
}

// Get ID token (for user info)
export async function getIdToken() {
  const account = msalInstance.getActiveAccount()
  if (!account) return null
  return account.idToken || null
}

// Get current account
export function getAccount() {
  return msalInstance.getActiveAccount()
}

// Check if user is authenticated
export function isAuthenticated() {
  return msalInstance.getAllAccounts().length > 0
}

// Subscribe to MSAL events - returns unsubscribe function
export function addEventCallback(callback) {
  const callbackId = msalInstance.addEventCallback((message) => {
    callback(message)
  })
  // Return unsubscribe function
  return () => {
    if (callbackId) {
      msalInstance.removeEventCallback(callbackId)
    }
  }
}

// Get interaction status
export function getInteractionStatus() {
  return msalInstance.getInteractionStatus()
}

export { msalConfig, loginRequest, silentRequest }