"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModalProps {
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
  title?: string

  /**
   * Description optionnelle
   */
  description?: string

  /**
   * Contenu du modal
   */
  children: ReactNode

  /**
   * Taille du modal
   */
  size?: "sm" | "md" | "lg" | "xl" | "full"

  /**
   * Désactiver la fermeture par clic extérieur
   */
  preventClose?: boolean

  /**
   * Classe CSS personnalisée
   */
  className?: string
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4"
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  preventClose = false,
  className = ""
}: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose) {
      onClose()
    }
  }

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !preventClose) {
      onClose()
    }
  }

  // Écoute la touche Escape
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleEscapeKey)
    if (!isOpen) {
      window.removeEventListener("keydown", handleEscapeKey)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-card border border-border rounded-xl shadow-xl
              ${className}
            `}
          >
            {/* Header */}
            {(title || !preventClose) && (
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  {title && (
                    <h2 className="text-xl font-semibold text-foreground">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {description}
                    </p>
                  )}
                </div>
                {!preventClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}