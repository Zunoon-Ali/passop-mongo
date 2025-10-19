import React from "react";

const Passop = ({
  pColor = "text-gray-800",     // parent <p> ya <h1> ka color
  spanColor = "text-green-500", // PASSOP ka span color
  textSize = "text-3xl",        // font size
  pWeight = "font-bold",        // parent weight
  spanWeight = "font-normal",   // <> aur </> ka weight
}) => {
  return (
    <div className={`logo ${textSize} ${pWeight}`}>
      <p className={pColor}>
        <span className={spanWeight}>&lt;</span>
        PASS<span className={spanColor}>OP</span>
        <span className={spanWeight}>/&gt;</span>
      </p>
    </div>
  );
};

export default Passop;
