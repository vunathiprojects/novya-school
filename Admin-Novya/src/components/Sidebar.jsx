
import React, { useState, useEffect } from "react";
import { Nav, Offcanvas, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaMoneyBill,
  FaChartLine,
  FaTicketAlt,
  FaUserPlus,
  FaSearch,
  FaClipboardCheck,
  FaFileAlt
} from "react-icons/fa";

const Sidebar = ({ showSidebar, darkMode, setShowSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleItems, setVisibleItems] = useState([]);
  const [activeItem, setActiveItem] = useState("Overview");

  const navigate = useNavigate();
  const location = useLocation();

  // menu items including new Attendance & Reports
  const menuItems = [
    { name: "Overview", icon: <FaTachometerAlt />, path: "overview" },
    { name: "Payments and Subscription", icon: <FaMoneyBill />, path: "payments" },
    { name: "Progress", icon: <FaChartLine />, path: "progress" },
    { name: "Support and Tickets", icon: <FaTicketAlt />, path: "tickets" },
    //{ name: "Registrations", icon: <FaUserPlus />, path: "registrations" },

    // Newly added
    { name: "Attendance", icon: <FaClipboardCheck />, path: "attendance" },
    { name: "Reports", icon: <FaFileAlt />, path: "reports" }
  ];

  // Active Menu Highlight
  useEffect(() => {
    const currentPath = location.pathname.split("/")[2];
    const currentItem = menuItems.find((item) => item.path === currentPath);
    setActiveItem(currentItem ? currentItem.name : "Overview");
  }, [location.pathname]);

  const handleMenuItemClick = (item) => {
    navigate(`/dashboard/${item.path}`, { replace: true });

    if (window.innerWidth <= 992) setShowSidebar(false);
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setVisibleItems([]);
    filteredItems.forEach((_, index) => {
      setTimeout(
        () => setVisibleItems((prev) => [...prev, index]),
        index * 50
      );
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
      <Offcanvas.Header
        closeButton
        closeVariant={darkMode ? "white" : undefined}
      >
        <h4>NOVYA</h4>
      </Offcanvas.Header>

      <Offcanvas.Body
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto"
        }}
      >
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
                  color: isActive ? "#fff" : "#03275eff",
                  fontWeight: isActive ? "bold" : "normal"
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Nav.Link>
            );
          })}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
