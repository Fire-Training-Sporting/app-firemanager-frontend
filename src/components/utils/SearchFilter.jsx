import { useState } from "react";

export default function SearchFilter({ columns, onSearch, isLoading = false }) {
  const [searchField, setSearchField] = useState(columns[0]?.value || "");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        field: searchField,
        value: searchValue,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onSearch) {
      onSearch({
        field: searchField,
        value: "",
      });
    }
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        {columns.map((col) => (
          <option key={col.value} value={col.value}>
            {col.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder={`Pesquisar por ${searchField.toLowerCase()}...`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 w-70"
      />

      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-semibold shadow-md transition-all duration-150"
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </button>

      {searchValue && (
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-150"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
