import { PageHeader } from '@/components/page-header';
import { UsersDataTable } from '@/features/user';
import { serverGet } from '@/lib/server-api';

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
  content: User[];
  totalElements: number;
  number: number;
  size: number;
}

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const searchParam = await searchParams;
  try {
    // Extraire les paramètres de l'URL
    const sort = (searchParam.sort as string) || "dateCreation"
    const order = (searchParam.order as string) || "desc"
    const page = parseInt((searchParam.page as string) || "1")
    const limit = parseInt((searchParam.limit as string) || "10")
    const search = (searchParam.search as string) || ""
    const status = (searchParam.status as string) || ""

    // Construire l'URL avec les paramètres de l'URL
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (status) params.append("status", status)
    params.append("page", (page - 1).toString()) // Spring commence à 0
    params.append("size", limit.toString())
    params.append("sortBy", sort)
    params.append("sortDir", order)

    // Charger les données initiales avec les bons paramètres
    const initialData = await serverGet<UsersResponse>(`/api/users/paginated?${params.toString()}`);

    return (
      <>
        <PageHeader
          title="Gestion des utilisateurs"
          moduleCode="USER_MANAGEMENT"
        />

        <div className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Gérez les utilisateurs de votre système
            </p>
          </div>

          <UsersDataTable initialData={initialData} />
        </div>
      </>
    );
  } catch (error) {
    // En cas d'erreur, données vides pour éviter le crash
    const emptyData: UsersResponse = {
      content: [],
      totalElements: 0,
      number: 0,
      size: 10
    };

    return (
      <>
        <PageHeader
          title="Gestion des utilisateurs"
          moduleCode="USER_MANAGEMENT"
        />

        <div className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Gérez les utilisateurs de votre système
            </p>
          </div>

          <UsersDataTable initialData={emptyData} />
        </div>
      </>
    );
  }
}