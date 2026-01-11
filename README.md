# Jungle Chic - E-commerce de Maillots de Bain

Application e-commerce complète pour la vente de maillots de bain pour femmes avec un design élégant inspiré de la jungle.

## 🌴 Fonctionnalités

### Pour les clients:
- **Catalogue produits** avec filtres (catégorie, prix, taille, couleur)
- **Système d'authentification** (inscription/connexion)
- **Panier d'achat** avec gestion des quantités
- **Processus de commande** complet
- **Paiement sécurisé** via Stripe
- **Compte utilisateur** avec historique des commandes
- **Design responsive** pour mobile et desktop

### Fonctionnalités techniques:
- Architecture React + FastAPI + MongoDB
- Authentification JWT
- Intégration paiement Stripe
- Design system personnalisé (couleurs jungle tropicale)
- Gestion d'état avec Context API
- Composants UI réutilisables (shadcn/ui)

## 🚀 Stack Technique

**Frontend:**
- React 19
- React Router v7
- Tailwind CSS
- shadcn/ui components
- Axios
- Lucide React (icônes)
- Sonner (notifications)

**Backend:**
- Python 3.11
- FastAPI
- Motor (async MongoDB driver)
- Pydantic
- JWT Authentication
- bcrypt
- emergentintegrations (Stripe)

**Base de données:**
- MongoDB

## 📦 Installation

### Prérequis
- Node.js 18+ et Yarn
- Python 3.11+
- MongoDB

### Installation Backend

```bash
cd backend
pip install -r requirements.txt

# Configurer les variables d'environnement
# Éditer .env avec vos valeurs:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=jungle_chic_db
# STRIPE_API_KEY=votre_clé_stripe
# JWT_SECRET=votre_secret_jwt

# Initialiser les produits
python seed_products.py

# Lancer le serveur
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Installation Frontend

```bash
cd frontend
yarn install

# Configurer les variables d'environnement
# Éditer .env avec:
# REACT_APP_BACKEND_URL=http://localhost:8001

# Lancer l'application
yarn start
```

## 🎨 Design Guidelines

### Palette de couleurs
- **Primary (Vert jungle):** #1A4D2E
- **Secondary (Sable doré):** #D4A373  
- **Background:** #F9F7F2 (crème)
- **Accent:** #E76F51 (terracotta)

### Typographie
- **Headings:** Playfair Display (serif)
- **Body:** Manrope (sans-serif)

### Style
- Design "Quiet Luxury" avec touches tropicales
- Composants avec glassmorphism
- Animations subtiles au hover
- Espacement généreux
- Images haute qualité

## 📁 Structure du Projet

```
/app
├── backend/
│   ├── server.py           # API FastAPI principale
│   ├── seed_products.py    # Script d'initialisation des produits
│   ├── requirements.txt    # Dépendances Python
│   └── .env               # Variables d'environnement
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   └── ui/        # Composants shadcn/ui
│   │   ├── contexts/      # Contextes React
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/         # Pages de l'application
│   │   │   ├── HomePage.js
│   │   │   ├── ShopPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── AuthPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── CheckoutSuccessPage.js
│   │   │   ├── AccountPage.js
│   │   │   └── AboutPage.js
│   │   ├── App.js         # Composant principal avec routing
│   │   ├── App.css        # Styles personnalisés
│   │   └── index.css      # Styles globaux + Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
└── design_guidelines.json  # Spécifications design complètes
```

## 🔑 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/{id}` - Détails d'un produit

### Panier
- `GET /api/cart` - Récupérer le panier
- `POST /api/cart/add` - Ajouter au panier
- `POST /api/cart/update` - Modifier la quantité
- `DELETE /api/cart/remove/{id}/{size}/{color}` - Retirer un article
- `DELETE /api/cart/clear` - Vider le panier

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/{id}` - Détails d'une commande

### Paiements
- `POST /api/payments/checkout` - Créer une session de paiement Stripe
- `GET /api/payments/status/{session_id}` - Vérifier le statut du paiement
- `POST /api/webhook/stripe` - Webhook Stripe

## 🔒 Sécurité

- Authentification JWT avec tokens sécurisés
- Hashage des mots de passe avec bcrypt
- CORS configuré
- Validation des données avec Pydantic
- Paiements sécurisés via Stripe

## 💳 Configuration Stripe

1. Créer un compte sur [Stripe](https://stripe.com)
2. Récupérer votre clé API test (`sk_test_...`)
3. Ajouter la clé dans `backend/.env`: `STRIPE_API_KEY=sk_test_...`
4. Pour les paiements en production, utiliser la clé live

## 🎯 Produits Initiaux

L'application vient avec 8 produits pré-configurés:
- Maillots une pièce (4 modèles)
- Bikinis (3 modèles)
- Tankini (1 modèle)
- Paréo (1 modèle)

Prix: 45€ - 95€

## 📱 Pages de l'Application

1. **Home (/)** - Page d'accueil avec hero et produits vedettes
2. **Shop (/shop)** - Catalogue complet avec filtres
3. **Product Detail (/product/:id)** - Détails produit avec sélection taille/couleur
4. **Auth (/auth)** - Inscription et connexion
5. **Cart (/cart)** - Panier d'achat
6. **Checkout (/checkout)** - Processus de commande
7. **Success (/checkout/success)** - Confirmation de commande
8. **Account (/account)** - Profil et historique
9. **About (/about)** - À propos de la marque

## 🐛 Problèmes Connus

Selon les derniers tests:
- Quelques ajustements mineurs peuvent être nécessaires pour le sélecteur de taille
- La synchronisation du panier après connexion peut nécessiter un refresh

## 🚀 Déploiement

L'application est déjà configurée pour Emergent avec:
- Hot reload pour le développement
- Variables d'environnement séparées
- Configuration Supervisor pour les services

## 📄 License

Projet créé pour démonstration. Tous droits réservés.

## 👨‍💻 Développé avec

Créé avec Emergent AI - Plateforme de développement assisté par IA

---

**Note:** Pour toute question ou support, consultez la documentation d'Emergent ou contactez le support.
