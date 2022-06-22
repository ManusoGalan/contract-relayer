import Spinner from "../svg/Spinner";
import { RiCheckboxCircleFill, RiCloseCircleFill } from "react-icons/ri";
import Popover from "./Popover";

const InputWithVerification = ({
  labelText,
  value,
  valueHandler,
  validator,
  validationIcon,
  validationIconHandler,
  name,
  helpText,
}) => {
  let intervalInput = null;

  const validatorWrapper = (e) => {
    if (intervalInput) clearTimeout(intervalInput);

    validationIconHandler(<Spinner></Spinner>);

    intervalInput = setTimeout(async () => {
      validationIconHandler(
        (await validator(e)) ? (
          <RiCheckboxCircleFill
            color="#16a34a"
            size={24}
          ></RiCheckboxCircleFill>
        ) : (
          <RiCloseCircleFill color="#dc2626" size={24}></RiCloseCircleFill>
        )
      );

      if (e.target.value === "") validationIconHandler("");
    }, 1000);

    valueHandler(e.target.value);
  };

  return (
    <label className="mb-4 block">
      {helpText ? (
        <div className="flex items-center">
          <span className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent mr-2">{labelText}</span>
          <Popover text={helpText}></Popover>
        </div>
      ) : (
        <span className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          {labelText}
        </span>
      )}
      <div className="flex items-center mt-2">
        <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5 rounded-full mr-4 w-full">
          <input
            name={name}
            value={value}
            onInput={validatorWrapper}
            className="font-semibold w-full rounded-full focus-visible:outline-none px-4 py-2 text-black bg-clip-border"
            type="text"
          ></input>
        </div>
        {validationIcon}
      </div>
    </label>
  );
};

export default InputWithVerification;
