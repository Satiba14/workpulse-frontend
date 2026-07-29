const Modal = ({ title, onClose, children, maxWidth = 'max-w-2xl' }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center
                  justify-center z-50 p-4">
    <div className={`bg-white rounded-3xl shadow-2xl w-full
                     ${maxWidth} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between p-6
                      border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold
                     w-8 h-8 flex items-center justify-center rounded-lg
                     hover:bg-gray-100"
        >
          ×
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;