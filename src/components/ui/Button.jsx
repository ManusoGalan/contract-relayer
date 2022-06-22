import Spinner from "../svg/Spinner"

const Button = ({disabledCondition, onClickHandler, children}) => {
  return (
        <button
          disabled={disabledCondition}
          className="group bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5 rounded-full font-semibold text-white my-4 sm:mx-4 max-w-xs"
          onClick={onClickHandler}
        >
          <div className={`transition-colors p-3.5 rounded-full bg-white ${disabledCondition ? '' : 'group-hover:bg-transparent'}`}>
            {disabledCondition ? <Spinner></Spinner> : <span className="font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-transparent bg-clip-text group-hover:text-white">{children}</span>}
          </div>
        </button>
  )
}

export default Button