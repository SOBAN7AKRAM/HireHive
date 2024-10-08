import { createContext, useState, useEffect, useContext} from "react";

// Create a Context for authentication
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null)
     
    useEffect(() => {
        fetch('http://localhost:8000/is_authenticated')
        .then(response => response.json())
        .then(data => setIsAuthenticated(data.isAuthenticated))
        .catch(err => console.log(err))
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated, user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
} 

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
}