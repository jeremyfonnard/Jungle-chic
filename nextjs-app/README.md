# Jungle Chic - Next.js Fullstack E-commerce avec i18n

Application e-commerce complète Next.js 14 pour maillots de bain avec **internationalisation français/anglais**.

## 🌍 Nouveauté: Multilingue FR/EN

- **Français** (par défaut): `/fr/*`
- **English**: `/en/*`
- Sélecteur de langue dans la navbar
- Traductions complètes de l'interface

## ✨ Fonctionnalités Complètes

### E-commerce
- ✅ Catalogue produits avec filtres (catégorie, prix, couleur, taille)
- ✅ Pages détail produit avec galerie d'images
- ✅ Panier d'achat avec gestion des quantités
- ✅ Processus de checkout multi-étapes
- ✅ Paiements sécurisés Stripe
- ✅ Compte utilisateur avec historique des commandes

### Technique
- ✅ Next.js 14 App Router
- ✅ TypeScript fullstack
- ✅ API Routes (Backend)
- ✅ MongoDB avec Motor
- ✅ Zustand pour state management
- ✅ next-intl pour i18n
- ✅ Tailwind CSS + shadcn/ui
- ✅ Images optimisées avec Next/Image

## 🚀 Installation

### Prérequis
- Node.js 18+
- MongoDB
- Yarn

### Étapes

```bash
# Installer les dépendances
yarn install

# Configurer les variables d'environnement
# Créer .env.local avec:
MONGODB_URI=mongodb://localhost:27017
DB_NAME=test_database
JWT_SECRET=jungle-swimwear-secret-key-2024
STRIPE_SECRET_KEY=sk_test_emergent
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Initialiser les produits
node scripts/seed.js

# Lancer en développement
yarn dev

# Ouvrir http://localhost:3000/fr ou /en
```

## 📁 Structure

```
nextjs-app/
├── app/
│   ├── [locale]/              # Routes internationalisées
│   │   ├── home/             # Page d'accueil
│   │   ├── shop/             # Catalogue
│   │   ├── product/[id]/     # Détail produit
│   │   ├── auth/             # Authentification
│   │   ├── cart/             # Panier
│   │   ├── checkout/         # Checkout
│   │   │   └── success/      # Confirmation
│   │   ├── account/          # Compte utilisateur
│   │   └── about/            # À propos
│   ├── api/                  # API Routes (Backend)
│   │   ├── auth/             # Auth endpoints
│   │   ├── products/         # Produits
│   │   ├── cart/             # Panier
│   │   ├── orders/           # Commandes
│   │   └── payments/         # Stripe
│   ├── layout.tsx            # Layout racine
│   └── globals.css           # Styles globaux
├── components/
│   ├── Navbar.tsx            # Navigation + sélecteur langue
│   ├── Footer.tsx            # Footer
│   ├── ProductCard.tsx       # Carte produit
│   └── ui/                   # Composants shadcn/ui
├── lib/
│   ├── stores/               # Zustand stores
│   │   ├── auth.ts          # Store auth
│   │   └── cart.ts          # Store panier
│   ├── mongodb.ts           # Client MongoDB
│   ├── auth.ts              # Helpers auth JWT
│   ├── stripe.ts            # Helpers Stripe
│   └── utils.ts             # Utilitaires
├── messages/                 # Traductions i18n
│   ├── fr.json              # Français
│   └── en.json              # English
├── middleware.ts             # Middleware i18n
├── i18n.ts                  # Config i18n
└── scripts/
    └── seed.js              # Seed produits
```

## 🌐 URLs de l'Application

### Français
- `/fr/home` - Accueil
- `/fr/shop` - Boutique
- `/fr/product/[id]` - Détail produit
- `/fr/auth` - Connexion/Inscription
- `/fr/cart` - Panier
- `/fr/checkout` - Commande
- `/fr/account` - Mon compte
- `/fr/about` - À propos

### English
Remplacer `/fr` par `/en` pour toutes les URLs

## 🔑 API Endpoints

Tous les endpoints sont préfixés par `/api`:

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
- `POST /api/cart/update` - Modifier quantité
- `DELETE /api/cart/remove/[productId]/[size]/[color]` - Retirer

### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/[id]` - Détail commande

### Paiements
- `POST /api/payments/checkout` - Créer session Stripe
- `GET /api/payments/status/[sessionId]` - Statut paiement

## 🎨 Thème Jungle Chic

### Couleurs
- **Primary** (Vert jungle): `#1A4D2E` / `hsl(145 50% 20%)`
- **Secondary** (Sable doré): `#D4A373` / `hsl(30 50% 64%)`
- **Background** (Crème): `#F9F7F2` / `hsl(40 20% 96%)`
- **Accent** (Terracotta): `#E76F51` / `hsl(12 76% 61%)`

### Typographie
- **Headings**: Playfair Display (serif)
- **Body**: Manrope (sans-serif)

## 🛠️ Scripts

```bash
yarn dev          # Développement (port 3000)
yarn build        # Build production
yarn start        # Start production
yarn lint         # Linter
node scripts/seed.js  # Initialiser produits
```

## 🚀 Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur Vercel:
# - MONGODB_URI
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# - NEXT_PUBLIC_APP_URL
```

## 🆚 Avantages vs React + FastAPI

| Aspect | React + FastAPI | Next.js Fullstack |
|--------|----------------|-------------------|
| **Projets** | 2 séparés | 1 unifié ✅ |
| **Backend** | Python | TypeScript |
| **SEO** | Client-side | SSR ✅ |
| **i18n** | Manuel | next-intl ✅ |
| **Images** | Standard | Optimisées ✅ |
| **Déploiement** | 2 services | 1 clic Vercel ✅ |
| **Type Safety** | Backend only | Fullstack ✅ |

## 📝 Traductions

Toutes les traductions sont dans `/messages/`:
- `fr.json` - Français
- `en.json` - English

Pour ajouter une langue:
1. Créer `/messages/[locale].json`
2. Ajouter la locale dans `middleware.ts`
3. Traduire tous les strings

## 🔒 Sécurité

- JWT tokens (30 jours)
- Mots de passe hashés avec bcrypt
- Validation TypeScript
- Paiements Stripe sécurisés
- Variables d'environnement

## 🎯 Produits Inclus

6 produits pré-configurés:
- Maillots une pièce (3)
- Bikinis (2)  
- Paréo (1)

Prix: 45€ - 95€

## 💡 Prochaines Étapes

- Ajouter plus de langues (ES, DE, IT)
- Système de wishlist
- Avis clients
- Dashboard admin complet
- Filtres avancés
- Newsletter

## 📄 License

Projet de démonstration. Tous droits réservés.

---

**Créé avec Next.js 14, TypeScript, i18n et ❤️**
