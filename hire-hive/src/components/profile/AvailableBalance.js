import  {useAuth}  from "../AuthContext";
import add from '../../assets/addLarge.png';

const AvailableBalance = ({currentBalance}) => {

    function handleAddClick(){

    }
    return (
        <div className="d-flex gap-2">
            <span className="para">Available Balance: ${currentBalance}</span>
            <img className='iconLg' src={add} onClick={handleAddClick} />
        </div>
    )
}
export default AvailableBalance;