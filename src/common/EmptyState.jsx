const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-16">
    {Icon && <Icon size={40} className="text-gray-300 mx-auto mb-3" />}
    <p className="text-gray-400 font-medium text-sm">{message}</p>
  </div>
);

export default EmptyState;