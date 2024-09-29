import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import GeneralDetail from "./GeneralDetail";
import Edit from "./Edit";
import EditCompanyModal from './EditCompanyModal.js'

const ClientProfile = () => {
    const { id } = useParams();
    const { user, setUser } = useAuth();
    const [profileUser, setProfileUser] = useState()
    const [isSelf, setIsSelf] = useState(false);
    const [showCompanyModal, setShowCompanyModal] = useState(false);








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
            <div className="introContainer d-flex justify-content-between">
                <div>
                    <h5>Company Name</h5>
                    <p className="para">Hello, world</p>
                </div>
                <Edit onClick={() => { setShowCompanyModal(true) }} />
                    {showCompanyModal && 
                        <EditCompanyModal
                            show={showCompanyModal}
                            handleClose={() => setShowCompanyModal(false)}
                            userId={id}
                            company={profileUser?.company}
                        />
                    }
            </div>
            <div className="introContainer">
                <h5>Total Spent: <span className="titleHeading">$7000</span></h5>
                <h5>Total Jobs Posted: <span className="titleHeading">10</span></h5>

            </div>
        </div>
    )
}
export default ClientProfile;