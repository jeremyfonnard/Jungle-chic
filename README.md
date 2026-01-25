# Korail - Maillots de Bain Élégants

Application e-commerce de maillots de bain pour femmes avec un design plage élégant.

## 🌊 Aperçu

Korail est une boutique en ligne moderne proposant des maillots de bain inspirés par la beauté des plages. L'application supporte le français et l'anglais.

## 🛠️ Stack Technique

- **Framework:** Next.js 14 (App Router)
- **Langage:** TypeScript
- **Style:** TailwindCSS
- **Base de données:** MongoDB
- **Paiements:** Stripe
- **i18n:** next-intl

## 📁 Structure du Projet

```
/app/frontend/          # Application Next.js
├── app/
│   ├── [locale]/       # Routes internationalisées (fr, en)
│   │   ├── home/       # Page d'accueil
│   │   ├── shop/       # Catalogue produits
│   │   ├── product/    # Détail produit
│   │   ├── cart/       # Panier
│   │   ├── checkout/   # Paiement
│   │   ├── auth/       # Connexion/Inscription
│   │   ├── account/    # Compte utilisateur
│   │   └── about/      # À propos
│   └── api/            # Routes API
├── components/         # Composants React
├── lib/                # Utilitaires
└── messages/           # Traductions
```

## 🚀 Démarrage

```bash
cd frontend
yarn install
yarn dev
```

L'application sera accessible sur `http://localhost:3000`

## 🎨 Palette de Couleurs

- **Primaire:** Corail rosé
- **Accent:** Turquoise
- **Fond:** Crème/sable

## 📄 Licence

© 2026 Korail. Tous droits réservés.
