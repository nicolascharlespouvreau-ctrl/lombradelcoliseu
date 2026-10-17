// Tout le contenu du site est ici. Pour ajouter un concert : copie un bloc dans `events`.
// Les dates sont au format AAAA-MM-JJ. `status: "upcoming"` = à venir, `"past"` = archive.

export type Lang = "en" | "es" | "ca";
export const langs: Lang[] = ["en", "es", "ca"];

export const social = {
  instagram: "https://www.instagram.com/l_ombra_del_coliseu/",
  facebook: "https://www.facebook.com/profile.php?id=61578273165908",
  tiktok: "https://www.tiktok.com/@lombradelcoliseu",
  realm: "https://www.realmapp.net/univers/fa247645-ffa6-4854-992d-6d716a3688c7",
};

// Liens affichés (booking + pied de page), dans cet ordre.
export const socialLinks: { label: string; url: string }[] = [
  { label: "Instagram", url: social.instagram },
  { label: "Facebook", url: social.facebook },
  { label: "TikTok", url: social.tiktok },
  { label: "Realm", url: social.realm },
];

// À remplir : adresse e-mail de contact de l'asso (booking, presse).
export const contactEmail = "";

// Groupe : bio courte dans les 3 langues (facultative) + liens (Bandcamp, Instagram…).
export type Band = {
  name: string;
  genre: string;
  origin?: string;
  bio?: Partial<Record<Lang, string>>;
  links?: { label: string; url: string }[];
};

export type Event = {
  slug: string;
  title: string;
  date: string; // AAAA-MM-JJ
  doors?: string;
  start?: string;
  venue: string;
  address?: string;
  city: string;
  lineup: Band[];
  poster?: string; // chemin de l'affiche dans /public
  presale?: string; // prix anticipada
  presaleFee?: string; // frais de gestion billetterie
  door?: string; // prix taquilla
  ticketUrl?: string;
  // Billets early bird réservés aux membres, vendus sur le site (Stripe).
  // price en centimes ; quota = nombre max de billets ; until = dernier jour de vente (AAAA-MM-JJ).
  earlyBird?: { price: number; quota: number; until: string };
  status: "upcoming" | "past";
};

export const events: Event[] = [
  {
    slug: "tarraco-black-metal-night-ii",
    title: "Tarraco Black Metal Night II",
    date: "2026-10-30",
    doors: "20:00",
    start: "20:30",
    venue: "Sala Zero",
    address: "Carrer de Sant Magí, 12",
    city: "Tarragona",
    lineup: [
      {
        name: "Between The Frost",
        genre: "Black Metal",
        origin: "TGN",
        // à valider par le groupe
        bio: {
          en: "Black metal veterans: first demo in 1996, debut album Instinct of Surliness in 1998, latest studio album Inferno's Conflagration.",
          es: "Veteranos del black metal: primera demo en 1996, primer álbum Instinct of Surliness en 1998, último disco de estudio Inferno's Conflagration.",
          ca: "Veterans del black metal: primera maqueta el 1996, primer àlbum Instinct of Surliness el 1998, últim disc d'estudi Inferno's Conflagration.",
        },
        links: [
          { label: "Bandcamp", url: "https://betweenthefrost.bandcamp.com" },
          { label: "Instagram", url: "https://www.instagram.com/betweenthefrost/" },
        ],
      },
      {
        name: "Eternal Hunt",
        genre: "Black Metal",
        origin: "FR",
        // à valider par le groupe
        bio: {
          en: "Black metal from Montpellier, France. Latest album: An Era of Shame (Drowning in Chaos Records).",
          es: "Black metal de Montpellier, Francia. Último álbum: An Era of Shame (Drowning in Chaos Records).",
          ca: "Black metal de Montpeller. Últim àlbum: An Era of Shame (Drowning in Chaos Records).",
        },
        links: [
          { label: "Bandcamp", url: "https://eternalhunt.bandcamp.com" },
          { label: "Instagram", url: "https://www.instagram.com/eternal.hunt.band/" },
        ],
      },
    ],
    poster: "/events/tarraco-black-metal-night-ii.jpg",
    presale: "15 €",
    presaleFee: "2 €",
    door: "20 €",
    ticketUrl: "https://entradas.salazero.com/es/salazero/evento/between-the-frost-eternal-hunt-excm",
    earlyBird: { price: 1200, quota: 30, until: "2026-10-29" }, // à confirmer
    status: "upcoming",
  },
  {
    slug: "tarragona-black-metal-night-i",
    title: "Tarragona Black Metal Night I",
    date: "2026-06-19",
    venue: "Sala Zero",
    city: "Tarragona",
    lineup: [
      { name: "Gorgon", genre: "Black Metal" },
      { name: "Corpus Diavolis", genre: "Black Metal" },
    ],
    poster: "/events/tarragona-black-metal-night-i.jpg",
    status: "past",
  },
];

// ─── BOUTIQUE ────────────────────────────────────────────────────────────────
// Prix en centimes (2000 = 20,00 €). status :
//   "available" → en vente   "preorder" → pré-commande payée maintenant   "soldout" → épuisé, non commandable
export type ProductStatus = "available" | "preorder" | "soldout";
export type Product = {
  id: string;
  name: string;
  price: number;
  sizes?: string[];
  status: ProductStatus;
  image?: string;
  gallery?: string[]; // vues supplémentaires (miniatures cliquables)
};

export const merch: Product[] = [
  {
    id: "bmik-tank",
    name: "Black Metal Ist Krieg — Tank Top",
    price: 2000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    status: "preorder",
    image: "/merch/black-metal-ist-krieg-tank.webp",
  },
  {
    id: "logo-tank-men",
    name: "L'Ombra Logo — Tank Top Men",
    price: 2000, // à confirmer
    sizes: ["S", "M", "L", "XL", "XXL"],
    status: "preorder",
    image: "/merch/logo-tank-men.webp",
  },
  {
    id: "logo-tank-women",
    name: "L'Ombra Logo — Tank Top Women",
    price: 2000, // à confirmer
    sizes: ["XS", "S", "M", "L", "XL"],
    status: "preorder",
    image: "/merch/logo-tank-women.webp",
  },
  {
    id: "tarraco-mug",
    name: "Tarraco Black Metal Night — Mug",
    price: 1000,
    status: "preorder",
    image: "/merch/tarraco-mug-1.webp",
    gallery: ["/merch/tarraco-mug-1.webp", "/merch/tarraco-mug-2.webp", "/merch/tarraco-mug-3.webp"],
  },
];

// Livraison (centimes). À ajuster selon vos vrais tarifs postaux.
export const shipping = {
  spain: 500,
  europe: 1200,
};
export const europeCountries = [
  "FR", "PT", "IT", "DE", "BE", "NL", "LU", "AT", "IE", "DK", "SE", "FI", "PL", "CZ", "SK", "HU",
  "SI", "HR", "RO", "BG", "GR", "CY", "MT", "EE", "LV", "LT",
] as const;

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// ─── ADHÉSION & BÉNÉVOLES ────────────────────────────────────────────────────
// Cotisation annuelle en centimes (500 = 5,00 €). À ajuster selon les statuts de l'asso.
export const membership = { price: 500 };

// Rôles proposés aux bénévoles (cases à cocher), dans les 3 langues, même ordre.
export const volunteerRoles: Record<Lang, string[]> = {
  en: ["Door & welcome", "Merch stand", "Load-in / stage", "Photo & video", "Posters & street promo", "Social media"],
  es: ["Puerta y acogida", "Puesto de merch", "Montaje / escenario", "Foto y vídeo", "Carteles y promo en la calle", "Redes sociales"],
  ca: ["Porta i acollida", "Parada de merch", "Muntatge / escenari", "Foto i vídeo", "Cartells i promo al carrer", "Xarxes socials"],
};

type Dict = Record<string, string>;

export const t: Record<Lang, Dict> = {
  en: {
    moreInfo: "More info",
    back: "All events",
    lineupTitle: "Line-up",
    directions: "Directions",
    ticketsTitle: "Tickets",
    ebTitle: "Members early bird",
    ebText: "One ticket per member, while stock lasts. Enter the e-mail you used to join.",
    ebLeft: "{n} left",
    ebBtn: "Get my ticket",
    ebNotMember: "No active membership found for this e-mail.",
    ebJoin: "Become a member",
    ebAlready: "You already have your early bird ticket for this show.",
    ebSoldOut: "Early bird tickets are sold out.",
    ebClosed: "Early bird sales are closed.",
    ebThanksTitle: "Your ticket is booked",
    ebThanksText: "Your name is on the list at the door. Bring the confirmation e-mail and an ID.",
    navHorde: "Join",
    hordeTitle: "Join the horde",
    hordeSub: "L'Ombra del Coliseu is a cultural association. Every show exists thanks to its members and volunteers.",
    memberTitle: "Become a member",
    memberPer: "/ year",
    memberText: "Your yearly fee keeps underground shows alive in Tarragona: sound, venues, travel for the bands.",
    memberPerk1: "A voice and a vote in the association's assembly",
    memberPerk2: "Early bird tickets reserved for members at every show",
    memberPerk3: "Your name in the members' register of the horde",
    memberBtn: "Become a member",
    memberNote: "Secure payment via Stripe. Your full name is requested for the members' register.",
    volTitle: "Volunteer",
    volText: "Door, merch stand, load-in, photos, posters… Lend a hand on show nights and live them from the inside.",
    volRoles: "How would you like to help?",
    fPhone: "Phone (optional)",
    volMsg: "Availability, experience, anything else",
    volSend: "I'm in",
    volSent: "Welcome to the horde. We'll contact you before the next show.",
    memberThanksTitle: "Welcome to the horde",
    memberThanksText: "Your membership is confirmed. You will receive a receipt by e-mail.",
    navEvents: "Events",
    navAbout: "Manifesto",
    navMerch: "Merch",
    navBooking: "Booking",
    heroKicker: "Underground collective · Tarragona",
    heroSub: "Black metal, gothic, post-punk and industrial nights in the shadow of the old amphitheatre.",
    nextShow: "Next ritual",
    tickets: "Tickets",
    ticketsSoon: "Tickets soon",
    doors: "Doors",
    start: "Start",
    presale: "Presale",
    door: "At the door",
    upcoming: "Upcoming",
    past: "Past rituals",
    noUpcoming: "New dates are being forged. Follow us to be the first to know.",
    aboutTitle: "Uncompromising sound since the depths",
    about1:
      "L'Ombra del Coliseu is a Tarragona-based collective dedicated to extreme and dark music. We bring black metal, gothic, post-punk and industrial bands to the city — without compromise and without commercial dilution.",
    about2:
      "Our goal is simple: build a real community around the underground scene, give local bands a stage worthy of them, and bring international acts to places they would never otherwise play.",
    genres: "What we summon",
    merchTitle: "Ombra Harvest",
    merchSub: "Official merch. Limited runs, never reprinted.",
    soldOut: "Sold out",
    preorder: "Pre-order",
    preorderNote: "Paid now, delivered when the new run is printed.",
    addToCart: "Add to cart",
    preorderBtn: "Pre-order",
    size: "Size",
    chooseSize: "Choose a size",
    cart: "Cart",
    cartEmpty: "Your cart is empty.",
    remove: "Remove",
    delivery: "Delivery",
    pickup: "Pick up at a concert (free)",
    shipSpain: "Shipping — Spain",
    shipEurope: "Shipping — Europe",
    subtotal: "Subtotal",
    shippingCost: "Shipping",
    total: "Total",
    checkout: "Checkout",
    checkoutLoading: "Redirecting…",
    checkoutError: "The shop is not open yet. Please try again later.",
    added: "Added to cart",
    thanksTitle: "Thank you for your order",
    thanksText: "You will receive a confirmation e-mail. Pre-orders are delivered as soon as the run is ready.",
    backHome: "Back to the site",
    bookingTitle: "Play with us",
    bookingSub:
      "Are you a band, a booker or a venue? Tell us about your project. We answer every serious proposal.",
    fName: "Name / band",
    fEmail: "E-mail",
    fLink: "Link to your music (Bandcamp, Spotify…)",
    fMsg: "Your message",
    fSend: "Send",
    fSent: "Received. We'll get back to you soon.",
    newsTitle: "Get the latest show announcements",
    newsPlaceholder: "Your e-mail",
    newsBtn: "Join",
    newsDone: "You're on the list.",
    footer: "Uncompromising sound since the depths",
    fee: "+ {fee} booking fee",
    supporters: "With the support of",
    viewPoster: "View poster",
  },
  es: {
    moreInfo: "Más info",
    back: "Todos los conciertos",
    lineupTitle: "Cartel",
    directions: "Cómo llegar",
    ticketsTitle: "Entradas",
    ebTitle: "Early bird socios",
    ebText: "Una entrada por socio, hasta agotar existencias. Indica el e-mail con el que te hiciste socio/a.",
    ebLeft: "Quedan {n}",
    ebBtn: "Conseguir mi entrada",
    ebNotMember: "No encontramos una cuota activa con este e-mail.",
    ebJoin: "Hazte socio/a",
    ebAlready: "Ya tienes tu entrada early bird para este concierto.",
    ebSoldOut: "Las entradas early bird están agotadas.",
    ebClosed: "La venta early bird está cerrada.",
    ebThanksTitle: "Tu entrada está reservada",
    ebThanksText: "Tu nombre está en la lista de la puerta. Trae el e-mail de confirmación y tu DNI.",
    navHorde: "Únete",
    hordeTitle: "Únete a la horda",
    hordeSub: "L'Ombra del Coliseu es una asociación cultural. Cada concierto existe gracias a sus socios y voluntarios.",
    memberTitle: "Hazte socio/a",
    memberPer: "/ año",
    memberText: "Tu cuota anual mantiene vivos los conciertos underground en Tarragona: sonido, salas, viajes de las bandas.",
    memberPerk1: "Voz y voto en la asamblea de la asociación",
    memberPerk2: "Entradas early bird reservadas a socios en cada concierto",
    memberPerk3: "Tu nombre en el registro de socios de la horda",
    memberBtn: "Hacerme socio/a",
    memberNote: "Pago seguro con Stripe. Se pide tu nombre completo para el registro de socios.",
    volTitle: "Voluntariado",
    volText: "Puerta, puesto de merch, montaje, fotos, carteles… Echa una mano las noches de concierto y vívelas desde dentro.",
    volRoles: "¿Cómo quieres ayudar?",
    fPhone: "Teléfono (opcional)",
    volMsg: "Disponibilidad, experiencia, lo que quieras contarnos",
    volSend: "Me apunto",
    volSent: "Bienvenido/a a la horda. Te contactaremos antes del próximo concierto.",
    memberThanksTitle: "Bienvenido/a a la horda",
    memberThanksText: "Tu cuota está confirmada. Recibirás el recibo por e-mail.",
    navEvents: "Eventos",
    navAbout: "Manifiesto",
    navMerch: "Merch",
    navBooking: "Booking",
    heroKicker: "Colectivo underground · Tarragona",
    heroSub: "Noches de black metal, gótico, post-punk e industrial a la sombra del viejo anfiteatro.",
    nextShow: "Próximo ritual",
    tickets: "Entradas",
    ticketsSoon: "Entradas pronto",
    doors: "Puertas",
    start: "Inicio",
    presale: "Anticipada",
    door: "Taquilla",
    upcoming: "Próximos",
    past: "Rituales pasados",
    noUpcoming: "Se están forjando nuevas fechas. Síguenos para enterarte el primero.",
    aboutTitle: "Sonido sin concesiones desde las profundidades",
    about1:
      "L'Ombra del Coliseu es un colectivo de Tarragona dedicado a la música extrema y oscura. Traemos a la ciudad bandas de black metal, gótico, post-punk e industrial, sin concesiones y sin dilución comercial.",
    about2:
      "Nuestro objetivo es sencillo: crear una comunidad real en torno a la escena underground, dar a las bandas locales un escenario a su altura y traer grupos internacionales a lugares donde nunca tocarían.",
    genres: "Lo que invocamos",
    merchTitle: "Ombra Harvest",
    merchSub: "Merch oficial. Tiradas limitadas, nunca reeditadas.",
    soldOut: "Agotado",
    preorder: "Preventa",
    preorderNote: "Se paga ahora, se entrega cuando se imprima la nueva tirada.",
    addToCart: "Añadir al carrito",
    preorderBtn: "Reservar",
    size: "Talla",
    chooseSize: "Elige una talla",
    cart: "Carrito",
    cartEmpty: "Tu carrito está vacío.",
    remove: "Quitar",
    delivery: "Entrega",
    pickup: "Recoger en un concierto (gratis)",
    shipSpain: "Envío — España",
    shipEurope: "Envío — Europa",
    subtotal: "Subtotal",
    shippingCost: "Envío",
    total: "Total",
    checkout: "Pagar",
    checkoutLoading: "Redirigiendo…",
    checkoutError: "La tienda aún no está abierta. Inténtalo más tarde.",
    added: "Añadido al carrito",
    thanksTitle: "Gracias por tu pedido",
    thanksText: "Recibirás un e-mail de confirmación. Las preventas se entregan en cuanto la tirada esté lista.",
    backHome: "Volver a la web",
    bookingTitle: "Toca con nosotros",
    bookingSub:
      "¿Eres una banda, un booker o una sala? Cuéntanos tu proyecto. Respondemos a toda propuesta seria.",
    fName: "Nombre / banda",
    fEmail: "E-mail",
    fLink: "Enlace a tu música (Bandcamp, Spotify…)",
    fMsg: "Tu mensaje",
    fSend: "Enviar",
    fSent: "Recibido. Te responderemos pronto.",
    newsTitle: "Recibe los próximos conciertos",
    newsPlaceholder: "Tu e-mail",
    newsBtn: "Unirme",
    newsDone: "Ya estás en la lista.",
    footer: "Sonido sin concesiones desde las profundidades",
    fee: "+ {fee} gastos de gestión",
    supporters: "Con el apoyo de",
    viewPoster: "Ver cartel",
  },
  ca: {
    moreInfo: "Més info",
    back: "Tots els concerts",
    lineupTitle: "Cartell",
    directions: "Com arribar-hi",
    ticketsTitle: "Entrades",
    ebTitle: "Early bird socis",
    ebText: "Una entrada per soci, fins a exhaurir existències. Indica l'e-mail amb què et vas fer soci/a.",
    ebLeft: "Queden {n}",
    ebBtn: "Aconseguir la meva entrada",
    ebNotMember: "No trobem cap quota activa amb aquest e-mail.",
    ebJoin: "Fes-te soci/a",
    ebAlready: "Ja tens la teva entrada early bird per a aquest concert.",
    ebSoldOut: "Les entrades early bird estan exhaurides.",
    ebClosed: "La venda early bird està tancada.",
    ebThanksTitle: "La teva entrada està reservada",
    ebThanksText: "El teu nom és a la llista de la porta. Porta l'e-mail de confirmació i el DNI.",
    navHorde: "Uneix-te",
    hordeTitle: "Uneix-te a l'horda",
    hordeSub: "L'Ombra del Coliseu és una associació cultural. Cada concert existeix gràcies als seus socis i voluntaris.",
    memberTitle: "Fes-te soci/a",
    memberPer: "/ any",
    memberText: "La teva quota anual manté vius els concerts underground a Tarragona: so, sales, viatges de les bandes.",
    memberPerk1: "Veu i vot a l'assemblea de l'associació",
    memberPerk2: "Entrades early bird reservades als socis a cada concert",
    memberPerk3: "El teu nom al registre de socis de l'horda",
    memberBtn: "Fer-me soci/a",
    memberNote: "Pagament segur amb Stripe. Es demana el teu nom complet per al registre de socis.",
    volTitle: "Voluntariat",
    volText: "Porta, parada de merch, muntatge, fotos, cartells… Dona un cop de mà les nits de concert i viu-les des de dins.",
    volRoles: "Com vols ajudar?",
    fPhone: "Telèfon (opcional)",
    volMsg: "Disponibilitat, experiència, el que vulguis explicar-nos",
    volSend: "M'hi apunto",
    volSent: "Benvingut/da a l'horda. Et contactarem abans del proper concert.",
    memberThanksTitle: "Benvingut/da a l'horda",
    memberThanksText: "La teva quota està confirmada. Rebràs el rebut per e-mail.",
    navEvents: "Esdeveniments",
    navAbout: "Manifest",
    navMerch: "Merch",
    navBooking: "Booking",
    heroKicker: "Col·lectiu underground · Tarragona",
    heroSub: "Nits de black metal, gòtic, post-punk i industrial a l'ombra del vell amfiteatre.",
    nextShow: "Proper ritual",
    tickets: "Entrades",
    ticketsSoon: "Entrades aviat",
    doors: "Portes",
    start: "Inici",
    presale: "Anticipada",
    door: "Taquilla",
    upcoming: "Propers",
    past: "Rituals passats",
    noUpcoming: "S'estan forjant noves dates. Segueix-nos per saber-ho el primer.",
    aboutTitle: "So sense concessions des de les profunditats",
    about1:
      "L'Ombra del Coliseu és un col·lectiu de Tarragona dedicat a la música extrema i fosca. Portem a la ciutat bandes de black metal, gòtic, post-punk i industrial, sense concessions i sense dilució comercial.",
    about2:
      "El nostre objectiu és senzill: crear una comunitat real al voltant de l'escena underground, donar a les bandes locals un escenari a la seva altura i portar grups internacionals a llocs on mai no tocarien.",
    genres: "El que invoquem",
    merchTitle: "Ombra Harvest",
    merchSub: "Merch oficial. Tirades limitades, mai reeditades.",
    soldOut: "Esgotat",
    preorder: "Preventa",
    preorderNote: "Es paga ara, s'entrega quan s'imprimeixi la nova tirada.",
    addToCart: "Afegir al carret",
    preorderBtn: "Reservar",
    size: "Talla",
    chooseSize: "Tria una talla",
    cart: "Carret",
    cartEmpty: "El teu carret és buit.",
    remove: "Treure",
    delivery: "Lliurament",
    pickup: "Recollir en un concert (gratuït)",
    shipSpain: "Enviament — Espanya",
    shipEurope: "Enviament — Europa",
    subtotal: "Subtotal",
    shippingCost: "Enviament",
    total: "Total",
    checkout: "Pagar",
    checkoutLoading: "Redirigint…",
    checkoutError: "La botiga encara no és oberta. Torna-ho a provar més tard.",
    added: "Afegit al carret",
    thanksTitle: "Gràcies per la teva comanda",
    thanksText: "Rebràs un e-mail de confirmació. Les preventes s'entreguen tan aviat com la tirada estigui llesta.",
    backHome: "Tornar a la web",
    bookingTitle: "Toca amb nosaltres",
    bookingSub:
      "Ets una banda, un booker o una sala? Explica'ns el teu projecte. Responem a tota proposta seriosa.",
    fName: "Nom / banda",
    fEmail: "E-mail",
    fLink: "Enllaç a la teva música (Bandcamp, Spotify…)",
    fMsg: "El teu missatge",
    fSend: "Enviar",
    fSent: "Rebut. Et respondrem aviat.",
    newsTitle: "Rep els propers concerts",
    newsPlaceholder: "El teu e-mail",
    newsBtn: "Apuntar-me",
    newsDone: "Ja ets a la llista.",
    footer: "So sense concessions des de les profunditats",
    fee: "+ {fee} despeses de gestió",
    supporters: "Amb el suport de",
    viewPoster: "Veure cartell",
  },
};

// Partenaires affichés en pied de page
export const supporters = [
  "Diputació de Tarragona",
  "Ajuntament de Tarragona",
  "Generalitat de Catalunya · Departament de Cultura",
  "Radar Palmfest",
  "Estrella Damm",
  "Sala Zero",
];

export const genres = ["Black Metal", "Gothic", "Post-Punk", "Industrial"];

export const dateLocale: Record<Lang, string> = { en: "en-GB", es: "es-ES", ca: "ca-ES" };
