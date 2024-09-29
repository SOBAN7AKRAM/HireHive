import { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import TimeByCountry from "./TimeByCountry";
import { Link } from "react-router-dom";
import AvailableBalance from "./AvailableBalance";

const GeneralDetail = ({ id, user, profileUser, setProfileUser, isSelf, setIsSelf }) => {
    const [hasImage, setHasImage] = useState(false);
    useEffect(() => {
        if (user && user.id === id && !isSelf) {
            setIsSelf(true);
            setProfileUser(user)
        }
        else {
            setIsSelf(false);
            getUser()
        }
        // if (!profileUser) {
        //     alert("Something Went Wrong");
        // }
    })
    function getUser() {
        // fetch(`http://localhost:8000/get_user/${id}`)
        //     .then(response => response.json())
        //     .then(data => setProfileUser(data))
        //     .catch(err => console.log(err))
    }
    return (
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
                <div>
                    <div className="d-flex justify-content-center">
                        {true && <Link className="btn btn-lg btn-primary" to={`/profile/${id}/setting`}>Profile Setting</Link>}
                    </div>
                    <div className="mt-2">
                        <AvailableBalance />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GeneralDetail;