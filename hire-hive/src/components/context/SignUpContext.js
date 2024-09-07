import { useState, createContext } from "react";

export const SignUpContext = createContext()

export const SignUpProvider = ({children}) => {
    const [signUpData, setSignUpData] = useState({})
    return (
        <SignUpContext.Provider value={{signUpData, setSignUpData}}>
            {children}
        </SignUpContext.Provider>
    )
}