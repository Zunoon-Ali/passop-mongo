import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import Passop from "./Passop"; // logo component

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm h-[10vh] w-full flex items-center">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-6">
        
        {/* Logo */}
        <Passop
          pColor="text-white"
          spanColor="text-green-500"
          textSize="text-xl"
          pWeight="font-bold"
          spanWeight="font-normal"
        />

        {/* Social icons */}
        <div className="flex gap-4 text-lg">
          <a href="https://github.com/" target="_blank" className="hover:text-green-400">
            <FaGithub />
          </a>
          <a href="https://twitter.com/" target="_blank" className="hover:text-green-400">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/" target="_blank" className="hover:text-green-400">
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 hidden md:block">
          © {new Date().getFullYear()} Passop
        </p>
      </div>
    </footer>
  );
};

export default Footer;
