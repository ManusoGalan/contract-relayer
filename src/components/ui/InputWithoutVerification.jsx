const InputWithoutVerification = ({
  labelText,
  value,
  valueHandler,
  name
}) => {
  return (
    <label className="mb-4 block">
      <span className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">{labelText}</span>
      <div className="flex items-center mt-2">
        <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5 rounded-full w-full">
          <input
            name={name}
            value={value}
            onInput={valueHandler}
            className="font-semibold w-full rounded-full focus-visible:outline-none px-4 py-2 text-black bg-clip-border"
            type="text"
          ></input>
        </div>
      </div>
    </label>
  );
};

export default InputWithoutVerification;
