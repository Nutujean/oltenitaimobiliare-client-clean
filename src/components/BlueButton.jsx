import React from "react";

function BlueButton({ children, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background 0.2s",
        ...style,
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
    >
      {children}
    </button>
  );
}

export default BlueButton;
