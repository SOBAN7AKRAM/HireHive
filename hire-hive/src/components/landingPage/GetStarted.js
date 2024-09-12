import { Link } from "react-router-dom";
import work from '../../assets/work.png'
let GetStarted = () => {
    return (
        <div className="flex-container">
            <div className="flex-items">
                <h1 className="lgHeading">How Work</h1>
                <h1 className="lgHeading">should Work</h1>
                <p className="paraHeading">Forget the old rules. You can have the best people.
                Right now. Right here.</p>
                <Link className="btn btn-lg mt-3 btn-primary" to="/sign_up">Get Started</Link>
            </div>
            <div className="flex-items">
                <div className="workImgContainer">
                    <img className="workImg" src={work}/>
                </div>
            </div>

        </div>
    )
}
export default GetStarted;