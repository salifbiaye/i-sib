import { cookies } from 'next/headers'
import { LandingContent } from './landing-content'

export default async function LandingPage() {
  // Vérification côté serveur - plus sécurisé et pas de flash
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.has('keycloak-token')

  return <LandingContent isAuthenticated={isAuthenticated} />
}