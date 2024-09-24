import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const {isAuthenticated, setIsAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();

    function handleClick() {
        if (isAuthenticated) {
            fetch('http://localhost:8000/log_out')
                .then(response => response.json())
                .then(data => {
                    setIsAuthenticated(false);
                    setUser(null);
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