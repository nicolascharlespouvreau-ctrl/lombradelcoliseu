// Tout le contenu du site est ici. Pour ajouter un concert : copie un bloc dans `events`.
// Les dates sont au format AAAA-MM-JJ. `status: "upcoming"` = à venir, `"past"` = archive.

export type Lang = "en" | "es" | "ca";
export const langs: Lang[] = ["en", "es", "ca"];

export const social = {
  instagram: "https://www.instagram.com/l_ombra_del_coliseu/",
  facebook: "https://www.facebook.com/profile.php?id=61578273165908",
  tiktok: "https://www.tiktok.com/@lombradelcoliseu",
};

// À remplir : adresse e-mail de contact de l'asso (booking, presse).
export const contactEmail = "";

export type Event = {
  slug: string;
  title: string;
  date: string; // AAAA-MM-JJ
  doors?: string;
  start?: string;
  venue: string;
  address?: string;
  city: string;
  lineup: { name: string; genre: string; origin?: string }[];
  poster?: string; // chemin de l'affiche dans /public
  presale?: string; // prix anticipada
  presaleFee?: string; // frais de gestion billetterie
  door?: string; // prix taquilla
  ticketUrl?: string;
  status: "upcoming" | "past";
};

export const events: Event[] = [
  {
    slug: "between-the-frost-eternal-hunt",
    title: "Tarraco Black Metal Night II",
    date: "2026-10-30",
    doors: "20:00",
    start: "20:30",
    venue: "Sala Zero",
    address: "Carrer de Sant Magí, 12",
    city: "Tarragona",
    lineup: [
      { name: "Between The Frost", genre: "Black Metal", origin: "TGN" },
      { name: "Eternal Hunt", genre: "Black Metal", origin: "FR" },
    ],
    poster: "/events/tarraco-black-metal-night-ii.jpg",
    presale: "15 €",
    presaleFee: "2 €",
    door: "20 €",
    ticketUrl: "https://entradas.salazero.com/es/salazero/evento/between-the-frost-eternal-hunt-excm",
    status: "upcoming",
  },
  {
    slug: "tgn-black-metal-night-i",
    title: "TGN Black Metal Night I",
    date: "2026-06-19",
    venue: "Sala Zero",
    city: "Tarragona",
    lineup: [],
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

type Dict = Record<string, string>;

export const t: Record<Lang, Dict> = {
  en: {
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
