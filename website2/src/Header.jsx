import { useLanguage } from './useLanguage.js';

export const Header = () => {
  const { t } = useLanguage();
  return <div className="wrapper"><header><h1>{t('Trouvez votre prochain film.')}</h1></header></div>;
};
