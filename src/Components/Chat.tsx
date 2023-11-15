import React, { useState, useEffect } from "react";
import * as path from 'path';

interface ChatProps {
  name: string;
  userName: string;
}

function Chat({name, userName}:ChatProps) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

    // Function to send message to backend
  const sendMessage = async () => {
    if (inputMessage) {
      await fetch('http://localhost:3005/dialog/'+name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "sender": userName, "text": inputMessage })
      });
      setInputMessage('');
    }
  };

  // Function to fetch messages from backend
  const fetchMessages = async () => {
      const response = await fetch('http://localhost:3005/dialog/'+name,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });
      // test
      const responseData = await response.json();
      console.log("test get data",responseData.dialog);
      setMessages(responseData.dialog);
  };

    // Fetch messages periodically
    useEffect(() => {
        const interval = setInterval(fetchMessages, 500); // Fetch messages every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (

      <div className='chat-container'>
        <div className='chat-messages'>
          {messages.map(dialog => (
            <div>{dialog["sender"]+":"+dialog["text"]}</div>
          ))}
        </div>
        <div className='chat-input'>
          <input
              type='text'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Type a message...'
          />
          <button onClick={()=>sendMessage()}>Send</button>
        </div>
      </div>
    );
}

export default Chat;