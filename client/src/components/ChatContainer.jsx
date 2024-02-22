import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatInput from "./ChatInput";
import axios from "axios";
const ChatContainer = ({ currentChat, socket }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.post("/api/message/getmsg", {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });
    await axios.post(`/api/message/addmsg`, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="grid grid-rows-[10%,80%,10%] gap-1 overflow-hidden md:grid-rows-[15%,70%,15%] ">
      <div className="flex justify-between items-center px-8">
        {currentChat && (
          <div className="flex items-center gap-4">
            <img
              className="h-12 rounded-full"
              src={currentChat.avatar}
              alt=""
            />
            <h3>{currentChat.username}</h3>
          </div>
        )}
      </div>
      <div
        className="px-8 flex flex-col gap-4"
        style={{
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.map((message, index) => {
          return (
            <div
              ref={scrollRef}
              className={`flex items-center justify-start ${
                message.fromSelf ? "justify-end" : "justify-start"
              }`}
              key={index}
            >
              <div
                className={`break-words p-3 text-lg rounded-xl text-white w-fit ${
                  message.fromSelf ? "bg-[#9a86f3]" : "bg-slate-900"
                }`}
              >
                <p>{message.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      {currentChat && <ChatInput handleSendMsg={handleSendMsg} />}
    </div>
  );
};

export default ChatContainer;
