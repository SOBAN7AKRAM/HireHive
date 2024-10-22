import { createContext, useState, useEffect, useContext } from "react";
import useCsrfToken from "./authentication/useCsrfToken";

// Create a Context for authentication
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null)
    const csrfToken = useCsrfToken();

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {

            fetch('http://localhost:8000/get_user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        setUser(data)
                        setIsAuthenticated(true)
                    }
                })
                .catch(err => console.log(err))
        }
        else{
            setIsAuthenticated(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
}