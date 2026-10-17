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

## Boutique (Stripe)
- Produits, tailles, prix (en centimes) et statut dans `app/content.ts` → `merch`.
  status : "available" (en vente), "preorder" (pré-commande payée tout de suite), "soldout" (épuisé).
- Frais de port : `shipping` dans `app/content.ts`.
- Paiement : la clé secrète Stripe va dans Vercel → Settings → Environment Variables → `STRIPE_SECRET_KEY`
  (jamais dans le code). Sans clé, la boutique affiche « pas encore ouverte ».
- Les commandes (taille, retrait/envoi, adresse, téléphone, pré-commande) arrivent dans le tableau de bord Stripe → Paiements.

## À brancher plus tard
- Newsletter : actuellement simulée (Brevo, Mailchimp ou Supabase).
- Billetterie : coller le lien (Entradium, Dice, Eventbrite…) dans `ticketUrl`.
