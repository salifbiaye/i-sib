'use server';

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/server-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface CreateUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  typeUser: string[] | string; // Support both for frontend flexibility
  telephone: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  active?: boolean;
  typeUser?: string[] | string; // Support both for frontend flexibility
  telephone?: string;
}

// === ACTIONS POUR USERS ===

export async function getUsers() {
  return await serverGet('/api/users');
}

export async function getUserById(id: string) {
  return await serverGet(`/api/users/${id}`);
}

export async function createUser(userData: CreateUserData) {
  try {
    // Validation basique
    if (!userData.username || !userData.email || !userData.firstName || !userData.lastName) {
      throw new Error('Tous les champs obligatoires doivent être remplis');
    }

    if (!userData.email.includes('@')) {
      throw new Error('L\'email doit être valide');
    }

    // Convertir typeUser array en string pour le backend
    const backendData = {
      ...userData,
      typeUser: Array.isArray(userData.typeUser) ? userData.typeUser[0] : userData.typeUser
    };

    console.log('📤 Sending to backend:', JSON.stringify(backendData, null, 2));

    await serverPost('/api/users', backendData);

    console.log('🔄 Revalidating path: /users (create)');
    revalidatePath('/users');
    console.log('✅ Path revalidated successfully (create)');

    return { success: true, message: 'Utilisateur créé avec succès', shouldRefresh: true };
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la création'
    };
  }
}

export async function updateUser(userId: string, userData: UpdateUserData) {
  try {
    // Enlever les champs vides
    const cleanedData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v !== undefined && v !== '')
    );

    if (Object.keys(cleanedData).length === 0) {
      throw new Error('Aucune donnée à mettre à jour');
    }

    // Validation email si fourni
    if (cleanedData.email && !cleanedData.email.includes('@')) {
      throw new Error('L\'email doit être valide');
    }

    // Convertir typeUser array en string pour le backend
    if (cleanedData.typeUser && Array.isArray(cleanedData.typeUser)) {
      cleanedData.typeUser = cleanedData.typeUser[0];
    }

    await serverPut(`/api/users/${userId}`, cleanedData);

    console.log('🔄 Revalidating path: /users');
    revalidatePath('/users');
    console.log('✅ Path revalidated successfully');

    return { success: true, message: 'Utilisateur mis à jour avec succès', shouldRefresh: true };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    await serverDelete(`/api/users/${userId}`);

    console.log('🔄 Revalidating path: /users (delete)');
    revalidatePath('/users');
    console.log('✅ Path revalidated successfully (delete)');

    return { success: true, message: 'Utilisateur supprimé avec succès', shouldRefresh: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la suppression'
    };
  }
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  try {
    await serverPut(`/users/${userId}`, { active: !currentStatus });
    revalidatePath('/users');

    return {
      success: true,
      message: `Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`
    };
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors du changement de statut'
    };
  }
}

// === ACTIONS AVEC DONNÉES DIRECTES ===

export async function createUserDirect(userData: CreateUserData) {
  const newUser = await serverPost('/users', userData);
  revalidatePath('/users');
  return newUser;
}

export async function updateUserDirect(id: string, userData: UpdateUserData) {
  const updatedUser = await serverPut(`/users/${id}`, userData);
  revalidatePath('/users');
  revalidatePath(`/users/${id}`);
  return updatedUser;
}