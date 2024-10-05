import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import me from '../../assets/me.png'
import InboxUsers from "./InboxUsers";
import Chat from "./Chat";

const Inbox = () => {
    const { id } = useParams();
    const [inboxUsers, setInboxUsers] = useState([]);

    useEffect(() => {
        const user = 
            {
                'id': 1,
                'picture': me,
                'name': 'M Soban',
                'title': 'Full stack developer'
            }
        const user1 =
            {
                'id': 2,
                'picture': me,
                'name': 'Hello to the world of the programming',
                'title': 'Full stack developer || mobile application developer I am a very good developer yourcajkj can check after giveing me ea  dkjl'
            }
        setInboxUsers([user, user1, user, user1, user, user1, user1]);
    }, [id])

    return (
        <div className="m-5 mt-4 d-flex gap-2 fixed-screen">
            <div className="w25">
                <h3>Messages</h3>
                <div className="inboxContainer d-flex flex-column">
                    {inboxUsers?.map((user, index) => (
                        <InboxUsers key={user?.id} user={user} />
                    ))}
                </div>
            </div>
            <div className="flex-grow-1">
                    <Chat/>
            </div>
        </div>
    )
}
export default Inbox;