// MSAL redirect handling is owned by MsalInitializer (which mounts globally
// in App.jsx). This page just shows a loading state while MsalInitializer
// processes the redirect result and navigates to /dashboard or /login.
export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  )
}
