<div align="right">

🌐 **Languages**  
[🇺🇸 English](./README.md) |[🇰🇷 한국어](./README.ko.md)

</div>

# 🏪 Plateforme E-Commerce Next.js

> Une plateforme e-commerce full-stack moderne - Projet professionnel avec Next.js 15, Firebase et Prisma

---

## 🌐 Démo en ligne
Site de production : https://coscoree.vercel.app

---

## 🔐 Comptes de test

### **Compte Administrateur**
- **Email :** hoyoonju2@gmail.com  
- **Mot de passe :** TestAdmin12*/

### **Compte Utilisateur Standard**
- **Email :** cosmk.ho@gmail.com  
- **Mot de passe :** TestUser88=*/  

---

## 💳 Paiement de test Stripe

Utilisez les informations suivantes en mode test Stripe :

- **Numéro de carte :** 4242 4242 4242 4242  
- **Date d’expiration :** Toute date future  
- **CVC :** N’importe quels 3 chiffres  
- **Code postal :** N’importe quels 5 chiffres  

---

## 📸 Captures d’écran

### **Interface Utilisateur**

![Page d'accueil](./docs/home.png)  
*Page d’accueil principale*

![Page détail produit](./docs/detail.png)  
*Page de détail du produit*

![Panier](./docs/cart.png)  
*Panier — Calcul du prix en temps réel avant paiement*

---

### **Tableau de bord Administrateur**

![Liste des commandes](./docs/admin-i.png)  
*Dashboard admin — Gestion des commandes*

![Gestion des produits](./docs/admin-p.png)  
*Dashboard admin — Gestion des produits*

![Gestion des bannières](./docs/admin-b.png)  
*Dashboard admin — Gestion des images de bannière*

---

## 📖 Présentation du Projet

Ce projet est conçu comme un **site e-commerce prêt pour la production**.
Plus qu'une simple démonstration technique, il inclut toutes les fonctionnalités essentielles requises pour un service réel : authentification utilisateur, gestion des produits et stocks, traitement des paiements et gestion des commandes.
À travers ce projet, j'ai cherché à démontrer efficacement mes compétences en développement web full-stack et ma capacité de conception système.

### 🎯 Objectifs du Projet

1. **Offrir une Expérience E-Commerce Complète**
   - Implémenter le flux complet de la navigation produit, l'ajout au panier jusqu'à la finalisation du paiement

2. **Utiliser une Stack Technologique Moderne**
   - Appliquer les patterns React modernes avec l'App Router de Next.js 15 et les Server Actions
   - Assurer la sécurité des types avec TypeScript

3. **Architecture Évolutive**
   - Structure de base de données hybride combinant les forces de Firebase et PostgreSQL
   - Maintenabilité améliorée grâce à la séparation des préoccupations

4. **Qualité de Code Niveau Production**
   - Code prêt pour la production prenant en compte la gestion des erreurs, la sécurité et l'optimisation des performances

---

## 🏗️ Philosophie de Conception Architecture

### Pourquoi Cette Structure ?

#### 1️⃣ **Stratégie de Base de Données Hybride**
![Diagramme de Structure de Données](./docs/Datastructure.png)

**Raisons du Choix :**
- **Firebase** : Lecture/écriture rapide, synchronisation en temps réel, uploads de fichiers faciles (images produits, etc.)
- **PostgreSQL + Prisma** : Données relationnelles complexes, garantie de transactions ACID (les paiements ne doivent jamais échouer !)

#### 2️⃣ **Next.js 15 App Router + Server Actions**

**Raisons du Choix :**
- 🚀 **Performance** : Vitesse de chargement initiale améliorée avec les Server Components (également bénéfique pour le SEO)
- 🔒 **Sécurité** : Traitement de la logique sensible côté serveur (clés API, traitement des paiements, etc.)
- 🎨 **Expérience Développeur** : Gestion du code client/serveur dans un seul fichier

```typescript
// Approche traditionnelle : API Route + fetch
await fetch('/api/orders', { method: 'POST' })

// Nouvelle approche : Server Action (plus simple et type-safe !)
await createOrder(orderData)
```

#### 3️⃣ **Authentification : Firebase Auth + Session Cookies**

**Raisons du Choix :**
- Connexion sociale facile avec Firebase Auth (Google, Email/Password)
- Vérification sécurisée de l'état d'authentification dans les Server Components avec les Session Cookies
- Protection contre les attaques XSS avec les cookies `httpOnly`

---

## ✨ Fonctionnalités Principales

### 🛒 Expérience d'Achat

| Fonctionnalité | Description | Technologies |
|----------------|-------------|--------------|
| **Navigation Produits** | Recherche, filtrage, tri | React Hook Form, Zod |
| **Panier** | Modifications de quantité en temps réel, calcul des prix | Firebase Firestore |
| **Système d'Avis** | Écrire, modifier, supprimer des avis avec mises à jour en temps réel | Firebase |
| **Liste de Souhaits** | Ajouter et retirer des produits favoris | Firebase |
| **Application de Coupons** | Appliquer des réductions et vérifier l'utilisation | Firebase, Prisma |
| **Utilisation de Points** | Utiliser et gagner des points sur les commandes | Prisma |
| **Recherche/Filtre Produits** | Filtres par catégorie, recherche de produits | Firebase, filtre client |

### 💳 Système de Paiement
![Diagramme de Paiement](./docs/paymentdiagram.png) 

**Pourquoi Stripe ?**
- 🌍 Solution de paiement standard internationale
- 🔐 Conforme PCI-DSS (les informations de carte ne sont jamais stockées sur nos serveurs)
- 🧪 Convivial pour les développeurs (mode test, documentation détaillée)

### 👨‍💼 Fonctionnalités Administrateur

| Fonctionnalité | Description | Technologies |
|----------------|-------------|--------------|
| **Gestion des Produits** | Créer, mettre à jour, supprimer des produits et télécharger des images | Firebase, Next.js Server Actions |
| **Gestion des Bannières** | Ajouter, supprimer, modifier les images de bannière de la page d'accueil | Firebase Storage, Firestore |
| **Gestion des Images de Menu** | CRUD pour les images de catégorie/menu | Firebase |
| **Paramètres Vente/Promotion** | Définir le statut de vente des produits et gérer les prix de vente | Firebase |
| **Gestion des Coupons** | Enregistrer, supprimer, définir des périodes, vérifier l'utilisation utilisateur | Firebase, Prisma |
| **Gestion des Commandes** | Voir les listes de commandes utilisateur et mettre à jour le statut | Prisma, Server Components |
| **Gestion du Contenu du Site** | Gérer le contenu affiché sur l'écran d'accueil | Firebase |
| **Tableau de Bord Admin** | Visualiser les ventes, volume de commandes, statistiques produits | Prisma, Server Components |

**Gestion des Permissions :**
```typescript
// Schéma Prisma
model User {
  isAdmin Boolean @default(false)  // Drapeau administrateur
}
```

---

## 🔧 Choix Technologiques et Raisons

### Frontend

| Technologie | Raison d'Utilisation |
|-------------|----------------------|
| **Tailwind CSS 4** | Développement UI rapide, système de design cohérent |
| **shadcn/ui (basé sur Radix UI)** | Composants UI accessibles et stylisables avec une excellente UX |
| **React Hook Form** | Gestion de formulaires optimisée pour les performances |
| **Zod** | Validation de type au runtime (serveur/client) |

### Backend

| Technologie | Raison d'Utilisation |
|-------------|----------------------|
| **Prisma** | ORM type-safe, migrations faciles |
| **Firebase Admin SDK** | Opérations Firebase sécurisées depuis le serveur |
| **Next.js API Routes** | Gérer le full-stack dans un seul projet |

---

## 🚀 Démarrage

### Prérequis

- Node.js 18+
- Base de données PostgreSQL
- Projet Firebase
- Compte Stripe

### Installation et Configuration

```bash
# 1. Cloner le dépôt
git clone https://github.com/yoonju88/next_blog.git
cd next_blog

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Exécuter les migrations de base de données
npx prisma migrate dev

# 5. Démarrer le serveur de développement
npm run dev
```

---

## 📂 Structure du Projet

```
next_blog/
├── app/                                   # Next.js App Router
│   ├── (auth)/                            # Connexion, inscription, réinitialisation du mot de passe
│   ├── (shop)/                            # Pages shopping (liste produits, détails)
│   ├── account/                           # Pages compte utilisateur
│   ├── admin/                             # Pages admin (gestion produits/bannières/menus)
│   └── api/                               # API Routes
│       ├── payment/                       # APIs liées aux paiements
│       └── cart/                          # APIs liées au panier
│
├── components/                            # Composants React
│   ├── ui/                                # UI partagée basée sur shadcn/ui
│   └── admin/                             # Composants spécifiques admin
│
├── context/                               # Gestion d'état globale (Context API)
│   ├── AuthContext.tsx                    # État d'authentification
│   ├── CartContext.tsx                    # État du panier
│   └── FilterContext.tsx                  # État recherche/filtre
│
├── data/                                  # Données statiques, options, données fictives
├── docs/                                  # Images de documentation, diagrammes
│   └── Datastructure.png                  # Images de structure DB/architecture
│
├── firebase/                              # Configuration Firebase
│   ├── client.ts                          # Firebase Client SDK
│   └── server.ts                          # Firebase Admin SDK
│
├── function/                              # Fonctions utilitaires côté serveur, couche service
├── generated/                             # Prisma / fichiers auto-générés
│
├── hooks/                                 # Hooks personnalisés
│   ├── use-mobile.ts                      # Hook de détection mobile
│   └── useUserPoints.ts                   # Hook points utilisateur
│
├── lib/                                   # API, auth, utilitaires couche service
│   ├── auth/                              # Fonctions service d'authentification
│   ├── user/                              # Fonctions service liées aux utilisateurs
│   └── prisma.ts                          # Création client Prisma
│
├── prisma/                                # Configuration Prisma ORM
│   └── schema.prisma                      # Définition du schéma DB
│
├── public/                                # Fichiers statiques (images, icônes)
├── scripts/                               # Scripts build/déploiement/dev
├── types/                                 # Types TypeScript globaux
├── utils/                                 # Fonctions utilitaires pures
├── validation/                            # Schémas de validation d'entrée basés sur Zod
│
├── package.json
├── tsconfig.json
└── README.md (EN, KR, FR)
```

---

## 💡 Apprentissages Clés

### 1. **Pourquoi Utiliser Prisma et Firebase Ensemble ?**

Dans les services e-commerce, différents types de données nécessitent différents niveaux de performance et de fiabilité.
Utiliser une seule base de données pour toutes les données peut entraîner des inefficacités.

La raison d'utiliser Firebase et PostgreSQL ensemble est de tirer parti des forces de chacun de manière précise.
En choisissant le stockage optimal basé sur les caractéristiques des données, j'ai utilisé Firebase (temps réel/flexibilité) + PostgreSQL (cohérence/transactions).

# 🔥 Firebase (NoSQL)

- Mises à jour en temps réel
- Requêtes rapides
- Structure flexible
- Idéal pour les données axées sur l'expérience utilisateur

Optimisé pour les données changeant rapidement nécessitant des réponses en temps réel,
donc les données centrées sur l'UI comme les paniers, avis, j'aime, infos produits, images promotionnelles et données utilisateur
sont beaucoup plus efficaces avec Firebase.

# 🧊 PostgreSQL (SQL)

- Transactions ACID
- Structure relationnelle
- Gère les informations sensibles comme les paiements, commandes, points

Adapté aux données critiques où la précision et la stabilité sont primordiales,
donc les données de logique métier de base comme les commandes, paiements, inventaire, coupons et points
sont plus sûres avec PostgreSQL.

### 2. **La Vraie Valeur des Server Actions**

```typescript
// Avant : API Route complexe + fetch
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
const result = await response.json()

// Après : Server Action simple
const result = await createOrder(data)
```

**Leçon :**
- Les Server Actions sont beaucoup plus efficaces pour les tâches simples
- La sécurité des types est automatiquement assurée

### 3. **Défis de l'Implémentation du Système de Paiement**

La fonctionnalité de paiement est la zone la plus sensible de l'ensemble du service et ne doit jamais échouer.
C'est pourquoi j'ai été particulièrement prudent lors de l'implémentation.

- Utilisation des transactions Prisma pour assurer la cohérence des données entre commandes et paiements
- Planification d'implémenter une vérification supplémentaire côté serveur via les Webhooks Stripe pour confirmer l'achèvement réel du paiement
- Conception soignée des flux de gestion d'erreurs pour se préparer aux problèmes inattendus
  - Re-vérifier les paiements Stripe sur le serveur
  - Regrouper commandes, paiements et inventaire dans des transactions pour que tout soit annulé si quelque chose échoue
  - Planification d'ajouter des protections contre les appels webhook dupliqués ou les erreurs API Stripe

**Leçon :**
- Tester les fonctionnalités liées à l'argent des dizaines de fois
- Considérer tous les cas limites

---

## 🐛 Expérience de Dépannage

### Problème 1 : Erreur d'Initialisation du Client Prisma

```
Error: @prisma/client did not initialize yet
```

**Cause :** Conflit avec le système de bundling webpack de Next.js 15

**Solution :**
```typescript
// next.config.ts
export default {
  serverExternalPackages: ['@prisma/client', 'prisma']
}
```

### Problème 2 : Le Panier ne se Vide pas Après le Paiement

**Cause :** Mauvaise compréhension de la structure de données Firestore comme sous-collections

**Solution :** 
- La structure réelle est `users/{uid}/cart: []` (champ tableau)
- Mise à jour directe avec `update({ cart: [] })`

**Leçon :** Comprendre et documenter clairement les structures de données !

---

## 🔜 Plans Futurs

- [ ] 💌 Système de notification par email (confirmation de commande, alertes d'expédition)
- [ ] ✉️ Construire un système d'email de contact/demande
- [ ] 🔔 Intégration complète des Webhooks Stripe
- [ ] 📊 Tableau de bord statistiques admin avancé avec insights de données
- [ ] 🤖 Génération automatique de données basée sur l'IA (métadonnées produits, résumés, etc.)
- [ ] 📱 Améliorations du design responsive
- [ ] 🧪 Introduire des tests automatisés (tests E2E Playwright + tests unitaires Jest)

---

## 📄 Licence

Ce projet est sous licence MIT.
Cette licence est une licence open-source très flexible qui permet l'utilisation, la copie, la modification et la distribution libres du logiciel.
Copyright (c) 2025 TERRENOIRE HO Yoonju

---

## 🙏 Références

- [Documentation Next.js 15](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Documentation Firebase](https://firebase.google.com/docs)

---

## 📧 Contact

Si vous avez des questions ou des suggestions concernant le projet, n'hésitez pas à ouvrir une issue !

---

**⭐ Si ce projet vous a été utile, merci de lui donner une étoile !**