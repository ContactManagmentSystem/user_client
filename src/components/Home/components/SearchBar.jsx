// components/SearchBar.jsx
/* eslint-disable react/prop-types */
import { Input } from "antd";

const SearchBar = ({ value, onChange, onSearch, primaryColor = "#A70000" }) => {
  return (
    <div className="flex mb-5 rounded-2xl overflow-hidden shadow-md transition-all border border-gray-300 focus-within:shadow-lg bg-white">
      <Input
        value={value}
        onChange={onChange}
        onPressEnter={(e) => onSearch(e.target.value)}
        placeholder="Search products by name..."
        className="!border-0 !shadow-none focus:!ring-0 focus:!outline-none"
        style={{
          flex: 1,
          height: 50,
          padding: "0 16px",
          fontSize: 16,
          backgroundColor: "transparent",
        }}
      />
      <button
        onClick={() => onSearch(value)}
        className="px-6 text-sm font-semibold transition-all"
        style={{
          backgroundColor: primaryColor,
          color: "#fff",
          height: 50,
          borderLeft: `1px solid ${primaryColor}`,
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
