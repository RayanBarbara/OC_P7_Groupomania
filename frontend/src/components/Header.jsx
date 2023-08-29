import { Link } from "react-router-dom";

import logo from "../assets/images/logo.png";

function Header({ props_isLogged }) {

  const handleLogout = (event) => {
    event.preventDefault();
    sessionStorage.clear();
  };

  return (
    <header>
      <img id="logo" alt="Logo of the Groupomania group." src={logo} />

      {props_isLogged ? (
        <nav className="mainNav">
          <ul className="mainNav__menu">
            <li className="mainNav__menu-item" aria-current="page" rel="follow">
              <Link className="mainNav__menu-item-link" rel="follow" aria-current="page" to="/publications">
                Feed
              </Link>
            </li>

            <li className="mainNav__menu-item" aria-current="page" rel="follow">
              <Link className="mainNav__menu-item-link" rel="follow" aria-current="page" to="/settings">
                Settings
              </Link>
            </li>

            <li onClick={handleLogout} className="mainNav__menu-item" aria-current="page" rel="follow">
              <Link className="mainNav__menu-item-link" rel="follow" aria-current="page" to="/login">
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      ) : (
        <span></span>
      )}

    </header>
  );
}

export default Header;
