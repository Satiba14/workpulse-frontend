import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  title        = "Are you sure?",
  message      = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  confirmClass = "bg-red-500 hover:bg-red-600 text-white",
  onConfirm,
  onCancel,
  loading      = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel}/>

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-500"/>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;