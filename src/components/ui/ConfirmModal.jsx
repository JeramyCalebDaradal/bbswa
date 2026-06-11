export default function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
  isConfirming = false,
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  confirmingLabel = 'Loading...',
}) {
  if (!open) return null

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={() => (isConfirming ? null : onCancel?.())}
        aria-label="Close"
      />
      <section
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <section className="text-sm text-gray-700">{message}</section>

        <section className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => onCancel?.()}
            disabled={isConfirming}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => onConfirm?.()}
            disabled={isConfirming}
          >
            {isConfirming ? confirmingLabel : confirmLabel}
          </button>
        </section>
      </section>
    </section>
  )
}
