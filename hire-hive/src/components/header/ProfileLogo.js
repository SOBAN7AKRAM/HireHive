import { useState } from 'react';
import logo from '../../assets/userBlack.png'
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileLogo = () => {
    const { user } = useAuth()
    const [showPicture, setShowPicture] = useState(false)
    const navigate = useNavigate();

    if (user && user.picture && !showPicture) {
        setShowPicture(true)
    }

    function handleClick() {
        if (user){
            if (user.role === 'freelancer'){
                navigate(`/freelancer/profile/${user.id}`)
            }
            else{
                navigate(`/client/profile/${user.id}`)
            }
        }
    }

    return (
        <>
            {showPicture ? (
                <img
                    className='userLogoDiv'
                    style={{ 'border': 'none' }}
                    src={user.picture}
                    onClick={handleClick}
                />
            ) : (
                <div className='userLogoDiv'>
                    <img
                        src={logo}
                        onClick={handleClick}
                    />
                </div>
            )}

        </>
    )
}
export default ProfileLogo;