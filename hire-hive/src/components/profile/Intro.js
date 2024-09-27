import Edit from "./Edit";
const Intro = ({ isSelf, profileUser }) => {
    function handleBioSkillClick(e) {
        e.preventDefault();
    }
    function handleRateClick(e) {
        e.preventDefault();
    }
    function handleBioClick(e) {
        e.preventDefault();
    }
    return (
        <div className="introContainer">
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-row gap-3">
                    <h5>Full Stack Developer</h5>
                    {isSelf && <Edit onClick={handleBioSkillClick} />}
                </div>
                <div className="d-flex flex-row gap-3">
                    <div className="smHeading">$7.00/hr</div>
                    {isSelf && <Edit onClick={handleRateClick} /> }
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
                    {isSelf && <Edit onClick={handleBioClick}/>}
            </div>
        </div>
    )
}
export default Intro;