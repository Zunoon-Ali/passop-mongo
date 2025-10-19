import React, { useState } from "react";
import Passop from "./Passop";

const Navbar = () => {
  const [isHamburger, setIsHamburger] = useState(false);

  return (
    <nav className="bg-gray-800 sticky w-full top-0 left-0 z-50">
      <div className="myContainer px-2 md:px-12 lg:px-20 py-4 flex justify-evenly items-center gap-4">
        {/* Logo */}
        <Passop
          pColor="text-white"
          spanColor="text-green-500"
          textSize="text-xl md:text-2xl"
          pWeight="font-bold"
          spanWeight="font-normal"
        />

        {/* Desktop Links */}
        <ul className="gap-8 hidden md:flex">
          {["Home", "About", "Contact"].map((link, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="hover:text-white font-bold transition text-gray-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden cursor-pointer">
          <lord-icon
            src="https://cdn.lordicon.com/jectmwqf.json"
            trigger="click"
            stroke="bold"
            colors="primary:#ffffff,secondary:#66ee78"
            className="w-12 h-12 md:w-20 md:h-20"
            onClick={() => setIsHamburger((prev) => !prev)}
          ></lord-icon>
        </div>

        <div className="githubBtn py-2 px-2 md:py-2 md:px-4 bg-green-800 rounded-2xl flex items-center cursor-pointer hover:bg-green-700 transition ring-1 ring-white drop-shadow brightness-110">
          <img
            src="/github.png"
            alt="github"
            className="w-6 h-6 drop-shadow brightness-130 hover:drop-shadow hover:brightness-150"
          />
          <span className="text-gray-300 font-bold ml-1 md:ml-3 hover:text-gray-200">
            Github
          </span>
        </div>
      </div>

      {/* Mobile Links */}
      {isHamburger && (
        <ul className="flex flex-col gap-4 py-6 items-center bg-gray-700 md:hidden animate-slideDown z-10 absolute top-18 left-0 w-full">
          {["Home", "About", "Contact"].map((link, idx) => (
            <li key={idx}>
              <a
                href="#"
                className="hover:text-white font-bold transition text-gray-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
