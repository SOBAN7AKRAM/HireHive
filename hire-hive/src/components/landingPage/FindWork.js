import { Link } from "react-router-dom";
import telework from "../../assets/telework.jpg"
let FindWork = () => {
    return (
            <div className="flex-container workGameContainer">
                <div className="flex-items blueContainer">
                    <h3>For talent</h3>
                    <h1 className="lgHeading">Find great work</h1>
                    <p className="para mt-3" style={{'color': 'white'}}>Meet clients you’re excited to work with and take
                    your career or business to new heights.</p>
                    <div className="line mt-5"></div>
                    <div className="divContainer">
                        <div>Find opportunities for every stage of your freelance career</div>
                        <div>Control when, where, and how you work</div>
                        <div>Explore different ways to earn</div>
                    </div>
                    <Link className="btn mt-3 btnOutlineWhite" to="/sign_up">Find Opportunities</Link>
                </div>
                <div className="flex-items">
                    <div>
                        <img className="teleworkImg" src={telework} />
                    </div>
                </div>
            </div>
    )
}
export default FindWork;