import { useState } from "react";
import Edit from "./Edit";
import EditBioSkillModal from "./EditBioSkillModal";
import EditHourlyRateModal from "./EditHourlyRateModal";
import EditBioModal from "./EditBioModal";
const Intro = ({ isSelf, profileUser }) => {
    const [showBioSkill, setShowBioSkill] = useState(false);
    const [showEditHourlyRateModel, setShowEditHourlyRateModel] = useState(false);
    const [showEditBioModal, setShowEditBioModal] = useState(false);

    function handleBioSkillClick(e) {
        e.preventDefault();
        setShowBioSkill(true);
    }
    function handleRateClick(e) {
        e.preventDefault();
        setShowEditHourlyRateModel(true);
    }
    function handleBioClick(e) {
        e.preventDefault();
        setShowEditBioModal(true);
    }
    return (
        <div className="introContainer">
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row gap-3">
                    <h5>{profileUser?.freelancer?.bio_skill ? profileUser?.freelancer?.bio_skill : "Title"}</h5>
                    {isSelf && <Edit onClick={handleBioSkillClick} />}
                    {showBioSkill &&
                        <EditBioSkillModal
                            show={showBioSkill}
                            handleClose={() => setShowBioSkill(false)}
                            userId={profileUser.id}
                            userTitle={"Full Stack"}
                        />}
                </div>
                <div className="d-flex flex-row gap-3">
                    <div className="smHeading">${profileUser?.freelancer?.hourly_rate}/hr</div>
                    {isSelf && <Edit onClick={handleRateClick} />}
                    {showEditHourlyRateModel &&
                        <EditHourlyRateModal
                            show={showEditHourlyRateModel}
                            handleClose={() => setShowEditHourlyRateModel(false)}
                            userId={profileUser.id}
                            userHourlyRate={"7"}
                        />
                    }
                </div>
            </div>
            <div className="pt-3">

                <p className="para">{profileUser?.freelancer?.bio ? profileUser?.freelancer?.bio : "Bio..."}</p>
                {isSelf && <Edit onClick={handleBioClick} />}
                {showEditBioModal &&
                    <EditBioModal
                        show={showEditBioModal}
                        handleClose={() => setShowEditBioModal(false)}
                        userId={profileUser.id}
                        userBio="Hello Dear,"
                    />
                }
            </div>
        </div>
    )
}
export default Intro;