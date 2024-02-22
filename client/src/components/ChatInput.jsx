import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="px-8 md:px-4 md:gap-4 w-[98%]">
      <form
        className="w-full rounded-2xl flex items-center gap-8 bg-[#ffffff34]"
        onSubmit={(event) => sendChat(event)}
      >
        <input
          className="w-[90%] h-[60%] bg-transparent border-none p-3 focus:outline-none"
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button
          className="px-8 py-4 rounded-2xl flex justify-center items-center bg-[#9a86f3] border-none"
          type="submit"
        >
          <IoMdSend className="text-2xl text-white md:text-xl" />
        </button>
      </form>
    </div>
  );
}
