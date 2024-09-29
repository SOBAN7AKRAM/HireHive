import { useEffect, useState } from "react";
import { useAsyncError, useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Intro from "./Intro.js";
import Portfolio from "./Portfolio.js";
import Skills from "./Skills.js";
import GeneralDetail from "./GeneralDetail.js";


const FreelancerProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [isSelf, setIsSelf] = useState(false);
    const [profileUser, setProfileUser] = useState({});

    return (
        <div className="profilePageContainer">
            <GeneralDetail
                id={id}
                user={user}
                setIsSelf={setIsSelf}
                isSelf={isSelf}
                profileUser={profileUser}
                setProfileUser={setProfileUser}
            />
            <Intro profileUser={profileUser} isSelf={true}/>
            <Portfolio userId={id} isSelf={true}/>
            <Skills userId={id} isSelf={true}/>
        </div>
    )
}
export default FreelancerProfile;