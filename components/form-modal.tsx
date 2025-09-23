"use client"

import { ReactNode, useState } from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Plus } from "lucide-react"

interface FormModalProps {
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
   * Description optionnelle
   */
  description?: string

  /**
   * Mode: create ou update
   */
  mode: "create" | "update"

  /**
   * Fonction appelée lors de la soumission
   */
  onSubmit: (data: any) => Promise<void> | void

  /**
   * Contenu du formulaire
   */
  children: ReactNode

  /**
   * Données initiales pour le mode update
   */
  initialData?: any

  /**
   * Taille du modal
   */
  size?: "sm" | "md" | "lg" | "xl"

  /**
   * Texte du bouton submit personnalisé
   */
  submitText?: string

  /**
   * Désactiver la validation
   */
  disabled?: boolean
}

export function FormModal({
  isOpen,
  onClose,
  title,
  description,
  mode,
  onSubmit,
  children,
  initialData,
  size = "lg",
  submitText,
  disabled = false
}: FormModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (disabled || isLoading) return

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // Merge avec les données initiales si mode update
    const finalData = mode === "update" && initialData
      ? { ...initialData, ...data }
      : data

    try {
      setIsLoading(true)
      await onSubmit(finalData)
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const defaultSubmitText = mode === "create"
    ? "Créer"
    : "Mettre à jour"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      preventClose={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Content */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            disabled={disabled || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mode === "create" ? "Création..." : "Mise à jour..."}
              </>
            ) : (
              <>
                {mode === "create" ? (
                  <Plus className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {submitText || defaultSubmitText}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}