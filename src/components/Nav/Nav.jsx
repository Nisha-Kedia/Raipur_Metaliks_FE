import React, { useState } from 'react'
import "./Nav.css"
import logo from "../../assets/logo.jpeg"
import { Link } from "react-scroll"

function Nav() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Example dropdown items - replace with your actual data
  const peopleDropdown = [" Connect" ," Founder", " Owner"];
  const businessDropdown = [" Overview", " Products"];

  return (
    <nav>
      <div className="nav">
        <div className="logo">
          {/* <img src={logo} alt="logo" /> */}
          <h1>Raipur Metaliks</h1>
        </div>
        <ul>
          <Link to="home" activeClass='active' spy={true} smooth={true}><li>Home</li></Link>
          <Link to="about" activeClass='active' spy={true} smooth={true}><li>About Us</li></Link>
          {/* <Link to="about" activeClass='active' spy={true} smooth={true}>
          <li 
            className="dropdown-parent"
            onMouseEnter={() => handleMouseEnter('people')}
            onMouseLeave={handleMouseLeave}>
            People
            {activeDropdown === 'people' && (
              <ul className="dropdown-menu">
                {peopleDropdown.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </li>
          </Link> */}
          <Link to="business" activeClass='active' spy={true} smooth={true}>
          <li 
            className="dropdown-parent"
            onMouseEnter={() => handleMouseEnter('business')}
            onMouseLeave={handleMouseLeave}
          >
            Business
            {activeDropdown === 'business' && (
              <ul className="dropdown-menu">
                {businessDropdown.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </li>
          </Link>
          {/* <Link to="faq" activeClass='active' spy={true} smooth={true}><li>FAQ</li></Link> */}
          <Link to="contact" activeClass='active' spy={true} smooth={true}><li>Contact Us</li></Link>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
