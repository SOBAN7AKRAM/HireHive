import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const {isAuthenticated, setIsAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();

    function handleClick() {
        const token = localStorage.getItem('jwt_token');
        if (isAuthenticated || token) {
            fetch('http://localhost:8000/logout', {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Token ${token}`,
                }
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.removeItem('jwt-token')
                    setIsAuthenticated(false);
                    setUser(null);
                    console.log(data)
                    navigate('/');
                })
                .catch(err => console.log(err))
        }
    }
    return (
        <>
            <button className="btn simpleBtn logOutBtn" style={{ 'color': 'rgb(72, 72, 222)' }} onClick={handleClick}>Log Out</button>
        </>
    )
}
export default LogOut;