import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

const UserContext = createContext(undefined);

const socket = io("http://localhost:3001"); // Socket.IO client instance

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [turnMicOff, setTurnMicOff] = useState(false);
  const [turnHeadOff, setTurnHeadOff] = useState(false);
  const [openCreateChannel, setOpenCreateChannel] = useState(false);
  const [singleChannel, setSingleChannel] = useState(
    null
  );
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openCreateVoiceRoom, setOpenCreateVoiceRoom] =
    useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState("");
  const [channels, setChannels] = useState([]);
  const [activeMenu, setActiveMenu] = useState("friends");
  const [friendId, setFriendId] = useState("");
  const [notificationNumber, setNotificationNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectedToVoice, setConnectedToVoice] = useState(false);
  const [token, setToken] = useState("");
  const [handleDisconnect, setHandleDisconnect] = useState(false);
  const [activeChannel, setActiveChannel] = useState("home");
  const [voiceRoomName, setVoiceRoomName] = useState("");
  const [onlineFriendUserIds, setOnlineFriendUserIds] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [activeRoom, setActiveRoom] = useState("");
  const [whichChannelConnected, setWhichChannelConnected] =
    useState("");
  const [userMessageNotification, setUserMessageNotification] = useState([]);
  const [chattingFriend, setChattingFriend] = useState("");
  const [activeMenuFriend, setActiveMenuFriend] = useState("");
  const [channelUsers,setChannelUsers] = useState([]);
  const [url,setUrl] = useState("http://localhost:5000")

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${url}/api/auth/getcurrent`,
        {
          withCredentials: true,
        }
      );

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    handleUserRefreshPage();
  }, []);

const handleUserRefreshPage = async () => {
  if(localStorage.getItem("whichChannelConnected")!==""){
    const getChannelId = localStorage.getItem("whichChannelConnected");
    const getUserId = localStorage.getItem("userId");
    try {
      await axios.delete(
          `${url}/api/channel/deleteuserfromvoicechannel`,
          {
              data: {
                  userId: getUserId,
                  channelId: getChannelId
              },
          }
      );
  } catch (error) {
    console.log(error);
    
  }finally{
    localStorage.removeItem("whichChannelConnected")
  }
  }
    
};


  useEffect(() => {
    if (user?.userId) {
      socket.emit("userOnline", user?.userId);
      const userIds = user?.friends.map((friend) => friend);
      const senderData = {
        _id: user?.userId,
        username: user?.username,
        profilePic: user?.profilePic,
      };
      socket.emit("getOnlineUser", {
        userIds: userIds,
        senderId: senderData,
      });
      const uniqueUsers = [];
      channels.forEach((item) => {
        item.channelUsers.forEach((data) => {
          if (!uniqueUsers.some((user) => user._id === data._id)) {
            uniqueUsers.push(data);
          }
        });
      });
      setAllUser(uniqueUsers);
    }
  }, [user?.userId, channels]);

  useEffect(() => {
    if (allUser.length > 0) {
      const data = {
        _id: user?.userId,
        username: user?.username,
        profilePic: user?.profilePic,
      };

      socket.emit("sendChannelUsers", {
        allUser,
        senderId: data,
      });
    }
  }, [allUser]);

  const getSingleChannel = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/channel/getchannelsingle`,
        {
          params: {
            channelId: id,
          },
        }
      );

      setSingleChannel(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async () => {
    try {
      await axios.post(
        `${url}/api/auth/addnotification`,
        {
          userId: user?.userId,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async () => {
    try {
      const response = await axios.post(
        `${url}/api/auth/deletenotification`,
        {
          userId: user?.userId,
        }
      );
      setNotificationNumber(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotification = async () => {
    try {
      const response = await axios.get(
        `${url}/api/auth/getnotification`,
        {
          params: {
            userId: user?.userId,
          },
        }
      );
      setNotificationNumber(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getNotification();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "friendRequestNotification",
        (senderId, username, profilePic) => {
          setNotificationNumber(
            (prevNotificationNumber) => prevNotificationNumber + 1
          );
          if (user?.userId) {
            addNotification();
          }
          setUser((prev) => {
            if (!prev) return prev;

            const newFriend = {
              username: username,
              _id: senderId,
              profilePic: profilePic,
            };
            return {
              ...prev,
              pendingFriend: [...prev.pendingFriend, newFriend],
            };
          });
        }
      );
      socket.on(
        "sendReceiverIdToUser",
        (
          senderId,
          selectedValue,
          username,
          profilePic
        ) => {
          if (selectedValue === "accept") {
            setUser((prev) => {
              if (!prev) return prev;

              const newFriend = {
                username: username,
                _id: senderId,
                profilePic,
              };
              return {
                ...prev,
                friends: [...prev.friends, newFriend],
              };
            });
            setOnlineFriends((prev) => {
              const newFriend = {
                username: username,
                _id: senderId,
                profilePic,
              };
              if (!prev.some((friend) => friend._id === senderId)) {
                return [...prev, newFriend];
              }
              return prev;
            });
          } else {
            return;
          }
        }
      );
  
      socket.on("onlineFriends", (onlineFriendsFromSocket) => {
        setOnlineFriends(onlineFriendsFromSocket);
      });
      socket.on("ImOnline", (userId) => {
        setOnlineFriends((prev) => {
          if (!prev.some((friend) => friend._id === userId._id)) {
            return [...prev, userId];
          }
          return prev;
        });
      });

      socket.on("userThatDisconnected", (senderId) => {
        setOnlineFriends((prev) => {
          if (!prev) {
            return prev;
          }
          const newData = prev.filter((data) => data._id !== senderId);
          return newData;
        });
      });
    }
    socket.on("messageNotification", (data) => {
      const { senderId, profilePic } = data;

      if (chattingFriend === senderId) {
        return;
      } else {
        setUserMessageNotification((prev) => {
          const updatedNotifications = prev ? [...prev] : [];
          const pushData = {
            senderId: senderId,
            profilePic: profilePic,
          };
          const isExist = updatedNotifications.some(
            (item) => item.senderId === senderId
          );

          if (!isExist) {
            updatedNotifications.push(pushData);
          }

          return updatedNotifications;
        });
      }
    });

    socket.on("kickedFromChannel", (data) => {
      const {channelId} = data
      setChannels((prev) => {
        if (!prev) {
          return prev;
        }
        const filteredChannel = prev.filter((data) => data._id !== channelId);
        return filteredChannel;
      });
      setActiveChannel("");
        setActiveRoom("");
        setConnectedToVoice(false);
        setActiveRoom("");
    });

    socket.on("addToAllUser", (data) => {
      console.log("is adding to AllUser?");
      
      const {userData} = data;
      setAllUser((prev) => {
        if (!prev) {
          return [prev];
        }
        if (prev.some((user) => user._id === userData.id)) {
          return prev;
        }
        console.log("after allUser",allUser);
        
        return [...prev, userData];
      });
    });

    // Temizleme işlemi
    return () => {
      if (socket) {
        socket.off("friendRequestNotification");
        socket.off("sendReceiverIdToUser");
        socket.off("onlineFriends");
        socket.off("ImOnline");
        socket.off("userThatDisconnected");
        socket.off("messageNotification");
        socket.off("addToAllUser");
      }
    };
  }, [socket, user, onlineFriends, chattingFriend]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setTurnMicOff,
        turnMicOff,
        setTurnHeadOff,
        turnHeadOff,
        openCreateChannel,
        setOpenCreateChannel,
        getSingleChannel,
        setSingleChannel,
        singleChannel,
        openCreateRoom,
        setOpenCreateRoom,
        openCreateVoiceRoom,
        setOpenCreateVoiceRoom,
        selectedChatRoom,
        setSelectedChatRoom,
        channels,
        setChannels,
        activeMenu,
        setActiveMenu,
        socket,
        getCurrentUser,
        friendId,
        setFriendId,
        notificationNumber,
        setNotificationNumber,
        deleteNotification,
        loading,
        setLoading,
        connectedToVoice,
        setConnectedToVoice,
        token,
        setToken,
        handleDisconnect,
        setHandleDisconnect,
        activeChannel,
        setActiveChannel,
        voiceRoomName,
        setVoiceRoomName,
        onlineFriendUserIds,
        setOnlineFriendUserIds,
        onlineFriends,
        setOnlineFriends,
        allUser,
        setAllUser,
        isCameraOn,
        setIsCameraOn,
        activeRoom,
        setActiveRoom,
        setWhichChannelConnected,
        whichChannelConnected,
        userMessageNotification,
        setUserMessageNotification,
        chattingFriend,
        setChattingFriend,
        activeMenuFriend,
        setActiveMenuFriend,
        url,
        setUrl,
        channelUsers,
        setChannelUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
