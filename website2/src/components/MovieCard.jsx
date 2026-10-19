import { useLanguage } from "../useLanguage.js";
import Checkbox from "./Like";

export const MovieCard = ({ movie }) => {
  const { t, language } = useLanguage();
  return (
    <li className="movie-card">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : `${import.meta.env.BASE_URL}not_Avaible.png`
        }
        alt={movie.title} loading="lazy" width="500" height="750"
      />
      <div className="mt-5">
        <h3>{movie.title}</h3>
        <div className="content">
          <div className="rating">
            <img src={`${import.meta.env.BASE_URL}star-removebg-preview.png`} alt={t("Note du film")} />
            <p>{movie.vote_average ? new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(movie.vote_average) : "N/A"}</p>
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
    </li>
  );
};
