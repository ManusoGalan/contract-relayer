import { RiQuestionLine } from "react-icons/ri"

const Popover = ({text}) => {
  return (
    <span className="group relative">
      <RiQuestionLine color="#d946ef" size="16px" className="cursor-pointer inline"></RiQuestionLine>
      <div className="w-52 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 absolute bg-gradient-to-r from-indigo-500 to-fuchsia-500 ml-1 left-full top-2/4 -translate-y-2/4 rounded-lg p-0.5">
        <div className="bg-white rounded-lg p-2 text-center">
          <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">{text}</span>
        </div>
      </div>
    </span>
  )
}

export default Popover