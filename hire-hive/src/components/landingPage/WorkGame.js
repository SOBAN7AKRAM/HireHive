import { Link } from "react-router-dom";
import freelancer from '../../assets/freelancer.jpg'
import star from '../../assets/star.png'
import pin from '../../assets/pin.png'
import sign from '../../assets/sign.png'

let WorkGame = () => {
    return (
        <div className="flex-container workGameContainer">
            <div className="flex-items">
                <div>
                    <img className="workImg freelanceImg" src={freelancer} />
                </div>
            </div>
            <div className="flex-items">
                <h1>Up Your Work Game, it's easy</h1>
                <div className="flexContainer">
                    <div className="item mt-3">
                        <img className="icon" src={sign} />
                        <div>
                            <h3 className="smHeading">No cost to join</h3>
                            <p className="para">Register and browse talent profiles, explore projects, or even book a consultation.</p>
                        </div>
                    </div>
                    <div className="item">
                        <img className="icon mt-1" src={pin} />
                        <div>
                            <h3 className="smHeading">Post a job and hire top talent</h3>
                            <p className="para">Finding talent doesn’t have to be a chore. Post a job or we can search for you!</p>
                        </div>
                    </div>
                    <div className="item">
                        <img className="icon" src={star} />
                        <div>
                            <h3 className="smHeading">Work with the best—without breaking the bank</h3>
                            <p className="para">HireHive makes it affordable to up your work and take advantage of low transaction rates.</p>
                        </div>
                    </div>
                    <div className="item">
                        <Link className="btn btn-lg btn-primary pt-3" to="/sign_up">Sign up for free</Link>
                        <Link className="btn btnOutlineSuccess" to="/how_to_hire">Learn how to hire</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WorkGame;