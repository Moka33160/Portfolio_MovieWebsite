import React from "react";

export const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow">
      <img
        src="public/loupe.png"
        className="w-6 h-6 opacity-90"
        alt="search logo"
      />
      <input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        type="text"
        placeholder="Search through thousands of movies and series"
        className="flex-1 outline-none bg-transparent text-black placeholder-gray-500"
      />
    </div>
  );
};
