import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ClientProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [isSelf, setIsSelf] = useState(false);

    if (user && user.id === id && !isSelf) {
        setIsSelf(true);
    }



    return (
        <div>
            <h1>{id}</h1>
        </div>
    )
}
export default ClientProfile;