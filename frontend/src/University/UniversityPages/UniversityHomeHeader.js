import React, { useState } from "react";
import perfil from "../../Logo/perfil.png"; // Import the image from Logo folder
import { Link } from "react-router-dom"; // Import Link to redirect

const UniversityHomeHeader = ({ logout }) => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <header style={headerStyle}>
        <div style={containerStyle}>
          {/* Profile logo */}
          <a href="/" style={buttonStyle}>
            <img src={perfil} alt="Perfil" style={imageStyle} />
          </a>

          {/* Title */}
          <div style={titleStyle}>
            <h1>University Home Page</h1>
          </div>

          <Link
            to={`/`} // Route where it links to
            style={backButtonStyle}
            onClick={(e) => {
              logout();
              e.preventDefault();
              setTimeout(() => {
                window.location.href = "/";
              }, 500);
            }}
            onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, backButtonStyle)}
          >
            Log Out
          </Link>

          {/* Notifications Icon */}
          <div style={notificationStyle} className="notifications">
            <button
              style={starButtonStyle}
              aria-label="Notifications"
              onClick={openModal}
            >
              <span className="star">★</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Notifications</h2>
            <p>Here is where notifications go...</p>
            <button onClick={closeModal} style={closeButtonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const headerStyle = {
  background: "#282c34",
  color: "white",
  padding: "10px",
  textAlign: "center",
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxWidth: "1200px",
  margin: "0 auto",
};

const buttonStyle = {
  textDecoration: "none",
};

const imageStyle = {
  width: "80px",
  height: "80px",
};

const titleStyle = {
  flex: 1,
  textAlign: "center",
};

const notificationStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const starButtonStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "30px",
  cursor: "pointer",
};

const backButtonStyle = {
  textDecoration: "none",
  backgroundColor: "#ff4c4c",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.3s",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "600px",
};

const closeButtonStyle = {
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  padding: "10px",
  marginTop: "20px",
  cursor: "pointer",
};

/* Hover */
const hoverStyle = {
  backgroundColor: "#0056b3",
};

export default UniversityHomeHeader;
