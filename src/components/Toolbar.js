import React, { useState } from "react";
import "./Toolbar.css";

const Toolbar = ({ name, buttonLabel, onButtonClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="toolbar-container">
      <div className="component-name-bar">
        <span className="component-name">{name}</span>
      </div>
      <div className="toolbar">
        <div className="toolbar-search">
          <img
            src="/images/loupe.png"
            alt="Search Icon"
            className="loupe-icon"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            placeholder="Pesquisar..."
          />
        </div>
        {/* Render the button only if buttonLabel is passed */}
        {buttonLabel && (
          <div className="toolbar-button">
            <button
              className="toolbar-button"
              onClick={onButtonClick} // Trigger the callback when clicked
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;

