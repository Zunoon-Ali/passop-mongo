import { useRef } from "react";

const PasswordBtn = () => {
  const iconRef = useRef(null);

  const handleClick = () => {
    if (iconRef.current) {
      iconRef.current.play(); // click pe play kare
    }
  };

  const handleHover = () => {
    if (iconRef.current) {
      iconRef.current.play(); // button hover pe bhi play kare
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleHover}
      className="bg-green-500 px-4 py-2 hover:bg-green-400 rounded-2xl flex items-center justify-center text-white font-semibold gap-1"
    >
      <lord-icon
        src="https://cdn.lordicon.com/vjgknpfx.json"
        trigger="hover"
        stroke="bold"
        state="hover-swirl"
        colors="primary:#FFFFFF,secondary:#1B8501"
        style={{ width: "30px", height: "30px" }}
      ></lord-icon>
      ADD PASSWORD
    </button>
  );
};

export default PasswordBtn;
