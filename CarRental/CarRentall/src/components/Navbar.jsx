import React from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <div className="flex justify-between items-center">
      <Link to="/">
        <img src={assets.logo} alt="Roadtripper Logo" className="h-16 w-auto" />
      </Link>
      
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-500 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;