import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-xl font-semibold">
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging....</h3>
    </div>
  );
};

export default Welcome;
