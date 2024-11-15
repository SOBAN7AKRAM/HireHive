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
            if (user.freelancer){
                navigate(`/freelancer/profile/${user.freelancer}`)
            }
            else{
                console.log(user)
                navigate(`/client/profile/${user.client}`)
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