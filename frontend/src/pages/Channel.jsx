import { useEffect, useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import { useUserContext } from "../context/UserContext";
import { GridLayout, ParticipantTile, useTracks } from "@livekit/components-react";
import { useNavigate, useParams } from "react-router-dom";
import { Track } from "livekit-client";
import "@livekit/components-styles";

const Channel = ({isAreaOpen,setIsAreaOpen}) => {
  const { user, socket, setSingleChannel, singleChannel, allUser, isCameraOn, setIsCameraOn, connectedToVoice, activeRoom, setActiveRoom, setChannels, setActiveChannel, setConnectedToVoice } = useUserContext();
  const { channelId } = useParams();
  const [onlineChannelUsers, setOnlineChannelUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("userJoinedVoiceRoom", (data) => {
      const { username, profilePic, _id, channelId: cId, roomName } = data;
      if(cId === singleChannel?._id){
        setSingleChannel((prev) => {
          if (!prev) return prev;
          const updatedVoiceChannels = prev.voiceChannel.map((channel) => {
            if (channel.voiceRoomName === roomName) {
              return { ...channel, voiceUsers: [...channel.voiceUsers, { username, profilePic, _id }] };
            }
            return channel;
          });
          return { ...prev, voiceChannel: updatedVoiceChannels };
        });
      }
    });
    socket.on("userLeftVoiceRoom", (data) => {
      const { channelId: cId, roomName, _id } = data;
      if(cId === singleChannel?._id){
        setSingleChannel((prev) => {
          if (!prev) return prev;
          const updatedChannel = prev.voiceChannel.map((channel) => {
            if (channel.voiceRoomName === roomName) {
              return { ...channel, voiceUsers: channel.voiceUsers.filter((item) => item._id !== _id) };
            }
            return channel;
          });
          return { ...prev, voiceChannel: updatedChannel };
        });
      }
    });
    socket.on("sendUserChangedRoom", (data) => {
      const { channelId: cId, _id, roomName } = data;
      if(cId === singleChannel?._id){
        setSingleChannel((prev) => {
          if (!prev) return prev;
          const updatedChannel = prev.voiceChannel.map((voiceRoom) => {
            if (voiceRoom.voiceRoomName === roomName) {
              return { ...voiceRoom, voiceUsers: voiceRoom.voiceUsers.filter((item) => item._id !== _id) };
            }
            return voiceRoom;
          });
          return { ...prev, voiceChannel: updatedChannel };
        });
      }
    });
    socket.on("onlineChannelUsers", (senderId) => {
      setOnlineChannelUsers((prev) => {
        if (!prev.some((user) => user._id === senderId._id) && singleChannel?.channelUsers.some((user) => user._id === senderId._id)) {
          return [...prev, senderId];
        }
        return prev;
      });
    });
    socket.on("onlineAllChannelUsers", (onlineChannelUserFromSocket) => {
      const filteredUsers = onlineChannelUserFromSocket.filter((user) => singleChannel?.channelUsers.some((item) => item._id === user._id));
      setOnlineChannelUsers(filteredUsers);
    });
    socket.on("userThatDisconnected", (senderId) => {
      setOnlineChannelUsers((prev) => {
        if (!prev) return prev;
        return prev.filter((user) => user._id !== senderId);
      });
    });
    socket.on("kickedFromChannel", (data) => {
      const {channelId: cId} = data;
      if(cId === singleChannel?._id){
        setChannels((prev) => { if (!prev) return prev; return prev.filter((data) => data._id !== cId); });
        setActiveChannel(""); setActiveRoom(""); setConnectedToVoice(false); setActiveRoom(""); navigate("/home");
      }
    });
    socket.on("userJoinedChannel", (data) => {
      const {channelId: cId, userData} = data;
      if(singleChannel?._id === cId){
        setOnlineChannelUsers((prev) => { if (!prev) return prev; if (prev.some(user => user._id === userData._id)) return prev; return [...prev, userData]; });
        setSingleChannel((prev) => { if(!prev) return prev; return { ...prev, channelUsers: [...prev.channelUsers, userData] }; });
      }
    });
    socket.on("userLeftChannel", (data) => {
      const {userId, channelId: cId} = data;
      if(cId === singleChannel?._id){
        setSingleChannel((prev) => { if(!prev) return prev; return { ...prev, channelUsers: prev.channelUsers.filter((item) => item._id !== userId) }; });
      }
    });
    socket.on("chatChannelInfo", (data) => {
      const {channelId: cId, chatRoom} = data;
      if(singleChannel?._id === cId){
        setSingleChannel((prev) => { if (!prev) return prev; return { ...prev, chatChannel: [...prev.chatChannel, { ...chatRoom, roomName: chatRoom }] }; });
      }
    });
    socket.on("chatVoiceInfo", (data) => {
      const {channelId: cId, voiceRoomName} = data;
      if(singleChannel?._id === cId){
        setSingleChannel((prev) => { if (!prev) return prev; return { ...prev, voiceChannel: [...prev.voiceChannel, voiceRoomName] }; });
      }
    });
    return () => {
      if (socket) {
        socket.off("userJoinedVoiceRoom"); socket.off("userLeftVoiceRoom"); socket.off("sendUserChangedRoom");
        socket.off("onlineChannelUsers"); socket.off("onlineAllChannelUsers"); socket.off("chatVoiceInfo");
        socket.off("chatChannelInfo"); socket.off("kickedFromChannel"); socket.off("userJoinedChannel"); socket.off("userLeftChannel");
      }
    };
  }, [socket, user, singleChannel, onlineChannelUsers, allUser]);

  useEffect(() => {
    socket.emit("sendChannelUsers", { allUser, senderId: user?.userId });
  }, [singleChannel]);

  function MyVideoConference() {
    const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }], { onlySubscribed: false });
    return (<GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}><ParticipantTile /></GridLayout>);
  }

  return (
    <div className="w-full flex  bg-[#313338] justify-center md:justify-between " key={channelId}>
      <ChannelMenu setIsCameraOn={setIsCameraOn} isCameraOn={isCameraOn} setActiveRoom={setActiveRoom} activeRoom={activeRoom} isAreaOpen={isAreaOpen} setIsAreaOpen={setIsAreaOpen} />
      {connectedToVoice && activeRoom === "video" ? (<div className={`w-[70%]`}><MyVideoConference /></div>) : activeRoom === "chat" || activeRoom === "" ? (<ChatArea />) : null}
      <ChatRightArea onlineChannelUsers={onlineChannelUsers} />
    </div>
  );
};

export default Channel;
