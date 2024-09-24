import { useEffect, useState } from "react";
import { useAsyncError, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import TimeByCountry from "./TimeByCountry";
import ProfilePicture from './ProfilePicture.js'


const FreelancerProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [isSelf, setIsSelf] = useState(false);
    const [profileUser, setProfileUser] = useState({});
    const [hasImage, setHasImage] = useState(false);


    useEffect(() => {
        if (user && user.id === id) {
            setIsSelf(true);
            setProfileUser(user);
        }
        else {
            setIsSelf(false);
            getUser();
        }
        if (!profileUser) {
            alert("Something Went Wrong");
        }

    }, [user, id])

    function getUser() {
        fetch(`http://localhost:8000/get_user/${id}`)
            .then(response => response.json())
            .then(data => setProfileUser(data))
            .catch(err => console.log(err))
    }




    return (
        <div className="profilePageContainer">
            <div className="generalDetailContainer">
                <div>
                    <ProfilePicture
                        profileUser={profileUser}
                        setProfileUser={setProfileUser}
                        isSelf={isSelf}
                        hasImage={hasImage}
                        setHasImage={setHasImage}
                    />
                    <TimeByCountry country={profileUser.country} />
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}
export default FreelancerProfile;