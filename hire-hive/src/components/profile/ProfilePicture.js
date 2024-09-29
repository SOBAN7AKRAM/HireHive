import { useRef, useState } from 'react';
import logo from '../../assets/userBlack.png'
import useCsrfToken from '../authentication/useCsrfToken.js'
import { useAuth } from '../AuthContext';
import Edit from './Edit.js';

const ProfilePicture = ({ profileUser, setProfileUser, hasImage, isSelf, setHasImage }) => {
    const fileInputRef = useRef(null);
    const csrfToken = useCsrfToken();
    const { setUser } = useAuth()

    function handleClick(e) {
        e.preventDefault();
        if (!isSelf) {
            return;
        }
        fileInputRef.current.click();
    }
    function handleImageChange(event) {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileUser(prevProfileUser => ({
                    ...prevProfileUser,
                    picture: reader.result
                }))
            }
            setHasImage(true);

            // const formData = new FormData()
            // formData.append('image', formData)
            // fetch('http://localhost:8000/update_profile_pic', {
            //     method: 'POST', 
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': csrfToken
            //     }, 
            //     body: formData

            // })
            // .then(response => response.json())
            // .then(data => {
            //     setHasImage(true);
            //     setUser(profileUser)
            // })
            // .catch(err => console.log(err))
            reader.readAsDataURL(file);
        }
    }


    return (
        <>
            <input
                type='file'
                ref={fileInputRef}
                style={{ 'display': 'none' }}
                accept='image/*'
                onChange={handleImageChange}
            />
            {hasImage ? (
                <img
                    className='profileLogoDiv'
                    style={{ 'border': 'none' }}
                    src={profileUser?.picture}
                />
            ) : (
                <div className='profileLogoDiv'>
                    <img
                        src={logo}
                    />
                </div>
            )}
            {isSelf && <Edit onClick={handleClick}/>}
        </>
    )
}
export default ProfilePicture;