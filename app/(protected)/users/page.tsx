import { PageHeader } from '@/components/page-header';
import { UsersDataTable } from '@/features/user';
import { UserStats } from '@/features/user/components/user-stats';
import { serverGet } from '@/lib/server-api';

interface User {
  id: string;
  username: string;
  email: string;
  telephone: string;
  firstName: string;
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

// Données par défaut en cas d'erreur
const emptyData: UsersResponse = {
  content: [],
  totalElements: 0,
  number: 0,
  size: 10
};

export default async function UsersPage() {
  // Charger les données initiales (page 1, taille 10)
  const initialData = await serverGet<UsersResponse>('/api/users/paginated?page=0&size=10&sortBy=dateCreation&sortDir=desc')
    .catch(() => emptyData); // Si erreur, utiliser données vides

  return (
    <>
      <PageHeader
        title="Gestion des utilisateurs"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Utilisateurs", href: "/users" }
          
        ]}
      />

      <div className="p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Gérez les utilisateurs de votre système
          </p>
        </div>

        <UserStats />

        <UsersDataTable initialData={initialData} />
      </div>
    </>
  );
}