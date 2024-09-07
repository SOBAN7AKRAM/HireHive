import { Outlet } from "react-router-dom";
import { SignUpProvider } from "../context/SignUpContext";

const SignUpLayout = () => {
    return (
        <SignUpProvider>
            <Outlet/>
        </SignUpProvider>
    )
}

export default SignUpLayout;