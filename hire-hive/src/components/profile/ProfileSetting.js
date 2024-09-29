import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect } from "react";

const ProfileSetting = () => {
    const id = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    // useEffect(() => {
    //     if (user) {
    //         if (user.id !== id) {
    //             navigate(`/freelancer/profile/${id}`);
    //         }
    //     }
    //     else{
    //         navigate(`/freelancer/profile/${id}`);
    //     }
    // }, [user, id])
    return (
        <div className="profileSettingContainer">
            
        </div>
    )
}
export default ProfileSetting;