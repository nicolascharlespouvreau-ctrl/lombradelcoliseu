# L'Ombra del Coliseu — site officiel

Next.js 16 · React 19 · TypeScript · CSS sur mesure. Trilingue EN / ES / CA.

## Lancer en local
npm install
npm run dev   → http://localhost:3000

## Modifier le contenu
Tout est dans `app/content.ts` :
- `events` : ajoute un concert en copiant un bloc (date AAAA-MM-JJ, salle, line-up, prix, lien billetterie).
  Les concerts passés basculent automatiquement dans « Past rituals ».
- `merch` : produits de la boutique.
- `t` : tous les textes, dans les 3 langues.
- `contactEmail` : adresse de l'asso. Une fois remplie, le formulaire Booking ouvre un mail pré-rempli.

## Mettre en ligne
Repo GitHub → vercel.com → Add New > Project → importer → Deploy.

## À brancher plus tard
- Newsletter : actuellement simulée (Brevo, Mailchimp ou Supabase).
- Billetterie : coller le lien (Entradium, Dice, Eventbrite…) dans `ticketUrl`.
- Merch : vente en ligne via Stripe Payment Links (un lien par produit).
