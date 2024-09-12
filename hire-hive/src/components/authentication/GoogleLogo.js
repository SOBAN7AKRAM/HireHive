
import googleLogo from '../../assets/google.png'

let GoogleLogo = () => {
    return (
        <div id="continueWithGoogle" className="btn btn-primary">
            <img className="googleLogo" src={googleLogo} alt="logo" />
            Continue with Google
        </div>

    )
}
export default GoogleLogo;