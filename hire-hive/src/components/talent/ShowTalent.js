import { useNavigate } from "react-router-dom";

const ShowTalent = ({ talent }) => {
    const navigate = useNavigate();
    function handleClick() {
        navigate(`/freelancer/profile/${talent?.id}`);
    }
    return (
        <div className="showDivContainer d-flex flex-column gap-2 p-3" onClick={handleClick}>
            <div className="d-flex gap-3">
                <img className="profileLogoDiv" style={{ border: 'none' }} src={talent?.picture} />
                <div>
                    <h6 className='m-0 Hover' onClick={handleClick}>{talent?.name}</h6>
                    <h3 className='m-0 Hover' onClick={handleClick}>{talent?.bioSkill}</h3>
                    <p className='para'>{talent?.country}</p>
                </div>
            </div>
            <div className='d-flex gap-4'>
                <div className='para'>${talent?.hourlyRate}/hr</div>
                <div className='para'>${talent?.earning}+ earned</div>
            </div>
            <div class="container m-0 p-0">
                <div class="col-md-12">
                    <div class="d-flex flex-wrap">
                        {talent?.skills.map((skill, index) => (
                            <span key={index} className="badge bg-secondary m-1">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <p className='para truncate'>{talent?.bio}</p>
            </div>
        </div>
    )
}
export default ShowTalent;