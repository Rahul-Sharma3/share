import { account } from '@/app/_services/config';

class AuthService {
    async createAppwriteSession(userId) {
        try {
            // Check if there's an active session first
            try {
                await account.get();
                // If we get here, there's an active session
                return true;
            } catch {
                // No active session, create one
                await account.createAnonymousSession();
                return true;
            }
        } catch (error) {
            console.error('Appwrite session error:', error);
            return false;
        }
    }
}

export const authService = new AuthService(); 