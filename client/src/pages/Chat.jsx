import React, { useEffect, useRef, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import ChatContact from "../components/ChatContact";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Welcome from "../components/Welcome";
export const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    navigate("/sign-in");
  }
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`/api/message/allusers/${currentUser._id}`);
        setContacts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContact();
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      const serverURL = "http://localhost:3000";
      socket.current = io(serverURL);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
      <div className="h-[85vh] w-[85vw] grid grid-cols-[25%,75%] bg-slate-200 rounded-lg">
        <ChatContact contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </div>
  );
};
