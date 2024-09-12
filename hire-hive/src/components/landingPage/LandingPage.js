import FindWork from "./FindWork";
import GetStarted from "./GetStarted";
import WorkGame from "./WorkGame";
let LandingPage = () => {
    return (
        <div className="landingPage">
            <GetStarted/>
            <WorkGame/>
            <FindWork/>
        </div>
    )
}
export default LandingPage;

