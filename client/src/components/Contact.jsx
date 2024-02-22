import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
const Contact = ({ listing }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const handleSendMsg = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/message/addmsg`, {
        from: currentUser._id,
        to: listing.userRef._id,
        message: message,
      });
      const data = res.data;
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setMessage("");
    } catch (error) {
      toast.success(error.message);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <p>
        Contact{" "}
        <span className="font-semibold">{listing.userRef.username}</span> for{" "}
        <span className="font-semibold">{listing.name}</span>
      </p>
      <form onSubmit={handleSendMsg}>
        <textarea
          name="message"
          id="message"
          row="2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full p-3 rounded-lg border"
        ></textarea>
        <button className="bg-blue-500 text-white rounded-lg p-3" type="submit">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
