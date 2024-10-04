const InboxUsers = ({ user }) => {
    return (
        <div>

        <div className="d-flex align-items-center gap-3 inboxUserContainer m-2 p-2">
            <div className="align-self-center">
                <img src={user?.picture} className="userLogoDiv" />
            </div>
            <div className="flex-grow-1">
                <div className="d-flex flex-row justify-content-between">
                    <div className="smHeading truncate1">{user?.name}</div>
                    <div className="para">8/12/1229</div>
                </div>
                <div className="mdPara truncate">{user?.title}</div>
            </div>
        </div>
        </div>
    )
}
export default InboxUsers;