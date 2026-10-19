import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import DemoBoundary from './components/DemoBoundary.jsx';
import './App.css';
import { useLanguage } from './useLanguage.js';
import concordiaImage from './assets/concordia.webp';
import discordImage from './assets/discord.webp';
import moviesImage from './assets/movies.webp';
import anicardImage from './assets/anicard-preview.jpg';

const github = 'https://github.com/Moka33160';
const linkedin = 'https://www.linkedin.com/in/mathis-gesson-826a7036a/';
const cvUrl = `${import.meta.env.BASE_URL}documents/cv-mathis-gesson.pdf`;
const Arrow = () => <span aria-hidden="true">↗</span>;

import portrait from './assets/portrait.webp';

function getProjects(t) { return [
  {
    name: 'Concordia', repo: 'Concordia', category: t("Projet de groupe · BUT Informatique"),
    description: t("Avec mon groupe, nous avons adapté le jeu de société Concordia en Python. On y joue dans une fenêtre Tkinter face à des joueurs automatisés ; les cartes, les villes et les routes sont chargées depuis une base Oracle."),
    detail: t("Un projet qui réunit logique de jeu, interface graphique et base de données."),
    tags: ['Python', 'Tkinter', 'Oracle', t("Travail en équipe")], visual: 'concordia',
  },
  {
    name: t("Morpion & Minimax"), repo: 'minimaxAlgorithm', category: t("Algorithmique · Jeu"),
    description: t("Un morpion où l’on affronte un programme qui évalue les coups possibles avec Minimax. L’interface Tkinter et la logique de décision sont séparées pour suivre plus facilement le raisonnement de l’algorithme."),
    detail: t("Récursivité, simulation des coups et exploration d’un arbre de recherche."),
    tags: ['Python', 'Tkinter', 'Minimax'], visual: 'minimax',
  },
  {
    name: 'InsightCord', repo: 'BotDiscordPython', category: t("Bot Discord · Données"),
    description: t("Un bot Python pour suivre l’activité d’un serveur Discord : messages, temps passé en vocal et engagement des membres. Il propose des profils, des classements et des graphiques, avec un module d’analyse des messages."),
    detail: t("Les données sont stockées dans PostgreSQL avec SQLAlchemy."),
    tags: ['Python', 'Discord', 'PostgreSQL', 'SQLAlchemy', 'Plotly'], visual: 'discord',
  },
]; }

function ProjectIllustration({ type }) {
  const { t } = useLanguage();
  return <div className={`project-sketch sketch-${type}`} aria-hidden="true">
    {type === 'concordia' && <><span className="sketch-label">CONCORDIA / PYTHON</span><svg viewBox="0 0 300 180"><path d="M45 120 L95 45 L160 95 L235 40 M95 45 L245 140 L160 95 L45 120 M160 95 L140 155"/>{[[45,120],[95,45],[160,95],[235,40],[245,140],[140,155]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="8"/>)}</svg><span className="sketch-caption">Un plateau, des règles, une base de données.</span></>}
    {type === 'minimax' && <><span className="sketch-label">{t("MORPION / MINIMAX")}</span><div className="tic-board">{['X', 'O', '', '', 'X', '', 'O', '', 'X'].map((v,i)=><span key={i} className={v==='O'?'nought':''}>{v}</span>)}</div><span className="sketch-caption">{t("Explorer les coups. Choisir le meilleur.")}</span></>}
    {type === 'discord' && <><span className="sketch-label">INSIGHTCORD / DISCORD</span><div className="bot-sketch"><span className="bot-hash">#</span><div><b>InsightCord</b><code>!chart messages</code><span className="bot-bars">{[25,40,30,65,52,80,62,92].map((v,i)=><i key={i} style={{height:`${v}%`}}/>)}</span></div></div><span className="sketch-caption">Rendre l’activité d’un serveur lisible.</span></>}
  </div>;
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

function LanguagePicker() {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const picker = useRef(null);
  const trigger = useRef(null);
  const panelId = useId();
  const selected = languages.find(item => item.code === language);

  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (!picker.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  const choose = code => {
    setLanguage(code);
    setOpen(false);
    trigger.current?.focus();
  };
  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      setOpen(false);
      trigger.current?.focus();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) { setOpen(true); return; }
      const options = [...picker.current.querySelectorAll('.language-option')];
      const current = options.indexOf(document.activeElement);
      options[(current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus();
    }
  };

  return <div className="language-picker" ref={picker} onKeyDown={handleKeyDown}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button className="language-trigger" type="button" ref={trigger} aria-label={`${t('Langue')} : ${selected.name}`}
      aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
      <span className="language-flag" aria-hidden="true">{selected.flag}</span>
      <span className="language-current" lang={language}>{selected.name}</span>
      <svg className="language-chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>
    </button>
    {open && <div className="language-dropdown" id={panelId} role="group" aria-label={t('Langue')}>
      <p className="language-heading">{t('Langue')}</p>
      {languages.map(item => <button key={item.code} type="button" className="language-option" lang={item.code}
        aria-pressed={language === item.code} onClick={() => choose(item.code)}>
        <span className="language-flag" aria-hidden="true">{item.flag}</span><span>{item.name}</span>
        <span className="language-check" aria-hidden="true">{language === item.code ? '✓' : ''}</span>
      </button>)}
    </div>}
  </div>;
}

function Portfolio() {
  const { t } = useLanguage();
  const projects = getProjects(t);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('accueil');
  const root = useRef(null);
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
    }), { threshold: 0.12 });
    root.current.classList.add('reveal-ready');
    root.current.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
    const sections = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-15% 0px -55% 0px' });
    root.current.querySelectorAll('main > section[id]').forEach(el => sections.observe(el));
    return () => { reveal.disconnect(); sections.disconnect(); };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = event => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [menuOpen]);
  const navigate = () => setMenuOpen(false);
  return <div ref={root}>
    <a className="skip-link" href="#main">{t("Aller au contenu")}</a>
    <header className="site-header"><a className="wordmark" href="#accueil" onClick={navigate}>mathis<span>.</span></a><button className="menu-toggle" aria-label={menuOpen ? t("Fermer le menu") : t("Ouvrir le menu")} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? t("Fermer −") : t("Menu +")}</button><LanguagePicker/><nav id="navigation" className={menuOpen ? 'open' : ''} aria-label={t("Navigation principale")}>{[['projets', t("Projets")], ['experiences', t("Expériences")], ['apropos', t("À propos")], ['competences', t("Compétences")]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={navigate} aria-current={active === id ? 'location' : undefined}>{label}</a>)}<a className="nav-contact" href="#contact" onClick={navigate}>{t("Discutons") + " "}<Arrow /></a></nav></header>
    <main id="main">
      <section id="accueil" className="hero">
        <div className="hero-top"><span className="availability"><i/>{" " + t("RECHERCHE DE STAGE · 12 À 16 SEMAINES")}</span><span className="micro hero-year">MATHIS GESSON</span></div>
        <div className="hero-content personal-hero">
          <div className="hero-copy">
            <p className="eyebrow">{t("ÉTUDIANT EN 3ᵉ ANNÉE DE BUT INFORMATIQUE")}</p>
            <h1>{t("Bonjour,")}<br/>{t("moi c’est") + " "}<span>Mathis.</span></h1>
            <p className="hero-description">{t("Je développe des applications web, des jeux et des outils en Python. Je cherche un") + " "}<strong>{t("stage de 12 à 16 semaines en informatique")}</strong>{" " + t("pour mettre mes connaissances en pratique au sein d’une équipe.")}</p>
            <div className="hero-actions"><a className="button button-dark" href="#projets">{t("Voir mes projets") + " "}<Arrow /></a><a className="text-link" href="mailto:mathisgesson@gmail.com">{t("M’écrire") + " "}<Arrow/></a><a className="text-link cv-link" href={cvUrl} download="CV-Mathis-Gesson.pdf">{t("Télécharger mon CV")}<span aria-hidden="true">↓</span><small>PDF</small></a></div>
          </div>
          <figure className={`portrait-card ${portrait ? 'has-portrait' : ''}`}>
            {portrait ? <img src={portrait} alt={t("Portrait de Mathis Gesson")} fetchPriority="high" width="827" height="760" decoding="async"/> : <div className="portrait-initials" aria-hidden="true">mg<span>.</span></div>}
            <figcaption><strong>Mathis Gesson</strong><span>{t("Étudiant en informatique")}</span></figcaption>
          </figure>
        </div>
        <div className="hero-footer"><a href="#projets"><span className="down-arrow">↓</span>{" " + t("MES PROJETS")}</a><a href="mailto:mathisgesson@gmail.com">mathisgesson@gmail.com</a></div>
      </section>
      <section id="projets" className="section projects"><div className="section-heading" data-reveal><div><p className="eyebrow">{t("01 / MES PROJETS")}</p><h2>{t("Ce sur quoi")}<br/><span>{t("j’ai travaillé.")}</span></h2></div><p>{t("Des projets de formation et personnels,")}<br/>{t("avec leur code et leur documentation.")}</p></div><article className="anicard-feature" data-reveal>
        <a className="anicard-preview" href="?demo=anicard" aria-label={t('Lancer Anicard')}><img src={anicardImage} alt={t('Capture de l’accueil Anicard avec ses cartes à collectionner')} loading="lazy" decoding="async" width="1280" height="720"/><span className="project-open">{t('Explorer Anicard')} <Arrow/></span></a>
        <div className="anicard-feature-body"><div className="anicard-heading"><p className="project-number">01 / {t('Projet personnel · Application full-stack')}</p><span className="anicard-status">{t('En développement')}</span></div><h3>Anicard</h3><p>{t('Je développe une application web de collection de cartes inspirées de l’univers anime. Le projet associe une interface React/TypeScript, une API FastAPI et une base PostgreSQL.')}</p><div className="anicard-progress"><h4>{t('Ce qui est déjà développé')}</h4><ul><li>{t('Comptes utilisateurs, ouverture de boosters et collection persistante.')}</li><li>{t('Catalogue de cartes, raretés, filtres et écrans de gestion de collection.')}</li><li>{t('Interface responsive, animations de révélation et navigation entre les espaces du jeu.')}</li></ul></div><div className="tags"><span>React</span><span>TypeScript</span><span>FastAPI</span><span>PostgreSQL</span><span>SQLAlchemy</span><span className="ai-assisted-badge"><span aria-hidden="true">✧</span>{t("Développé avec l’aide de l’IA")}</span></div><div className="project-links"><a className="button button-dark" href="?demo=anicard">{t('Lancer Anicard')} <Arrow/></a><a className="text-link" href={`${github}/Anicard`} target="_blank" rel="noopener noreferrer">{t('Code et documentation')} <Arrow/></a></div><p className="anicard-caption">{t('Aperçu de la version actuelle. Le projet continue d’évoluer ; l’interface du jeu est en anglais.')}</p></div>
      </article><div className="project-grid">{projects.map((project, index) => <article className="project-card" data-reveal key={project.repo}>
        <a className="project-illustration-link" href={`${github}/${project.repo}`} target="_blank" rel="noreferrer" aria-label={t("Consulter {name} sur GitHub", { name: project.name })}>{project.visual === 'concordia' ? <img className="concordia-image" src={concordiaImage} alt={t("Visuel Concordia Digital Edition : carte du monde antique et personnages romains")} loading="lazy" decoding="async" width="460" height="215"/> : project.visual === 'discord' ? <img className="discord-image" src={discordImage} alt={t("Logo Discord blanc en relief sur fond bleu violet")} loading="lazy" decoding="async" width="626" height="626"/> : <ProjectIllustration type={project.visual}/>}</a>
        <div className="project-card-body"><p className="project-number">0{index + 2} / {project.category}</p><h3>{project.name}</h3><p>{project.description}</p><p className="project-detail">{project.detail}</p><div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><a className="text-link" href={`${github}/${project.repo}`} target="_blank" rel="noreferrer">{t("Code et documentation") + " "}<Arrow/></a></div>
      </article>)}</div><article className="project movie-project" data-reveal><a className="project-image" href="?demo=movie" aria-label={t("Ouvrir la démonstration de Movie Explorer")}><img className="movies-image" src={moviesImage} alt={t("Mosaïque d’affiches de films illustrant le projet Movie Explorer")} loading="lazy" decoding="async" width="2040" height="1213"/><span className="project-open">{t("Explorer le projet") + " "}<Arrow/></span></a><div className="project-info"><div className="project-number">{t("05 / APPLICATION WEB")}</div><h3>Movie Explorer<span>↗</span></h3><p>{t("Une application React pour découvrir et rechercher des films. Elle utilise l’API TMDB pour afficher les résultats et Appwrite pour enregistrer les recherches.")}</p><div className="tags"><span>React</span><span>JavaScript</span><span>API TMDB</span><span>Appwrite</span></div><div className="project-links"><a className="text-link" href="?demo=movie">{t("Voir la démo") + " "}<Arrow/></a><a className="text-link muted" href={`${github}/Portfolio_MovieWebsite`} target="_blank" rel="noreferrer">{t("Code source") + " "}<Arrow/></a></div></div></article><a className="github-strip" href={github} target="_blank" rel="noreferrer" data-reveal><span>{t("Les sources de mes projets sont sur GitHub.")}</span><span>{t("Explorer mon GitHub") + " "}<Arrow/></span></a></section>
      <section id="experiences" className="section experiences" aria-labelledby="experiences-title">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t("02 / EXPÉRIENCES PROFESSIONNELLES")}</p><h2 id="experiences-title">{t("Mes premiers pas")}<br/><span>{t("dans la recherche.")}</span></h2></div>
          <p>{t("Un stage puis un CDD à INRAE,")}<br/>{t("à Villenave-d’Ornon.")}</p>
        </div>
        <div className="experience-list">
          <article className="experience-entry" data-reveal>
            <div className="experience-period"><span className="experience-contract">{t("CDD")}</span><p><time dateTime="2026-07-01">{t("1er juillet")}</time> – <time dateTime="2026-08-15">{t("15 août 2026")}</time></p><span>INRAE · Villenave-d’Ornon</span></div>
            <div className="experience-body"><h3>{t("Développement d’une application web")}</h3><p>{t("Après mon stage, j’ai retrouvé INRAE dans le cadre d’un CDD d’un mois et demi pour travailler sur le développement d’une application web.")}</p><p className="experience-reflection">{t("Une deuxième expérience dans la même structure, cette fois en tant que salarié.")}</p><div className="tags"><span>{t("Développement web")}</span><span>{t("Recherche scientifique")}</span></div></div>
          </article>
          <article className="experience-entry" data-reveal>
            <div className="experience-period"><span className="experience-contract">{t("STAGE · BUT 2")}</span><p><time dateTime="2026-04-06">{t("6 avril")}</time> – <time dateTime="2026-06-12">{t("12 juin 2026")}</time></p><span>INRAE · UMR ISPA<br/>Villenave-d’Ornon</span></div>
            <div className="experience-body"><h3>{t("Stagiaire développeur outils scientifiques")}</h3><p>{t("J’ai intégré l’équipe ECOFUN de l’UMR ISPA pour contribuer aux outils associés à MuSICA, un modèle qui simule les échanges entre le sol, la végétation et l’atmosphère.")}</p><ul><li>{t("Maintenance et évolution des paquets R utilisés pour exécuter et exploiter le modèle MuSICA.")}</li><li>{t("Amélioration de l’interface de SylvaClim, une application R/Shiny dédiée à l’analyse de simulations forestières.")}</li><li>{t("Ajout de fonctionnalités de paramétrage et mise à jour dynamique des champs de l’interface.")}</li></ul><p className="experience-reflection">{t("Ce stage m’a fait découvrir le développement dans une équipe de recherche, avec des échanges réguliers avec des ingénieurs et des chercheurs.")}</p><div className="tags"><span>R</span><span>Shiny</span><span>Golem</span><span>GitLab</span><span>{t("Données scientifiques")}</span></div>
              <a className="report-download" href={`${import.meta.env.BASE_URL}documents/rapport-stage-mathis-gesson-inrae-2026.pdf`} download="Rapport-stage-Mathis-Gesson-INRAE-2026.pdf"><span className="report-icon" aria-hidden="true">↓</span><span><strong>{t("Télécharger mon rapport de stage")}</strong><small>{t("PDF · 33 pages · 5,9 Mo")}</small></span><span aria-hidden="true">↘</span></a>
            </div>
          </article>
        </div>
      </section>
      <section id="apropos" className="section about"><aside className="about-note" data-reveal><span className="eyebrow">{t("EN QUELQUES MOTS")}</span><dl><div><dt>{t("Nom")}</dt><dd>Mathis Gesson</dd></div><div><dt>{t("Formation")}</dt><dd>{t("BUT Informatique · 3ᵉ année")}</dd></div><div><dt>{t("Recherche")}</dt><dd>{t("Stage en informatique")}<br/>{t("12 à 16 semaines")}</dd></div></dl><a className="text-link" href="mailto:mathisgesson@gmail.com">{t("Prendre contact") + " "}<Arrow/></a></aside><div className="about-copy" data-reveal><p className="eyebrow">{t("03 / À PROPOS")}</p><h2>{t("Un peu plus")}<br/><span>{t("sur mon parcours.")}</span></h2><p>{t("Je suis en troisième année de BUT Informatique. Mes projets m’ont amené à travailler sur des sujets assez différents : une interface web, un jeu de société en groupe, un algorithme de morpion et un bot Discord.")}</p><p>{t("Je cherche maintenant un") + " "}<strong>{t("stage de 12 à 16 semaines en informatique")}</strong>{t(". Après un stage puis un CDD à INRAE, j’aimerais découvrir une nouvelle équipe, progresser avec ses retours et contribuer à ses projets.")}</p><div className="about-facts"><div><span>{t("FORMATION")}</span><strong>{t("BUT Informatique")}</strong></div><div><span>{t("ACTUELLEMENT")}</span><strong>{t("3ᵉ année")}</strong></div><div><span>{t("PROCHAIN OBJECTIF")}</span><strong>{t("Stage · 12 à 16 semaines")}</strong></div></div></div></section>
      <section id="competences" className="section skills"><div className="section-heading" data-reveal><div><p className="eyebrow">{t("04 / COMPÉTENCES")}</p><h2>{t("Les technologies")}<br/><span>{t("que je pratique.")}</span></h2></div><p>{t("Utilisées dans les projets")}<br/>{t("et expériences présentés ici.")}</p></div><div className="skill-list">{[['01', t("Développement front-end"), 'React · JavaScript · HTML · CSS', t("Des interfaces structurées, interactives et adaptées à tous les écrans.")], ['02', t("Python & algorithmique"), 'Python · Tkinter · Minimax', t("Interfaces graphiques, logique de jeu, récursivité et automatisation.")], ['03', t("Bases de données & API"), 'Oracle · PostgreSQL · SQLAlchemy', t("Lire et stocker les données d’une application, utiliser des API.")], ['04', t("Outils scientifiques"), 'R · Shiny · Golem', t("Maintenance de paquets R et amélioration d’une application de simulations forestières.")], ['05', t("Environnement de travail"), 'Git · GitHub · GitLab · Vite', t("Versionner le code et organiser le développement d’une application.")]].map(([n, title, tools, desc]) => <div className="skill-row" data-reveal key={n}><span className="skill-index">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="skill-tools">{tools}</span><span className="skill-symbol">↗</span></div>)}</div></section>
      <section id="contact" className="contact section"><div data-reveal>
        <span className="availability"><i/>{" " + t("STAGE EN INFORMATIQUE · 12 À 16 SEMAINES")}</span><p className="eyebrow">{t("05 / CONTACT")}</p>
        <h2>{t("Parlons de")}<br/><span>{t("votre stage.")}</span></h2>
        <div className="contact-bottom"><p>{t("Vous recherchez un stagiaire en informatique ?")}<br/>{t("Vous pouvez m’écrire ou m’appeler directement.")}</p><div className="contact-details"><a className="contact-email" href="mailto:mathisgesson@gmail.com">mathisgesson@gmail.com <Arrow/></a><a className="contact-phone" href="tel:+33781668091">07 81 66 80 91</a><div className="contact-socials"><a className="text-link" href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow/></a><a className="text-link" href={github} target="_blank" rel="noopener noreferrer">GitHub <Arrow/></a></div><a className="text-link cv-link" href={cvUrl} download="CV-Mathis-Gesson.pdf">{t("Télécharger mon CV")}<span aria-hidden="true">↓</span><small>PDF</small></a></div></div>
      </div></section>
    </main><footer className="site-footer"><a className="wordmark" href="#accueil">mathis<span>.</span></a><span>{t("Mathis Gesson · BUT Informatique")}</span><a href="#accueil">{t("Retour en haut ↑")}</a></footer>
  </div>;
}

function AnicardDemo() {
  const { t } = useLanguage();
  const [page, setPage] = useState('/');
  const frameRef = useRef(null);
  useEffect(() => {
    const frame = frameRef.current;
    let child;
    const sync = () => {
      const route = child?.location.hash.slice(1) || '/';
      setPage(route);
    };
    const bind = () => {
      child?.removeEventListener('hashchange', sync);
      child = frame.contentWindow;
      child?.addEventListener('hashchange', sync);
      sync();
    };
    frame.addEventListener('load', bind);
    return () => {
      frame.removeEventListener('load', bind);
      child?.removeEventListener('hashchange', sync);
    };
  }, []);
  const demoUrl = `${import.meta.env.BASE_URL}demos/anicard/index.html`;
  return <div className="anicard-demo-page">
    <header className="anicard-demo-header"><a className="text-link" href="?">{t('← Retour au portfolio')}</a><span>Anicard <small>{t('En développement')}</small></span><LanguagePicker/></header>
    <div className="anicard-demo-tools"><div className="anicard-demo-tabs" role="group" aria-label={t('Parcourir Anicard')}>{[['/', 'Accueil'], ['/cards', 'Catalogue'], ['/packs', 'Boosters']].map(([path, label]) => <button key={path} type="button" aria-pressed={page.split('?')[0] === path} onClick={() => setPage(path)}>{t(label)}</button>)}</div><a className="text-link" href={`${demoUrl}#${page}`} target="_blank" rel="noopener noreferrer">{t('Ouvrir dans un nouvel onglet')} <Arrow/></a></div>
    <p className="anicard-demo-note">{t('Version de présentation navigable, en anglais. Les données et les actions de jeu nécessitent le serveur Anicard ; si celui-ci est arrêté, l’interface reste consultable.')}</p>
    <iframe ref={frameRef} className="anicard-frame" title={t('Démonstration interactive Anicard')} src={`${demoUrl}#${page}`} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"/>
  </div>;
}

const MovieExplorer = lazy(() => import('./MovieExplorer.jsx'));

export default function App() {
  const { t } = useLanguage();
  const demo = new URLSearchParams(window.location.search).get('demo');
  if (demo === 'anicard') return <AnicardDemo/>;
  const isDemo = demo === 'movie';
  if (isDemo) return <div className="demo-page"><LanguagePicker/><a className="demo-back" href="?">{t("← Retour au portfolio")}</a><DemoBoundary fallback={t('Impossible de charger les films. Réessayez dans un instant.')}><Suspense fallback={<p role="status">{t("Chargement de la démonstration…")}</p>}><MovieExplorer/></Suspense></DemoBoundary></div>;
  return <Portfolio/>;
}
