import { RiUserLine, RiErrorWarningLine } from "@remixicon/react"
import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"

interface EmptyStateProps {
  /**
   * Type d'état vide
   */
  variant?: "no-users" | "error" | "no-data"

  /**
   * Titre personnalisé
   */
  title?: string

  /**
   * Description personnalisée
   */
  description?: string

  /**
   * Icône personnalisée
   */
  icon?: ReactNode

  /**
   * Message d'erreur détaillé (pour variant="error")
   */
  errorMessage?: string
}

const VARIANTS = {
  "no-users": {
    title: "Aucun utilisateur",
    description: "Il n'y a aucun utilisateur dans le système pour le moment.",
    icon: RiUserLine,
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  "error": {
    title: "Erreur de chargement",
    description: "Une erreur s'est produite lors du chargement des données.",
    icon: RiErrorWarningLine,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive"
  },
  "no-data": {
    title: "Aucune donnée",
    description: "Aucune donnée disponible pour le moment.",
    icon: RiUserLine,
    bgColor: "bg-muted/50",
    iconColor: "text-muted-foreground"
  }
}

export function EmptyState({
  variant = "no-data",
  title,
  description,
  icon,
  errorMessage
}: EmptyStateProps) {
  const variantConfig = VARIANTS[variant]
  const IconComponent = icon || variantConfig.icon

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardContent className="p-12 text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-24 h-24 ${variantConfig.bgColor} rounded-full flex items-center justify-center`}>
                <IconComponent className={`w-12 h-12 ${variantConfig.iconColor}`} />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              {title || variantConfig.title}
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              {description || variantConfig.description}
            </p>
          </div>

          {/* Error Details */}
          {variant === "error" && errorMessage && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
                <RiErrorWarningLine className="w-5 h-5" />
                Détails de l'erreur
              </div>
              <div className="text-sm text-muted-foreground/70 break-words">
                {errorMessage}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}