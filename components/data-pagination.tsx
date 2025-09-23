"use client"

import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiMoreLine
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface DataPaginationProps {
  /**
   * Nombre total d'éléments
   */
  totalItems: number

  /**
   * Nombre d'éléments par page par défaut
   */
  defaultPageSize?: number

  /**
   * Options pour le nombre d'éléments par page
   */
  pageSizeOptions?: number[]

  /**
   * Nom du paramètre URL pour la page (défaut: "page")
   */
  pageParam?: string

  /**
   * Nom du paramètre URL pour la taille de page (défaut: "limit")
   */
  limitParam?: string
}

export function DataPagination({
  totalItems,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  pageParam = "page",
  limitParam = "limit"
}: DataPaginationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get(pageParam) || "1"))
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get(limitParam) || defaultPageSize.toString()))

  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Synchroniser avec les URL params
  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get(pageParam) || "1"))
    setPageSize(parseInt(searchParams.get(limitParam) || defaultPageSize.toString()))
  }, [searchParams, pageParam, limitParam, defaultPageSize])

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value)
    })

    router.replace(`${pathname}?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateUrl({ [pageParam]: page.toString() })
    }
  }

  const changePageSize = (newSize: string) => {
    const newPageSize = parseInt(newSize)
    const newTotalPages = Math.ceil(totalItems / newPageSize)
    const newPage = currentPage > newTotalPages ? 1 : currentPage

    updateUrl({
      [limitParam]: newSize,
      [pageParam]: newPage.toString()
    })
  }

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Logique pour afficher pages avec ellipses
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Informations */}
      <div className="text-sm text-muted-foreground">
        Affichage de {startItem} à {endItem} sur {totalItems} résultats
      </div>

      <div className="flex items-center gap-4">
        {/* Sélecteur de taille de page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Afficher</span>
          <Select value={pageSize.toString()} onValueChange={changePageSize}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">par page</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {/* Bouton précédent */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <RiArrowLeftLine className="h-4 w-4" />
          </Button>

          {/* Numéros de pages */}
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0">
                  <RiMoreLine className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page as number)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}

          {/* Bouton suivant */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <RiArrowRightLine className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}