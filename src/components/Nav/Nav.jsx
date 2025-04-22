// import React, { useState } from 'react'
// import "./Nav.css"
// import logo from "../../assets/logo.jpeg"
// import { Link } from "react-scroll"

// function Nav() {
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   const handleMouseEnter = (dropdownName) => {
//     setActiveDropdown(dropdownName);
//   };

//   const handleMouseLeave = () => {
//     setActiveDropdown(null);
//   };

//   // Example dropdown items - replace with your actual data
//   const peopleDropdown = [" Connect" ," Founder", " Owner"];
//   const businessDropdown = [" Overview", " Products"];

//   return (
//     <nav>
//       <div className="nav">
//         <div className="logo">
//           {/* <img src={logo} alt="logo" /> */}
//           <h1>Raipur Metaliks</h1>
//         </div>
//         <ul>
//           <Link to="home" activeClass='active' spy={true} smooth={true}><li>Home</li></Link>
//           <Link to="about" activeClass='active' spy={true} smooth={true}><li>About Us</li></Link>
//           {/* <Link to="about" activeClass='active' spy={true} smooth={true}>
//           <li 
//             className="dropdown-parent"
//             onMouseEnter={() => handleMouseEnter('people')}
//             onMouseLeave={handleMouseLeave}>
//             People
//             {activeDropdown === 'people' && (
//               <ul className="dropdown-menu">
//                 {peopleDropdown.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </li>
//           </Link> */}
//           <Link to="business" activeClass='active' spy={true} smooth={true}>
//           <li 
//             className="dropdown-parent"
//             onMouseEnter={() => handleMouseEnter('business')}
//             onMouseLeave={handleMouseLeave}
//           >
//             Business
//             {activeDropdown === 'business' && (
//               <ul className="dropdown-menu">
//                 {businessDropdown.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             )}
//           </li>
//           </Link>
//           {/* <Link to="faq" activeClass='active' spy={true} smooth={true}><li>FAQ</li></Link> */}
//           <Link to="contact" activeClass='active' spy={true} smooth={true}><li>Contact Us</li></Link>
//         </ul>
//       </div>
//     </nav>
//   )
// }

// export default Nav
import React, { useState, useEffect } from 'react'
import "./Nav.css"
import logo from "../../assets/logo.jpeg"
import { Link } from "react-scroll"

function Nav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check window width on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleMouseEnter = (dropdownName) => {
    if (!isMobile) {
      setActiveDropdown(dropdownName);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (dropdownName) => {
    if (isMobile) {
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Example dropdown items - replace with your actual data
  const businessDropdown = [" Overview", " Products"];

  return (
    <nav>
      <div className="nav">
        <div className="logo">
          {/* <img src={logo} alt="logo" /> */}
          <h1>Raipur Metaliks</h1>
        </div>
        
        <div className="menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul className={mobileMenuOpen ? "active" : ""}>
          <Link to="home" activeClass='active' spy={true} smooth={true} onClick={handleLinkClick}>
            <li>Home</li>
          </Link>
          <Link to="about" activeClass='active' spy={true} smooth={true} onClick={handleLinkClick}>
            <li>About Us</li>
          </Link>
          <Link to="business" activeClass='active' spy={true} smooth={true} onClick={handleLinkClick}>
            <li 
              className="dropdown-parent"
              onMouseEnter={() => handleMouseEnter('business')}
              onMouseLeave={handleMouseLeave}
              onClick={() => toggleDropdown('business')}
            >
              Business
              {activeDropdown === 'business' && (
                <ul className="dropdown-menu">
                  {businessDropdown.map((item, index) => (
                    <li key={index} onClick={handleLinkClick}>{item}</li>
                  ))}
                </ul>
              )}
            </li>
          </Link>
          <Link to="contact" activeClass='active' spy={true} smooth={true} onClick={handleLinkClick}>
            <li>Contact Us</li>
          </Link>
        </ul>
      </div>
    </nav>
  )
}

export default Nav