import { useLanguage } from "../useLanguage.js";

export const Search = ({ searchTerm, setSearchTerm }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow">
      <img
        src={`${import.meta.env.BASE_URL}loupe.png`}
        className="w-6 h-6 opacity-90"
        alt=""
      />
      <input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        type="text"
        placeholder={t("Rechercher un film")}
        aria-label={t("Rechercher un film")}
        className="flex-1 outline-none bg-transparent text-black placeholder-gray-500"
      />
    </div>
  );
};
