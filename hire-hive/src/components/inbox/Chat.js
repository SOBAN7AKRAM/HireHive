import { useEffect, useRef, useState } from "react";
import attachementIcon from '../../assets/attachement.png'
import sendIcon from '../../assets/send.png'

const Chat = () => {
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    const [files, setFiles] = useState([]);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);

    function handleSend(e) {
        const newMessage = {
            text: message,
            files: Array.from(files),
            timestamp: new Date().toLocaleTimeString()
        }
        setMessages((prevMessage) => [...prevMessage, newMessage]);

        setMessage('');
        setFiles([]);
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages])

    function handleKeyDown(e) {
        if (e.key === 'Enter'){
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="chatContainer d-flex flex-column">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <p><strong>{msg.timestamp}</strong>: {msg.text}</p>
                        {msg.files.map((file, i) => (
                            <p key={i}>📁 {file.name}</p>
                        ))}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="chatInputContainer">
                <div className="textAreaWrapper">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={handleKeyDown}
                        // className="form-control"
                    />
                    <img onClick={() => fileInputRef.current.click()} src={attachementIcon} className="icon attachIcon" />
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => setFiles(e.target.files)}
                        accept="image/*, .pdf, .docx"
                        ref={fileInputRef}
                        multiple
                    />
                    <img onClick={handleSend} src={sendIcon} className="icon sendIcon" />
                </div>
            </div>
        </div>
    )
}
export default Chat;