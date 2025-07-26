const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 ${sizes[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;