import { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import TimeByCountry from "./TimeByCountry";
import { Link } from "react-router-dom";
import AvailableBalance from "./AvailableBalance";

const GeneralDetail = ({ id, profileUser, setProfileUser, isSelf}) => {

    return (
        <div className="generalDetailContainer d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3">
                <div className="editProfilePicDiv">
                    <ProfilePicture
                        profileUser={profileUser}
                        setProfileUser={setProfileUser}
                        isSelf={isSelf}
                    />
                </div>
                <div>
                    <h2>{profileUser?.user?.first_name +' '+ profileUser?.user?.last_name}</h2>
                    <TimeByCountry country={profileUser?.profile?.location} />
                </div>
            </div>
            <div>
                <div>
                    <div className="d-flex justify-content-center">
                        {true && <Link className="btn btn-lg btn-primary" to={`/profile/${id}/setting`}>Profile Setting</Link>}
                    </div>
                    <div className="mt-2">
                        <AvailableBalance currentBalance={profileUser?.profile?.available_balance}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GeneralDetail;