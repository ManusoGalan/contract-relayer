const Alert = ({ condition, children }) => {
  return (
    <div
      className={`fixed transition-all duration-500 bottom-4 ${
        condition ? "right-4" : "-right-full"
      } bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5 rounded max-w-xs`}
      role="alert"
    >
      <div className="bg-white px-4 py-3 rounded">
        {children}
      </div>
    </div>
  );
};

export default Alert;
