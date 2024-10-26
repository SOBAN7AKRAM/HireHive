
import googleLogo from '../../assets/google.png';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import useCsrfToken from './useCsrfToken';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

let GoogleLogo = ({ role }) => {
    const csrftoken = useCsrfToken();
    const {setUser, setIsAuthenticated} = useAuth()
    const navigate = useNavigate()

    const handleSuccess = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userData = {
            first_name: decoded.given_name,
            last_name: decoded.family_name,
            email: decoded.email,
            role: role,
        };

        try {
            // Send user data to backend
            const response = await axios.post('http://localhost:8000/google/signin_signup', userData, {
                headers: {
                    'X-CSRFToken': csrftoken, // Add the CSRF token to the headers
                    'Content-Type': 'application/json' // Optional: Set content type if needed
                }
            });
            console.log('User signed in:', response.data);
            setUser(response.data)
            setIsAuthenticated(true)
            localStorage.setItem('jwt_token', response.data.token);
            navigate("/")
        } catch (error) {
            console.error('Sign-in error:', error);
        }
    };

    const handleFailure = (error) => {
        console.error('Google Sign-In failed:', error);
    };

    return (
            <GoogleLogin
                onSuccess={handleSuccess}
                onFailure={handleFailure}
                render={({ onClick }) => (
                    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <img className="googleLogo" src={googleLogo} alt="logo" />
                        <span style={{ marginLeft: '8px' }}>Continue with Google</span>
                    </div>
                )}
            />
    );
};

export default GoogleLogo;
