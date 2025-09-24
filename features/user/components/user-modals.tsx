"use client"

import { useState } from "react"
import { FormModal } from "@/components/form-modal"
import { ConfirmModal } from "@/components/confirm-modal"
import { InfoModal } from "@/components/info-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createUser, updateUser, deleteUser } from "../actions/user-actions"
import { USER_TYPE_OPTIONS } from "../types/user-types"
import { toast } from "@/lib/toast"

// Options pour les modales (sans CUSTOMER)
const MODAL_USER_TYPE_OPTIONS = USER_TYPE_OPTIONS.filter(type => type.value !== 'CUSTOMER')

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  active: boolean
  typeUser: string[]
  telephone: string
}

interface UserCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onRefresh?: () => void
}

interface UserEditModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onRefresh?: () => void
}

interface UserDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onRefresh?: () => void
}

// Modal de création d'utilisateur
export function UserCreateModal({ isOpen, onClose, onRefresh }: UserCreateModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    typeUser: ["MANAGER"],
    telephone: ""
  })

  const handleSubmit = async (data: any) => {
    try {
      const userData = {
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        active: true,
        typeUser: Array.isArray(data.typeUser) ? data.typeUser : [data.typeUser].filter(Boolean),
        telephone: data.telephone
      }

      const result = await createUser(userData)

      if (result.success) {
        toast.success(result.message)
        if (result.shouldRefresh && onRefresh) {
          onRefresh()
        }
        setFormData({
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          typeUser: ["MANAGER"],
          telephone: ""
        })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur")
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un utilisateur"
      description="Ajoutez un nouvel utilisateur au système"
      mode="create"
      onSubmit={handleSubmit}
      size="lg"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            placeholder="John"
            defaultValue={formData.firstName}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            placeholder="Doe"
            defaultValue={formData.lastName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur *</Label>
        <Input
          id="username"
          name="username"
          required
          placeholder="johndoe"
          defaultValue={formData.username}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          defaultValue={formData.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          name="telephone"
          placeholder="+221771234567"
          defaultValue={formData.telephone}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="typeUser">Type d'utilisateur</Label>
        <Select name="typeUser" defaultValue={formData.typeUser[0] || "USER"} >
          <SelectTrigger className="bg-muted cursor-not-allowed">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODAL_USER_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </FormModal>
  )
}

// Modal d'édition d'utilisateur
export function UserEditModal({ isOpen, onClose, user, onRefresh }: UserEditModalProps) {
  const handleSubmit = async (data: any) => {
    try {
      const userData = {
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        active: true,
        typeUser: Array.isArray(data.typeUser) ? data.typeUser : [data.typeUser].filter(Boolean),
        telephone: data.telephone
      }

      const result = await updateUser(user.id, userData)

      if (result.success) {
        toast.success(result.message)
        if (result.shouldRefresh && onRefresh) {
          onRefresh()
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur")
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier l'utilisateur"
      description={`Modification de ${user.firstName} ${user.lastName}`}
      mode="update"
      onSubmit={handleSubmit}
      size="lg"
      initialData={user}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            placeholder="John"
            defaultValue={user.firstName}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            placeholder="Doe"
            defaultValue={user.lastName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur *</Label>
        <Input
          id="username"
          name="username"
          required
          placeholder="johndoe"
          defaultValue={user.username}
          disabled
          className="bg-muted cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          defaultValue={user.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          name="telephone"
          placeholder="+221771234567"
          defaultValue={user.telephone}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="typeUser">Type d'utilisateur</Label>
        <Select name="typeUser" defaultValue={Array.isArray(user.typeUser) ? user.typeUser[0] : user.typeUser} disabled>
          <SelectTrigger className="bg-muted cursor-not-allowed">
            <SelectValue />
          </SelectTrigger>
         <SelectContent>
            {USER_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </FormModal>
  )
}

// Modal de suppression d'utilisateur
export function UserDeleteModal({ isOpen, onClose, user, onRefresh }: UserDeleteModalProps) {
  const handleDelete = async () => {
    try {
      const result = await deleteUser(user.id)

      if (result.success) {
        toast.success(result.message)
        if (result.shouldRefresh && onRefresh) {
          onRefresh()
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur")
    }
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="Supprimer l'utilisateur"
      message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`}
      details={`Cette action est irréversible. L'utilisateur "${user.username}" sera définitivement supprimé du système.`}
      type="danger"
      onConfirm={handleDelete}
      confirmText="Supprimer"
    />
  )
}