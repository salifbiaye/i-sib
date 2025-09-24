// Configuration des types d'utilisateurs
export const USER_TYPES = {
  ADMIN: {
    value: "ADMIN",
    label: "Administrateur",
    description: "Administrateur système",
    badgeVariant: "default" as const
  },
  MANAGER: {
    value: "MANAGER",
    label: "Manager",
    description: "Gestionnaire/Manager",
    badgeVariant: "outline" as const
  },
  CUSTOMER: {
    value: "CUSTOMER",
    label: "Client",
    description: "Client/Utilisateur client",
    badgeVariant: "secondary" as const
  }
} as const

// Types dérivés
export type UserTypeValue = keyof typeof USER_TYPES
export type UserTypeConfig = typeof USER_TYPES[UserTypeValue]

// Tableau des types pour les selects
export const USER_TYPE_OPTIONS = Object.values(USER_TYPES)

// Helper pour obtenir la config d'un type
export function getUserTypeConfig(type: string): UserTypeConfig {
  return USER_TYPES[type as UserTypeValue] || USER_TYPES.USER
}

// Helper pour obtenir le variant du badge
export function getUserTypeBadgeVariant(type: string) {
  return getUserTypeConfig(type).badgeVariant
}