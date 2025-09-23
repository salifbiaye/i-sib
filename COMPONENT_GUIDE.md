# 📋 Guide des Composants

Ce guide présente l'architecture des composants réutilisables du projet.

## 🏗️ Architecture

```
components/           # Composants globaux réutilisables
├── ui/              # Composants UI de base (shadcn/ui)
├── data-table.tsx   # Table de données réutilisable
├── data-search.tsx  # Recherche avec debounce
├── data-filter.tsx  # Filtres et tri
├── data-pagination.tsx # Pagination
├── modal.tsx        # Modal de base
├── form-modal.tsx   # Modal avec formulaire
├── confirm-modal.tsx # Modal de confirmation
└── info-modal.tsx   # Modal d'information

features/            # Fonctionnalités métier
└── user/           # Feature gestion utilisateurs
    ├── components/  # Composants spécifiques aux users
    ├── actions/     # Server actions
    ├── types/       # Types et configurations
    └── index.ts     # Export centralisé
```

## 🧩 Composants Globaux Réutilisables

### 📊 DataTable
**Fichier:** `components/data-table.tsx`
**Usage:** Table générique avec colonnes configurables et actions

```tsx
<DataTable
  data={users}
  columns={[
    { key: "name", label: "Nom", render: (value) => <span>{value}</span> },
    { key: "email", label: "Email" }
  ]}
  actions={[
    { label: "Modifier", onClick: (item) => edit(item) },
    { label: "Supprimer", onClick: (item) => delete(item), variant: "destructive" }
  ]}
  loading={false}
  emptyState={<EmptyState />}
/>
```

**Fonctionnalités:**
- ✅ Colonnes avec rendu personnalisé
- ✅ Actions par ligne (dropdown)
- ✅ États de chargement
- ✅ État vide personnalisable
- ✅ Responsive

### 🔍 DataSearch
**Fichier:** `components/data-search.tsx`
**Usage:** Barre de recherche avec debounce et synchronisation URL

```tsx
<DataSearch
  placeholder="Rechercher des utilisateurs..."
  debounceMs={300}
/>
```

**Fonctionnalités:**
- ✅ Debounce personnalisable (300ms par défaut)
- ✅ Synchronisation avec URL params
- ✅ Icône de recherche
- ✅ Clear automatique

### 🔀 DataFilter
**Fichier:** `components/data-filter.tsx`
**Usage:** Dropdown de tri et filtres

```tsx
<DataFilter
  sortOptions={[
    { label: "Date création", value: "dateCreation", field: "dateCreation" },
    { label: "Nom", value: "name", field: "name" }
  ]}
  filterOptions={[
    { label: "Actifs", value: "active", field: "status" },
    { label: "Inactifs", value: "inactive", field: "status" }
  ]}
/>
```

**Fonctionnalités:**
- ✅ Tri ascendant/descendant
- ✅ Filtres multiples
- ✅ Synchronisation URL
- ✅ Indicateurs visuels

### 📄 DataPagination
**Fichier:** `components/data-pagination.tsx`
**Usage:** Pagination complète avec sélection de taille

```tsx
<DataPagination
  totalItems={250}
  defaultPageSize={10}
  pageSizeOptions={[10, 25, 50, 100]}
/>
```

**Fonctionnalités:**
- ✅ Navigation précédent/suivant
- ✅ Sélection page directe
- ✅ Choix taille de page
- ✅ Info "X de Y éléments"
- ✅ Synchronisation URL

## 🪟 Système de Modales

### 🔧 Modal (Base)
**Fichier:** `components/modal.tsx`
**Usage:** Modal de base avec animations

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Titre du modal"
  size="md"
  preventClose={false}
>
  <p>Contenu du modal</p>
</Modal>
```

### 📝 FormModal
**Fichier:** `components/form-modal.tsx`
**Usage:** Modal avec formulaire intégré

```tsx
<FormModal
  isOpen={isOpen}
  onClose={onClose}
  title="Créer utilisateur"
  description="Ajouter un nouvel utilisateur"
  mode="create"
  onSubmit={handleSubmit}
  size="lg"
  initialData={user}
>
  <Input name="name" placeholder="Nom" />
  <Input name="email" type="email" placeholder="Email" />
</FormModal>
```

**Fonctionnalités:**
- ✅ Modes: create/update
- ✅ Validation automatique
- ✅ États de chargement
- ✅ Gestion erreurs
- ✅ Data binding automatique

### ⚠️ ConfirmModal
**Fichier:** `components/confirm-modal.tsx`
**Usage:** Modal de confirmation d'actions

```tsx
<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  title="Supprimer utilisateur"
  message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
  details="Cette action est irréversible"
  type="danger"
  onConfirm={handleDelete}
  confirmText="Supprimer"
/>
```

**Types disponibles:**
- `danger` (rouge) - Suppressions
- `warning` (orange) - Actions risquées
- `success` (vert) - Confirmations positives
- `info` (bleu) - Informations

### ℹ️ InfoModal
**Fichier:** `components/info-modal.tsx`
**Usage:** Modal d'information simple

```tsx
<InfoModal
  isOpen={isOpen}
  onClose={onClose}
  title="Information"
  type="success"
  action={{
    text: "Continuer",
    onClick: handleContinue,
    variant: "default"
  }}
>
  <p>Opération réussie !</p>
</InfoModal>
```

## 🍞 Système de Toast

**Fichier:** `lib/toast.tsx`
**Usage:** Notifications temporaires avec animations

```tsx
import { toast } from "@/lib/toast"

// Types disponibles
toast.success("Utilisateur créé avec succès")
toast.error("Erreur lors de la création")
toast.warning("Attention: données modifiées")
toast.info("Information importante")

// Avec options
toast.success("Message", {
  duration: 5000,
  position: "top-center"
})
```

**Fonctionnalités:**
- ✅ 4 types avec couleurs
- ✅ Animations fluides (framer-motion)
- ✅ Auto-dismiss configurable
- ✅ Positionnement flexible
- ✅ Stack multiple
- ✅ Effets visuels (shimmer)

## 🎯 Features - Gestion Utilisateurs

### 📁 Structure
```
features/user/
├── components/
│   ├── users-data-table.tsx    # Table principale
│   └── user-modals.tsx         # Modales CRUD
├── actions/
│   └── user-actions.ts         # Server actions
├── types/
│   └── user-types.ts           # Types et config
└── index.ts                    # Exports centralisés
```

### 🔧 UsersDataTable
**Usage:** Table complète de gestion utilisateurs

```tsx
import { UsersDataTable } from "@/features/user"

<UsersDataTable initialData={usersData} />
```

**Fonctionnalités intégrées:**
- ✅ Recherche, tri, pagination
- ✅ Actions CRUD (créer, modifier, supprimer)
- ✅ Badges de rôles colorés
- ✅ Avatars générés
- ✅ États de chargement
- ✅ Synchronisation temps réel

### 🪟 User Modals
**Components:** `UserCreateModal`, `UserEditModal`, `UserDeleteModal`

```tsx
import { UserCreateModal, UserEditModal, UserDeleteModal } from "@/features/user"

<UserCreateModal
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  onRefresh={refreshData}
/>
```

**Fonctionnalités:**
- ✅ Formulaires validés
- ✅ Refresh automatique des données
- ✅ Toasts de confirmation
- ✅ Champs sécurisés (username/rôle non-éditables)

## 🚀 Bonnes Pratiques

### 📦 Import/Export
```tsx
// ✅ Utiliser les exports centralisés
import { UsersDataTable, createUser } from "@/features/user"

// ✅ Composants globaux depuis /components
import { DataTable, FormModal } from "@/components"

// ✅ UI components depuis /ui
import { Button, Input } from "@/components/ui"
```

### 🎨 Styling
```tsx
// ✅ Classes Tailwind cohérentes
className="bg-muted cursor-not-allowed"  // Disabled
className="text-muted-foreground"        // Secondary text
className="border-border"                // Borders
className="bg-card"                      // Card backgrounds
```

### 🔄 State Management
```tsx
// ✅ Actions serveur pour mutations
const result = await createUser(userData)
if (result.success && result.shouldRefresh) {
  onRefresh() // Refresh data
}

// ✅ URL sync pour filters/search/pagination
const searchParams = useSearchParams()
const search = searchParams.get("search") || ""
```

### 🎯 Performance
```tsx
// ✅ Debounce pour recherche
const [search, setSearch] = useState("")
useEffect(() => {
  const timeout = setTimeout(() => {
    // Update URL
  }, 300)
  return () => clearTimeout(timeout)
}, [search])

// ✅ Pagination côté serveur
const apiUrl = `/api/users/paginated?page=${page}&size=${size}`
```

---

## 📝 Checklist Nouveau Composant

Avant de créer un nouveau composant :

- [ ] Est-ce réutilisable ? → `/components`
- [ ] Spécifique à une feature ? → `/features/[name]/components`
- [ ] Besoin d'animations ? → Utiliser framer-motion
- [ ] Formulaire ? → Étendre FormModal
- [ ] Confirmation ? → Utiliser ConfirmModal
- [ ] Données tabulaires ? → Étendre DataTable
- [ ] Documentation mise à jour ? → Ce guide

**Bonne codage ! 🚀**