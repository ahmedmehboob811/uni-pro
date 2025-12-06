
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendPasswordResetEmail, confirmPasswordReset, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase";
import { User } from '../types';

export const authService = {
    signup: async (name: string, email: string, password: string): Promise<User> => {
        const safeEmail = email.toLowerCase().trim();
        if (auth) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, safeEmail, password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: name });
                return {
                    name: name,
                    email: user.email || ''
                };
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    throw new Error('User already exists');
                }
                throw error;
            }
        } else {
            // MOCK MODE: LocalStorage
            const users = JSON.parse(localStorage.getItem('vcare_users') || '[]');
            if (users.find((u: any) => u.email === safeEmail)) {
                throw new Error('User already exists');
            }
            // In a real mock, we wouldn't save plain text password, but this is for demo
            const newUser = { name, email: safeEmail, password }; 
            users.push(newUser);
            localStorage.setItem('vcare_users', JSON.stringify(users));
            
            // Set current session
            const user = { name, email: safeEmail };
            localStorage.setItem('vcare_current_user', JSON.stringify(user));
            return user;
        }
    },

    login: async (email: string, password: string): Promise<User> => {
        const safeEmail = email.toLowerCase().trim();
        if (auth) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, safeEmail, password);
                const user = userCredential.user;
                return {
                    name: user.displayName || 'User',
                    email: user.email || ''
                };
            } catch (error: any) {
                 throw new Error('Invalid credentials');
            }
        } else {
            // MOCK MODE: LocalStorage
            const users = JSON.parse(localStorage.getItem('vcare_users') || '[]');
            
            const validUser = users.find((u: any) => u.email === safeEmail && u.password === password);
            if (!validUser) {
                // Check if email exists to give specific error
                const emailExists = users.some((u: any) => u.email === safeEmail);
                if (!emailExists) {
                    throw new Error('Email not found');
                }
                throw new Error('Invalid credentials');
            }
            const user = { name: validUser.name, email: validUser.email };
            localStorage.setItem('vcare_current_user', JSON.stringify(user));
            return user;
        }
    },

    logout: async () => {
        if (auth) {
            await signOut(auth);
        } else {
            // MOCK MODE
            localStorage.removeItem('vcare_current_user');
        }
    },
    
    resetPassword: async (email: string): Promise<void> => {
        const safeEmail = email.toLowerCase().trim();
        if (auth) {
            try {
                await sendPasswordResetEmail(auth, safeEmail);
            } catch (error) {
                throw new Error('Failed to send reset email');
            }
        } else {
            // MOCK MODE
            // Simulate API call
            return new Promise((resolve, reject) => {
                const users = JSON.parse(localStorage.getItem('vcare_users') || '[]');
                const userExists = users.some((u: any) => u.email === safeEmail);
                
                setTimeout(() => {
                    if (userExists) {
                        resolve();
                    } else {
                        reject(new Error('Email not found'));
                    }
                }, 1000);
            });
        }
    },

    // New function to actually update password in Mock DB
    updatePassword: async (email: string, newPassword: string): Promise<void> => {
        const safeEmail = email.toLowerCase().trim();
        if (auth) {
            throw new Error("Direct password update not supported in Firebase client SDK for this flow. Use the email link.");
        } else {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const users = JSON.parse(localStorage.getItem('vcare_users') || '[]');
                    const userIndex = users.findIndex((u: any) => u.email === safeEmail);
                    
                    if (userIndex !== -1) {
                        users[userIndex].password = newPassword;
                        localStorage.setItem('vcare_users', JSON.stringify(users));
                        resolve();
                    } else {
                        reject(new Error('Email not found'));
                    }
                }, 1000);
            });
        }
    },

    // Helper to map Firebase User to App User
    mapUser: (firebaseUser: FirebaseUser): User => {
        return {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || ''
        };
    }
};
