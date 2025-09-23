"use client"

import { RiFilterLine, RiArrowUpLine, RiArrowDownLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface SortOption {
  label: string
  value: string
  field: string
}

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface DataFilterProps {
  /**
   * Options de tri
   */
  sortOptions?: SortOption[]

  /**
   * Options de filtrage par statut/catégorie
   */
  filterOptions?: FilterOption[]

  /**
   * Titre pour les filtres (défaut: "Filtrer par")
   */
  filterLabel?: string

  /**
   * Nom du paramètre URL pour le tri (défaut: "sort")
   */
  sortParam?: string

  /**
   * Nom du paramètre URL pour l'ordre (défaut: "order")
   */
  orderParam?: string

  /**
   * Nom du paramètre URL pour le filtre (défaut: "status")
   */
  filterParam?: string
}

export function DataFilter({
  sortOptions = [],
  filterOptions = [],
  filterLabel = "Filtrer par",
  sortParam = "sort",
  orderParam = "order",
  filterParam = "status"
}: DataFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [currentSort, setCurrentSort] = useState(searchParams.get(sortParam) || "")
  const [currentOrder, setCurrentOrder] = useState(searchParams.get(orderParam) || "asc")
  const [currentFilter, setCurrentFilter] = useState(searchParams.get(filterParam) || "")

  // Synchroniser avec les URL params
  useEffect(() => {
    setCurrentSort(searchParams.get(sortParam) || "")
    setCurrentOrder(searchParams.get(orderParam) || "asc")
    setCurrentFilter(searchParams.get(filterParam) || "")
  }, [searchParams, sortParam, orderParam, filterParam])

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleSort = (field: string) => {
    const newOrder = currentSort === field && currentOrder === "asc" ? "desc" : "asc"
    updateUrl({
      [sortParam]: field,
      [orderParam]: newOrder,
      page: "1" // Reset page
    })
  }

  const handleFilter = (value: string) => {
    updateUrl({
      [filterParam]: value === currentFilter ? null : value,
      page: "1" // Reset page
    })
  }

  const clearFilters = () => {
    updateUrl({
      [sortParam]: null,
      [orderParam]: null,
      [filterParam]: null,
      page: "1"
    })
  }

  const hasActiveFilters = currentSort || currentFilter

  const getSortIcon = (field: string) => {
    if (currentSort !== field) return null
    return currentOrder === "asc" ? (
      <RiArrowUpLine className="ml-1 h-3 w-3" />
    ) : (
      <RiArrowDownLine className="ml-1 h-3 w-3" />
    )
  }

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.field === currentSort)
    return option ? option.label : "Trier par"
  }

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === currentFilter)
    return option ? option.label : filterLabel
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Tri */}
      {sortOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-border/50">
              <RiFilterLine className="mr-2 h-4 w-4" />
              {getCurrentSortLabel()}
              {currentSort && getSortIcon(currentSort)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Trier par</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSort(option.field)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{option.label}</span>
                {getSortIcon(option.field)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Filtres */}
      {filterOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-border/50">
              {getCurrentFilterLabel()}
              {currentFilter && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  1
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>{filterLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFilter(option.value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className={currentFilter === option.value ? "font-medium" : ""}>
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {option.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Effacer
        </Button>
      )}
    </div>
  )
}