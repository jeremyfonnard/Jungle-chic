# Jungle Chic - E-commerce de Maillots de Bain

## Énoncé du Problème Original
Application e-commerce pour vendre des maillots de bain pour femmes avec un thème jungle, inspiré de https://www.bellesdespins.com.

## Exigences Produit
- **Fonctionnalité:** Site e-commerce complet
- **Paiements:** Intégration Stripe et PayPal
- **Authentification:** Inscription et connexion utilisateur
- **Stack Technique:** Next.js (App Router) + MongoDB
- **Internationalisation:** Support Français (fr) et Anglais (en)
- **Design:** Thème jungle élégant

## Architecture Technique
```
/app/frontend/              # Application Next.js
├── app/
│   ├── [locale]/          # Routes internationalisées
│   │   ├── home/          # Page d'accueil
│   │   ├── shop/          # Catalogue produits
│   │   ├── product/[id]/  # Détail produit
│   │   ├── cart/          # Panier
│   │   ├── checkout/      # Paiement
│   │   ├── auth/          # Connexion/Inscription
│   │   ├── account/       # Compte utilisateur
│   │   └── about/         # À propos
│   └── api/               # Routes API
│       ├── auth/          # Authentification
│       ├── products/      # Gestion produits
│       ├── cart/          # Gestion panier
│       ├── orders/        # Gestion commandes
│       └── payments/      # Paiements Stripe
├── components/            # Composants React
├── lib/                   # Utilitaires (MongoDB, Stripe, stores)
└── messages/              # Fichiers de traduction
```

## Ce qui a été implémenté

### ✅ Complété (12 Janvier 2026)
- Migration complète de FastAPI/React vers Next.js
- Configuration next-intl pour i18n (FR/EN)
- Pages: Home, Shop, Product Detail, Cart, Checkout, Auth, Account, About
- APIs: Products, Auth (login/register), Cart, Orders, Stripe Payments
- Base de données MongoDB avec seed de 6 produits
- Intégration Stripe pour les paiements
- **Bug fix:** Résolution du problème d'affichage des produits sur la page shop
  - Cause: Double définition de `<html>` et `<body>` dans les layouts causant des erreurs d'hydratation React
  - Solution: Layout racine avec HTML/body, layout locale sans HTML/body

## Backlog Prioritisé

### P0 - Critique
- ✅ Affichage des produits sur la page shop - RÉSOLU

### P1 - Haute priorité
- [ ] Intégration PayPal (demandé par l'utilisateur)
- [ ] Test end-to-end du parcours utilisateur complet

### P2 - Moyenne priorité
- [ ] Historique des commandes sur la page compte
- [ ] Suppression des anciens dossiers `/app/backend` et `/app/frontend_old_backup`

### P3 - Basse priorité
- [ ] Optimisation des images produits
- [ ] SEO et métadonnées par page

## URLs de l'Application
- Accueil: `/fr/home` ou `/en/home`
- Boutique: `/fr/shop` ou `/en/shop`
- Produit: `/fr/product/[id]`
- Panier: `/fr/cart`
- Paiement: `/fr/checkout`
- Connexion: `/fr/auth`
- Compte: `/fr/account`

## Variables d'Environnement Requises
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=test_database
JWT_SECRET=jungle-swimwear-secret-key-2024
STRIPE_SECRET_KEY=sk_test_emergent
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

## Commandes Utiles
```bash
# Lancer le serveur de développement
cd /app/frontend && yarn dev

# Seed la base de données
node scripts/seed.js
```
