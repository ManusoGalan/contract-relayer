import { useState } from "react";
import Collapse from "./Collapse";

const Accordion = ({ collapses }) => {
  const [activeCollapse, changeActiveCollapse] = useState(-1);

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      {collapses.map((collapse, index) => {
        return (
          <Collapse
            key={`accordion-collapse-${index}`}
            index={index}
            title={collapse.title}
            isCollapsed={index === activeCollapse ? false : true}
            changeCollapsedHandler={changeActiveCollapse}
            aditionalHeightProperties={collapse.heightState}
          >
            {collapse.content}
          </Collapse>
        );
      })}
    </div>
  );
};

export default Accordion;
