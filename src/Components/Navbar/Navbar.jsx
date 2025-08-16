/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from '../../assets/bgremovelogo.png'
const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navlinks = (
    <>
      <li><NavLink className="text-xl" to="/">Invoice Generator </NavLink></li>
  
    </>
  );

  return (
    <div className="navbar flex items-center md:justify-evenly w-full">
      <div className="flex justify-between items-center w-full lg:w-auto">
        <button
          onClick={toggleDrawer}
          className="btn btn-ghost lg:hidden"
        >
          {isDrawerOpen ? <RiCloseLine className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
        </button>
        <img className="w-20 h-20" src={logo} alt="" />
      </div>
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:hidden`}>
        <div className="p-4 flex items-center">
          <button onClick={toggleDrawer} className="btn btn-ghost absolute top-4 left-4">
            <RiCloseLine className="text-2xl" />
          </button>
        </div>
        <ul className="menu p-4 text-black">
          {navlinks}
        </ul>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-black">
          {navlinks}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
