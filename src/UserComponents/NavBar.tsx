import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-color1 p-6 dark:bg-darkColor2">
      <div className="container mx-auto flex flex-wrap items-center justify-between md:justify-center">
        <div className="w-full flex justify-between md:hidden">
          <h1 className="text-white font-montserrat font-bold text-lg">TrackMyJob</h1>
          <button
            className="text-white focus:outline-none"
            onClick={() => {
              const menu = document.getElementById('mobile-menu');
              if (menu) menu.classList.toggle('hidden');
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <ul
          id="mobile-menu"
          className="hidden w-full md:flex md:w-auto md:space-x-16 md:items-center md:justify-center"
        >
          <li className="transition-transform duration-500 ease-in-out transform hover:scale-125 font-montserrat font-bold">
            <Link to="/TableComponent" className="text-white block py-2 md:py-0">
              Dashboard
            </Link>
          </li>
          <li className="transition-transform duration-500 ease-in-out transform hover:scale-125 font-montserrat font-bold">
            <Link to="/Profile" className="text-white block py-2 md:py-0">
              Profile
            </Link>
          </li>
          <li className="transition-transform duration-500 ease-in-out transform hover:scale-125 font-montserrat font-bold">
            <Link to="/Settings" className="text-white block py-2 md:py-0">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;