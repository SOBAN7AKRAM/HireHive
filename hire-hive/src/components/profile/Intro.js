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
                    <h5>Full Stack Developer</h5>
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
                    <div className="smHeading">$7.00/hr</div>
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

                <p className="para"> Hello Dear,
                    I am a Full-stack developer specializing in building websites and web applications. I am always on the lookout for exciting projects to work on and smart people to collaborate with!

                    I have sound knowledge of the following technologies:

                    ✓ Frontend: JavaScript, React JS
                    ✓ Design: CSS, SASS, Bootstrap
                    ✓ Backend: Python, django, C++, C#
                    ✓ Database: MySQL, PostgreSQL
                    ✓ Github, GitLab and other project management tool

                    Thanks for reading my profile. Looking forward to hearing back from you.

                    Best Regards,
                    M Soban Akram</p>
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