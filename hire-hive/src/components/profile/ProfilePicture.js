import { useRef, useState } from 'react';
import logo from '../../assets/userBlack.png'
import useCsrfToken from '../authentication/useCsrfToken.js'
import Edit from './Edit.js';

const ProfilePicture = ({ profileUser, setProfileUser, isSelf}) => {
    const fileInputRef = useRef(null);
    const csrfToken = useCsrfToken();
    const hasImage = profileUser?.profile?.picture ? true : false;
    const token = localStorage.getItem('jwt_token');

    function handleClick(e) {
        e.preventDefault();
        if (!isSelf) {
            return;
        }
        fileInputRef.current.click();
    }
    function handleImageChange(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
    
            reader.onload = (e) => {
                const updatedProfile = {
                    ...profileUser.profile, // Clone the existing profile object
                    picture: e.target.result // Base64-encoded image data
                };
                fetch('http://localhost:8000/update_profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                        'X-CSRFToken': csrfToken // Include CSRF token
                    },
                    body: JSON.stringify(updatedProfile) // Send the updated profile as JSON
                })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        console.log(data);
                        setProfileUser(prevProfileUser => ({
                            ...prevProfileUser,
                            profile: data // Update the profile state with the server response
                        }));
                    } else {
                        console.error("Failed to update profile:", data);
                    }
                })
                .catch(err => console.error("Error uploading image:", err));
            };
    
            reader.readAsDataURL(file); // Read the file as a Base64-encoded string
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
                    src={profileUser?.profile?.picture}
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