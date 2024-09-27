import { useEffect, useState } from "react";
import { useAsyncError, useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import TimeByCountry from "./TimeByCountry";
import ProfilePicture from './ProfilePicture.js'
import Edit from "./Edit.js";
import Intro from "./Intro.js";
import Portfolio from "./Portfolio.js";


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
            <div className="generalDetailContainer d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                    <div className="editProfilePicDiv">
                        <ProfilePicture
                            profileUser={profileUser}
                            setProfileUser={setProfileUser}
                            isSelf={true}
                            hasImage={hasImage}
                            setHasImage={setHasImage}
                        />
                    </div>
                    <div>
                        <h2>M Soban A</h2>
                        <TimeByCountry country={"Pakistan"} />
                    </div>
                </div>
                <div>
                    {true && <Link className="btn btn-lg btn-primary" to={`/freelancer/profile/${id}/setting`}>Profile Setting</Link>}
                </div>
            </div>
            <Intro profileUser={profileUser} isSelf={true}/>
            <Portfolio userId={id} isSelf={true}/>
        </div>
    )
}
export default FreelancerProfile;