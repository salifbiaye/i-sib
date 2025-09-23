"use client"

import { ReactNode } from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import {
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  type LucideIcon
} from "lucide-react"

interface InfoModalProps {
  /**
   * Modal ouvert ou fermé
   */
  isOpen: boolean

  /**
   * Fonction pour fermer le modal
   */
  onClose: () => void

  /**
   * Titre du modal
   */
  title: string

  /**
   * Type d'information (affecte les couleurs et icônes)
   */
  type?: "info" | "success" | "warning" | "error"

  /**
   * Contenu du modal (texte ou JSX)
   */
  children: ReactNode

  /**
   * Texte du bouton de fermeture
   */
  closeText?: string

  /**
   * Action optionnelle avec bouton
   */
  action?: {
    text: string
    onClick: () => void
    variant?: "default" | "outline" | "destructive"
  }

  /**
   * Taille du modal
   */
  size?: "sm" | "md" | "lg"
}

const typeConfig = {
  info: {
    icon: Info,
    iconClass: "text-blue-600 dark:text-blue-400",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/50"
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/50"
  },
  warning: {
    icon: AlertCircle,
    iconClass: "text-orange-600 dark:text-orange-400",
    iconBgClass: "bg-orange-100 dark:bg-orange-900/50"
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-600 dark:text-red-400",
    iconBgClass: "bg-red-100 dark:bg-red-900/50"
  }
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  type = "info",
  children,
  closeText = "Fermer",
  action,
  size = "md"
}: InfoModalProps) {
  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <div className="space-y-6">
        {/* Icon & Content */}
        <div className="flex gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.iconBgClass}`}>
            <IconComponent className={`h-5 w-5 ${config.iconClass}`} />
          </div>

          <div className="flex-1 text-sm text-foreground leading-relaxed">
            {children}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {closeText}
          </Button>

          {action && (
            <Button
              variant={action.variant || "default"}
              onClick={() => {
                action.onClick()
                onClose()
              }}
            >
              {action.text}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}