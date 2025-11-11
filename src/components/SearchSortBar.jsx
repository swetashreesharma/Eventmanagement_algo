import React from "react";
import "../style/Login.css";;

function SearchSortBar({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  sortDirection,
  setSortDirection,
  sortOptions = [],
  searchPlaceholder = "Search...",
}) {
  return (
    <div className="search-sort-bar">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select
        className="sort-dropdown"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">Sort by...</option>
        {sortOptions.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className="sort-direction-dropdown"
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

export default SearchSortBar;
