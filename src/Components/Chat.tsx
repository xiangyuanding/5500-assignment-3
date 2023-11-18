import React, { useState, useEffect } from "react";
import * as path from 'path';
import "./Chat.css";
import { RENDER_SERVER_URL } from "../ServerDataDefinitions";

interface ChatProps {
  name: string;
  userName: string;
}

function Chat({name, userName}:ChatProps) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pointer, setPointer] = useState(20);

  // Function to send message to backend
  const sendMessage = async () => {
    if (inputMessage) {
      await fetch(RENDER_SERVER_URL+'/'+name, {
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
      const response = await fetch(RENDER_SERVER_URL+'/'+name+"/"+pointer.toString(),{
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

  // Function to convert timestamp to time
  const toTime=(timestamp:string)=> {
    let date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const year = date.getFullYear();
    const day = date.getDay();
    const month = date.getMonth();
    return day+"/"+month+"/"+year + "  " + hours + ":" + minutes + ":" + seconds;
  };

    // Fetch messages periodically
    useEffect(() => {
      const intervalId = setInterval(fetchMessages,500)
      return () => clearInterval(intervalId);
    }, [pointer]);

    return (
      <div className='chat-container'>
        <div className='chat-messages'>
          <button onClick={()=>setPointer(pointer+10)}>Load more</button>
          {messages.map((dialog,index) => (
            <div key = {index} className='chat-item'>
              <div className='chat-time'>{toTime(dialog["timestamp"])}</div>
              <div className='chat-content'>{dialog["sender"]+": "+dialog["text"]}</div>
            </div>
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