import { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

const Collapse = ({
  index,
  title,
  isCollapsed,
  changeCollapsedHandler,
  aditionalHeightProperties,
  children,
}) => {
  const [childHeight, setChildHeight] = useState(0);
  const childContainer = useRef(null);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (childContainer.current)
        setChildHeight(childContainer.current.children[0].clientHeight);
    });
  }, []);

  useEffect(() => {
    if (childContainer.current)
      setChildHeight(childContainer.current.children[0].clientHeight);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childContainer, ...aditionalHeightProperties]);

  return (
    <div
      className={`w-full my-4 rounded-lg relative bg-white before:absolute before:w-full before:h-full before:top-0 before:left-0 before:-z-10 before:blur-sm ${
        isCollapsed
          ? "before:bg-slate-300"
          : "before:bg-gradient-to-r before:from-indigo-500 before:to-fuchsia-500"
      }`}
    >
      <button
        className="w-full p-4 flex items-center justify-between bg-transparent"
        onClick={() =>
          changeCollapsedHandler((activeIndex) =>
            activeIndex === index ? -1 : (activeIndex = index)
          )
        }
      >
        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">
          {title}
        </h3>
        <RiArrowDownSLine
          className={`transition-transform duration-500 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
          color="#d946ef"
          size="24px"
        ></RiArrowDownSLine>
      </button>
      <div
        ref={childContainer}
        style={{ height: `${isCollapsed ? 0 : childHeight}px` }}
        className={`${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-all duration-500 bg-transparent relative`}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
