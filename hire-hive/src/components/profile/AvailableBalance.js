import  {useAuth}  from "../AuthContext";
import add from '../../assets/addLarge.png';

const AvailableBalance = () => {
    const {user} = useAuth();

    function handleAddClick(){

    }
    return (
        <div className="d-flex gap-2">
            <span className="para">Available Balance: $700{user?.balance}</span>
            <img className='iconLg' src={add} onClick={handleAddClick} />
        </div>
    )
}
export default AvailableBalance;