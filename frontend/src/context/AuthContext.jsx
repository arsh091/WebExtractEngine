import { createContext, useState, useContext, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                setToken(idToken);

                // Fetch extra user data from our backend (plan, apiKey etc which are in Firestore)
                try {
                    const res = await axios.get(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${idToken}` }
                    });
                    setUser({ ...firebaseUser, ...res.data.user });
                } catch (err) {
                    console.error("Failed to sync user data with backend", err);
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Sync with backend
            await axios.post(`${API_URL}/auth/register-sync`, {
                name: result.user.displayName,
                email: result.user.email
            }, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            return result.user;
        } catch (error) {
            console.error("Google Auth failed", error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });

        // Let backend initialize the user document in Firestore
        const idToken = await userCredential.user.getIdToken();
        await axios.post(`${API_URL}/auth/register-sync`, { name }, {
            headers: { Authorization: `Bearer ${idToken}` }
        });

        return userCredential.user;
    };

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, googleLogin, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
