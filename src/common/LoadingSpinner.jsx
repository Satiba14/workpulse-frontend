const LoadingSpinner = ({ color = 'cyan' }) => (
  <div className="flex items-center justify-center h-48">
    <div className={`animate-spin rounded-full h-10 w-10
                    border-b-2 border-${color}-500`} />
  </div>
);

export default LoadingSpinner;