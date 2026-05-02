import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const PendingFriend = ({ item }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const { user, socket, setUser, deleteNotification, setOnlineFriends, url } = useUserContext();

  const handleAction = async (action) => {
    try {
      setSelectedValue(action);
      const response = await axios.post(`${url}/api/auth/acceptordeclinefriend`, { userId: user?.userId, request: action, friendUserId: item._id });
      if (response.status === 200) {
        deleteNotification();
        setUser((prev) => {
          if (!prev) return prev;
          const updatedPendingFriends = prev.pendingFriend.filter((friend) => friend._id !== item._id);
          if (action === "accept") { return { ...prev, friends: [...prev.friends, response.data], pendingFriend: updatedPendingFriends }; }
          return { ...prev, pendingFriend: updatedPendingFriends };
        });
        socket.emit("sendAcceptOrDecNotificationToUser", user?.userId, response.data._id, action, user?.username, user?.profilePic);
        setOnlineFriends((prev) => {
          const newFriend = { username: item.username, _id: item._id, profilePic: item.profilePic };
          if (!prev.some((friend) => friend._id === item._id)) { return [...prev, newFriend]; }
          return prev;
        });
      }
    } catch (error) { console.error(error); }
  };

  const show = () => { console.log(item); };

  return (
    <div className="w-full h-16 px-3 border-b border-gray-600 flex justify-between">
      <div className="w-auto h-full flex gap-4 items-center ">
        <img onClick={() => show()} className="w-8 h-8 rounded-full" src={`${url}${item.profilePic}`} alt="" />
        <p className="text-[#9CA3AF] text-base">{item.username}</p>
      </div>
      <div className="w-24 h-full flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${selectedValue === "accept" ? "bg-green-500" : "bg-[#2B2D31]"}`} onClick={() => handleAction("accept")}><TiTick className="text-white text-xl" /></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${selectedValue === "decline" ? "bg-red-500" : "bg-[#2B2D31]"}`} onClick={() => handleAction("decline")}><IoClose className="text-white text-xl" /></div>
      </div>
    </div>
  );
};

export default PendingFriend;
