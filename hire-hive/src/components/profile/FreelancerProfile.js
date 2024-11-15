import { useEffect, useState } from "react";
import { useAsyncError, useParams, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Intro from "./Intro.js";
import Portfolio from "./Portfolio.js";
import Skills from "./Skills.js";
import GeneralDetail from "./GeneralDetail.js";
import useCsrfToken from "../authentication/useCsrfToken.js";



const FreelancerProfile = () => {
    const { id } = useParams();
    const { user, setUser } = useAuth();
    const [isSelf, setIsSelf] = useState(false);
    const [profileUser, setProfileUser] = useState({});
    const csrfToken = useCsrfToken();


    useEffect(() => {
        console.log(user)
        checkSelfUser()
        getFreelancer()
    }, [user, id])

    function checkSelfUser(){
        if (Number(id) === user?.freelancer || Number(id) === user?.client){
            setIsSelf(true)
        }
        else{
            setIsSelf(false)
        }
    }
    function getFreelancer () {
        fetch(`http://localhost:8000/get_freelancer_profile_page/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setProfileUser(data)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="profilePageContainer">
            <GeneralDetail
                setUser = {setUser}
                isSelf={isSelf}
                profileUser={profileUser}
                setProfileUser={setProfileUser}
            />
            <Intro profileUser={profileUser} isSelf={true}/>
            <Portfolio userId={id} isSelf={true}/>
            <Skills currentSkills={profileUser?.freelancer?.skills_display} id={id} isSelf={true}/>
        </div>
    )
}
export default FreelancerProfile;