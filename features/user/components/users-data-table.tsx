"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef, type RowAction } from "@/components/data-table"
import { DataSearch } from "@/components/data-search"
import { DataFilter } from "@/components/data-filter"
import { DataPagination } from "@/components/data-pagination"
import { EmptyState } from "@/components/empty-state"
import { useApiGet } from "@/hooks/use-api"
import defaultApiProxy from "@/lib/api-proxy"
import { toast } from "@/lib/toast"
import { UserCreateModal, UserEditModal, UserDeleteModal } from "./user-modals"
import { getUserTypeBadgeVariant } from "../types/user-types"
import { Plus } from "lucide-react"

interface User {
  id: string;
  username: string;
  email: string;
  telephone:string;
  firstName:string;
	lastName: string;
  createdAt: string;
  typeUser: string[];
  dateCreation: string;
}
interface UsersResponse {
  content: User[]
  totalElements: number
  number: number
  size: number
}

interface UsersDataTableProps {
  initialData: UsersResponse
}

export function UsersDataTable({ initialData }: UsersDataTableProps) {
  const searchParams = useSearchParams()

  // États des modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Paramètres URL
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const sort = searchParams.get("sort") || "dateCreation"
  const order = searchParams.get("order") || "desc"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  // Construire l'URL API pour tous les paramètres (même les paramètres par défaut)
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (status) params.append("status", status)
    params.append("page", (page - 1).toString())
    params.append("size", limit.toString())
    params.append("sortBy", sort)
    params.append("sortDir", order)
    return `/api/users/paginated?${params.toString()}`
  }, [search, status, sort, order, page, limit])

  // Hook API - toujours actif pour détecter les changements
  const { data: filteredData, loading, error, execute } = useApiGet<UsersResponse>(
    apiUrl,
    defaultApiProxy
  )

  // Relancer quand l'URL change
  useEffect(() => {
    execute()
  }, [apiUrl, execute])

  // Utilise les données filtrées si disponibles, sinon les données initiales
  const data = filteredData || initialData

  // Colonnes
  const columns: ColumnDef<User>[] = [
    {
      key: "firstName",
      label: "Prénom",
      render: (value, user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {user.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{user.lastName}</div>
          </div>
        </div>
      )
    },
    {
      key: "username",
      label: "Nom d'utilisateur",
      render: (value) => (
        <div className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
          {value}
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <div className="text-muted-foreground">{value}</div>
      )
    },
    {
      key: "telephone",
      label: "Téléphone",
      render: (value) => (
        <div className="font-mono text-sm">
          {value || "-"}
        </div>
      )
    },
    {
      key: "typeUser",
      label: "Type d'utilisateur",
      render: (value) => {
        // Si c'est un tableau, afficher tous les types
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((type, index) => (
                <Badge
                  key={index}
                  variant={getUserTypeBadgeVariant(type)}
                  className="font-medium text-xs"
                >
                  {type}
                </Badge>
              ))}
            </div>
          )
        }
        // Rétrocompatibilité pour les strings
        return (
          <Badge variant={getUserTypeBadgeVariant(value)} className="font-medium">
            {value}
          </Badge>
        )
      }
    },
    {
      key: "dateCreation",
      label: "Date de création",
      render: (value) => {
        if (!value) return <span className="text-muted-foreground">-</span>
        const date = new Date(value)
        return (
          <div className="text-sm">
            <div className="font-medium">
              {new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(date)}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(date)}
            </div>
          </div>
        )
      }
    }
  ]

  // Actions
  const actions: RowAction<User>[] = [
    {
      label: "Modifier",
      onClick: (user) => {
        setSelectedUser(user)
        setIsEditModalOpen(true)
      }
    },
    {
      label: "Supprimer",
      onClick: (user) => {
        setSelectedUser(user)
        setIsDeleteModalOpen(true)
      },
      variant: "destructive"
    }
  ]

  if (error) {
    return <EmptyState variant="error" errorMessage={error} />
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="rounded-xl bg-slate-50 dark:bg-muted border border-slate-200 dark:border-border p-6 dark:shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Liste des utilisateurs</h2>
            <p className="text-sm text-muted-foreground">
              {data?.totalElements || 0} utilisateur{(data?.totalElements || 0) > 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer utilisateur
            </Button>
            <div className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-sm font-medium">
              Page {data?.number ? data.number + 1 : 1} sur {Math.ceil((data?.totalElements || 0) / (data?.size || 10))}
            </div>
          </div>
        </div>

        {/* Search et Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <DataSearch placeholder="Rechercher des utilisateurs..." />
          </div>
          <DataFilter
            sortOptions={[
              { label: "Date création", value: "dateCreation", field: "dateCreation" },
              { label: "Prénom", value: "firstName", field: "firstName" },
              { label: "Nom", value: "lastName", field: "lastName" },
              { label: "Nom d'utilisateur", value: "username", field: "username" },
              { label: "Email", value: "email", field: "email" },
              { label: "Type", value: "typeUser", field: "typeUser" }
            ]}
          />
        </div>
      </div>

      {/* Table avec style amélioré */}
      <div className=" backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden dark:shadow-lg">
        <DataTable
          data={data?.content || []}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyState={<EmptyState variant="no-users" />}
        />
      </div>

      {/* Pagination avec style */}
      {data && (
        <div className="flex justify-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 dark:shadow-sm">
            <DataPagination
              totalItems={data.totalElements}
              defaultPageSize={10}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRefresh={execute}
      />

      {selectedUser && (
        <>
          <UserEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedUser(null)
            }}
            user={selectedUser}
            onRefresh={execute}
          />

          <UserDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setSelectedUser(null)
            }}
            user={selectedUser}
            onRefresh={execute}
          />
        </>
      )}
    </div>
  )
}