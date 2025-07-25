import React from "react";
import Checkbox from "./Like";

export const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : "public/not_Avaible.png"
        }
        alt={movie.title}
      />
      <div className="mt-5">
        <h3>{movie.title}</h3>
        <div className="content">
          <div className="rating">
            <img src="public/star-removebg-preview.png" alt="rating image" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
            <span>•</span>
            <p className="year">
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
            </p>
            <span>•</span>
            <p className="lang">{movie.original_language}</p>
            <div className="mb-1 ml-2 w-fit h-fit">
              <Checkbox></Checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
