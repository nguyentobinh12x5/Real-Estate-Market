import React, { useState } from "react";

const Contact = ({ listing }) => {
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="flex flex-col gap-4">
      <p>
        Contact{" "}
        <span className="font-semibold">{listing.userRef.username}</span> for{" "}
        <span className="font-semibold">{listing.name}</span>
      </p>
      <textarea
        name="message"
        id="message"
        row="2"
        value={message}
        onChange={onChange}
        placeholder="Enter your message here..."
        className="w-full p-3 rounded-lg border"
      ></textarea>
      <button className="bg-blue-500 text-white rounded-lg p-3">
        Send Message
      </button>
    </div>
  );
};

export default Contact;
