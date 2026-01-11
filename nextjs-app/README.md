# Jungle Chic - Next.js E-commerce

Application e-commerce fullstack Next.js 14 pour maillots de bain avec design jungle élégant.

## 🚀 Migration vers Next.js Complète!

Cette version utilise Next.js avec App Router, remplaçant complètement FastAPI + React séparés.

## ✨ Avantages de Next.js

- **Tout-en-un**: Frontend + Backend API dans un seul projet
- **SEO optimisé**: Server-Side Rendering pour meilleur référencement
- **Performance**: Server Components, optimisation automatique images
- **Déploiement facile**: Deploy sur Vercel en un clic
- **TypeScript**: Type safety pour backend et frontend

## 📦 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de données**: MongoDB
- **Auth**: JWT avec jsonwebtoken
- **Paiements**: Stripe
- **Notifications**: Sonner

## 🛠️ Installation

### Prérequis
- Node.js 18+
- MongoDB
- Yarn

### Étapes

```bash
# Installer les dépendances
yarn install

# Configurer les variables d'environnement
# Copier .env.local.example vers .env.local et remplir:
# - MONGODB_URI
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Initialiser les produits dans MongoDB
node scripts/seed.js

# Lancer en développement
yarn dev

# L'application sera sur http://localhost:3000
```

## 📁 Structure du Projet

```
nextjs-app/
├── app/
│   ├── api/              # API Routes (remplace FastAPI)
│   │   ├── auth/         # Authentification endpoints
│   │   ├── products/     # Produits endpoints
│   │   ├── cart/         # Panier endpoints
│   │   ├── orders/       # Commandes endpoints
│   │   └── payments/     # Paiements Stripe endpoints
│   ├── home/             # Page d'accueil
│   ├── shop/             # Page boutique
│   ├── product/[id]/     # Page détail produit
│   ├── auth/             # Page authentification
│   ├── cart/             # Page panier
│   ├── checkout/         # Pages checkout
│   ├── account/          # Page compte utilisateur
│   ├── about/            # Page à propos
│   ├── layout.tsx        # Layout principal
│   └── globals.css       # Styles globaux
├── components/           # Composants React
│   └── ui/              # Composants shadcn/ui
├── lib/                 # Utilitaires
│   ├── mongodb.ts       # Client MongoDB
│   ├── auth.ts          # Auth helpers
│   ├── stripe.ts        # Stripe helpers
│   └── utils.ts         # Utilitaires divers
├── scripts/
│   └── seed.js          # Script d'initialisation produits
└── package.json
```

## 🔑 API Routes (Next.js)

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/[id]` - Détail produit

### Panier
- `GET /api/cart` - Récupérer le panier
- `POST /api/cart/add` - Ajouter au panier
- `POST /api/cart/update` - Modifier la quantité
- `DELETE /api/cart/remove/[productId]/[size]/[color]` - Retirer un article

### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/[id]` - Détail d'une commande

### Paiements
- `POST /api/payments/checkout` - Créer une session Stripe
- `GET /api/payments/status/[sessionId]` - Vérifier le statut du paiement

## 🎨 Design

Le design suit les guidelines "Jungle Chic":
- Couleurs: Vert jungle (#1A4D2E), Doré (#D4A373), Crème (#F9F7F2)
- Typographie: Playfair Display (headings), Manrope (body)
- Style: Quiet Luxury avec touches tropicales

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur Vercel dashboard:
# - MONGODB_URI
# - JWT_SECRET  
# - STRIPE_SECRET_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### Autre plateforme

1. Build: `yarn build`
2. Start: `yarn start`
3. Configurer les variables d'environnement

## 🔒 Sécurité

- JWT tokens pour l'authentification
- Mots de passe hashés avec bcrypt
- Validation des données côté serveur
- Paiements sécurisés via Stripe

## 📝 Scripts Disponibles

```bash
yarn dev          # Développement
yarn build        # Build production
yarn start        # Start production
yarn lint         # Linter ESLint
node scripts/seed.js  # Initialiser les produits
```

## 🆚 Différences avec l'ancienne version

| Aspect | Ancienne (React + FastAPI) | Nouvelle (Next.js) |
|--------|---------------------------|-------------------|
| **Projets** | 2 séparés | 1 unifié |
| **Backend** | Python FastAPI | TypeScript API Routes |
| **Frontend** | React | Next.js (React) |
| **Routing** | React Router | Next.js App Router |
| **API** | REST séparé | API Routes intégrées |
| **SEO** | Client-side | Server-Side Rendering |
| **Déploiement** | 2 services | 1 service |
| **Type Safety** | Pydantic (backend) | TypeScript (fullstack) |

## 🎯 Prochaines Étapes

- Ajouter un système de wishlist
- Implémenter les avis clients
- Ajouter des filtres avancés
- Créer un dashboard admin complet
- Optimiser les images avec Next/Image

## 📄 License

Projet de démonstration. Tous droits réservés.

---

**Créé avec Next.js 14 et ❤️**
