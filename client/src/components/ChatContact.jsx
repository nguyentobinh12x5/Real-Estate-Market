import React, { useState } from "react";
import { useSelector } from "react-redux";

const ChatContact = ({ contacts, changeChat }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUser && (
        <div className="grid grid-rows-[10%,90%] overflow-hidden border-r-2 border-slate-300">
          <div className="flex items-center gap-4 justify-center">
            <h3 className="uppercase font-semibold">Chat</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "bg-[#9a86f3]" : "bg-[#ffffff]"
                  } min-h-[5rem] cursor-pointer w-[90%] rounded-lg p-3 flex gap-4 items-center transition-all duration-500`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <img
                    className="h-12 rounded-full"
                    src={contact.avatar}
                    alt=""
                  />
                  <h3>{contact.username}</h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatContact;
