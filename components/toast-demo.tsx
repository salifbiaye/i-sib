"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Button
        onClick={() => toast.success("Utilisateur créé avec succès !")}
        variant="default"
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        Toast Succès
      </Button>

      <Button
        onClick={() => toast.error("Erreur lors de la suppression")}
        variant="destructive"
      >
        Toast Erreur
      </Button>

      <Button
        onClick={() => toast.warning("Attention : action irréversible")}
        variant="outline"
        className="border-orange-300 text-orange-600 hover:bg-orange-50"
      >
        Toast Warning
      </Button>

      <Button
        onClick={() => toast.info("Informations mises à jour")}
        variant="outline"
        className="border-blue-300 text-blue-600 hover:bg-blue-50"
      >
        Toast Info
      </Button>
    </div>
  )
}