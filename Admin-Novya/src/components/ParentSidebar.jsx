import React, { useState, useEffect } from "react";
import { Nav, Offcanvas, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaMoneyBillWave,
  FaRegEnvelope,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";

const ParentSidebar = ({ showSidebar, darkMode, setShowSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState([]);
  const [activeItem, setActiveItem] = useState("Overview");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ MENU LIST (FIXED)
  const menuItems = [
    { name: "Overview", icon: <FaTachometerAlt />, path: "" }, // ✅ FIX
    { name: "Payments", icon: <FaMoneyBillWave />, path: "payments" },
    { name: "Support", icon: <FaRegEnvelope />, path: "support" },
    //{ name: "Parent Registration", icon: <FaUserPlus />, path: "registration" },
  ];

  // ✅ Active highlight
  useEffect(() => {
    const currentPath = location.pathname.split("/")[2] || "";
    const currentItem = menuItems.find((item) => item.path === currentPath);
    setActiveItem(currentItem ? currentItem.name : "Overview");
  }, [location.pathname]);

  // ✅ Navigation
  const handleMenuItemClick = (item) => {
    navigate(item.path ? `/parent/${item.path}` : `/parent`);

    if (window.innerWidth <= 992) setShowSidebar(false);
  };

  // Search filter
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation
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
      <Offcanvas.Header closeButton closeVariant={darkMode ? "white" : undefined}>
        <h4>NOVYA</h4>
      </Offcanvas.Header>

      <Offcanvas.Body style={{ height: "100vh", overflowY: "auto" }}>
        {/* Search */}
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

        {/* Menu */}
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
                  transition: "0.4s",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  backgroundColor: isActive ? "#1e3c72" : "transparent",
                  color: isActive ? "#fff" : "#03275e",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {item.icon}
                {item.name}
              </Nav.Link>
            );
          })}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ParentSidebar;
