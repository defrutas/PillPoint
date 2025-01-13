import React, { useState } from "react";
import "./Toolbar.css";

const Toolbar = ({ name, buttonLabel, onButtonClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query); // Pass the search query back to the parent
    }
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
        {buttonLabel && (
          <div className="toolbar-button">
            <button className="toolbar-button" onClick={onButtonClick}>
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
