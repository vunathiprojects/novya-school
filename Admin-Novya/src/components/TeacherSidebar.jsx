import React, { useState, useEffect } from "react";
import { Nav, Offcanvas, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaRegEnvelope,
  FaUserPlus,
  FaSearch,
} from "react-icons/fa";

const TeacherSidebar = ({ showSidebar, darkMode, setShowSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState([]);
  const [activeItem, setActiveItem] = useState("Overview");

  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ MENU LIST
  const menuItems = [
    { name: "Overview", icon: <FaTachometerAlt />, path: "dashboard" },
    //{ name: "Teacher Enquiries", icon: <FaUsers />, path: "enquiries" },
    { name: "Support", icon: <FaRegEnvelope />, path: "support" },
    { name: "Teacher Registration", icon: <FaUserPlus />, path: "registration" },
  ];

  // ⭐ Highlight Active Menu
  useEffect(() => {
    const currentPath = location.pathname.split("/")[2]; // example → "support"
    const currentItem = menuItems.find((item) => item.path === currentPath);
    setActiveItem(currentItem ? currentItem.name : "Overview");
  }, [location.pathname]);

  // ⭐ Navigate to menu item
  const handleMenuItemClick = (item) => {
    navigate(`/teacher/${item.path}`);

    if (window.innerWidth <= 992) setShowSidebar(false);
  };

  // ⭐ Filter menu with search
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ⭐ Slide-in animation
  useEffect(() => {
    setVisibleItems([]);
    filteredItems.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * 60);
    });
  }, [searchQuery]);

  return (
    <Offcanvas
      show={showSidebar}
      onHide={() => setShowSidebar(false)}
      responsive="lg"
      className="sidebar"
      backdrop={false}
    >
      {/* HEADER */}
      <Offcanvas.Header
        closeButton
        closeVariant={darkMode ? "white" : undefined}
      >
        <h4>NOVYA</h4>
      </Offcanvas.Header>

      {/* BODY */}
      <Offcanvas.Body
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* SEARCH BAR */}
        <Form className="mb-3">
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Form>

        {/* MENU ITEMS */}
        <Nav className="flex-column">
          {filteredItems.map((item, index) => {
            const isActive = activeItem === item.name;

            return (
              <Nav.Link
                key={item.name}
                onClick={() => handleMenuItemClick(item)}
                style={{
                  opacity: visibleItems.includes(index) ? 1 : 0,
                  transform: visibleItems.includes(index)
                    ? "translateX(0)"
                    : "translateX(-20px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  marginBottom: "5px",
                  cursor: "pointer",
                  borderRadius: "6px",

                  backgroundColor: isActive ? "#1e3c72" : "transparent",
                  color: isActive ? "#fff" : "#03275e",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Nav.Link>
            );
          })}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default TeacherSidebar;
