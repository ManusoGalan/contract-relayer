import React, { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

const Select = ({ labelText, noValueOption, options, value, valueHandler }) => {
  const [shownMenu, changeShownMenu] = useState(false);

  const onOptionClick = (e) => {
    valueHandler(e.target.attributes["data-value"].value);
    changeShownMenu(false);
  };

  return (
    <label className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent mb-4 block">
      {labelText}
      <div className="mt-2">
        <div className="relative bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5 rounded-full mr-4 w-full">
          <button
            className="bg-white rounded-full w-full px-4 py-2 text-black flex items-center justify-between"
            onClick={() => {
              changeShownMenu(!shownMenu);
            }}
          >
            <span className="truncate">
              {!value
                ? noValueOption
                : options.find((option) => option.value === value).displayName}
            </span>
            <RiArrowDownSLine
              className={`transition-transform duration-500 ${
                shownMenu ? "rotate-180" : "rotate-0"
              }`}
              color="#d946ef"
              size="24px"
            ></RiArrowDownSLine>
          </button>
          <div
            className={`${
              !shownMenu ? "hidden" : ""
            } bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5 rounded-md w-full mt-2 absolute top-full z-10`}
          >
            <div className="bg-white rounded-md w-full px-4 py-2">
              {options.map((option, index) => (
                <SelectOption
                  key={`select-input-${index}`}
                  clickHandler={onOptionClick}
                  optionData={option}
                ></SelectOption>
              ))}
            </div>
          </div>
        </div>
      </div>
    </label>
  );
};

const SelectOption = ({ clickHandler, optionData }) => {
  return (
    <button
      onClick={clickHandler}
      data-value={optionData.value}
      className="block text-left w-full font-bold text-black hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-500"
    >
      <span className="truncate pointer-events-none">{optionData.displayName}</span>
    </button>
  );
};

export default Select;
