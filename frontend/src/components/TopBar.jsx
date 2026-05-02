import { FaUserFriends } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";

const TopBar = ({ activeTopBarMenu, setActiveTopBarMenu }) => {
  function handleActiveMenu(activeMenu) { setActiveTopBarMenu(activeMenu); }
  const { user } = useUserContext();

  return (
    <div className="w-full h-12 bg-bg2 px-0 md:px-10 border-b border-bd0/70 flex justify-start sm:justify-center md:justify-normal">
      <div className="w-36 h-full text-fg1 font-semibold hidden md:flex items-center gap-2">
        <FaUserFriends className="text-base md:text-3xl" />
        <h3 className="text-lg text-fg0">Friends</h3>
        <div className="w-px h-[40%] bg-bd0/80"></div>
      </div>
      <div className=" w-[70%] md:w-full h-full px-0 md:px-3 flex ">
        <div className="text-fg1 font-semibold flex items-center cursor-pointer gap-1 md:gap-10 text-xs md:text-base">
          <div className="flex items-center">
            <a onClick={() => handleActiveMenu("online")} className={`px-2 py-1 text-center flex items-center gap-2 rounded-md border border-transparent hover:bg-bg3/40 hover:text-fg0 transition ${activeTopBarMenu === "online" ? "ui-chip-active" : ""}`}>Online</a>
          </div>
          <div className="flex items-center">
            <a onClick={() => handleActiveMenu("all")} className={`px-2 py-1 text-center flex items-center gap-2 rounded-md border border-transparent hover:bg-bg3/40 hover:text-fg0 transition ${activeTopBarMenu === "all" ? "ui-chip-active" : ""}`}>All</a>
          </div>
          <div className="flex items-center">
            <a onClick={() => handleActiveMenu("pending")} className={`px-2 py-1 text-center flex items-center gap-2 rounded-md border border-transparent hover:bg-bg3/40 hover:text-fg0 transition ${activeTopBarMenu === "pending" ? "ui-chip-active" : ""}`}>
              Pending
              <div className={`w-4 h-4 items-center justify-center rounded-full text-white bg-danger text-xs ${user?.pendingFriend && user?.pendingFriend?.length > 0 ? "flex" : "hidden"}`}><p>{user?.pendingFriend.length}</p></div>
            </a>
          </div>
          <a onClick={() => handleActiveMenu("blocked")} className={`px-2 py-1 text-center rounded-md border border-transparent hover:bg-bg3/40 hover:text-fg0 transition ${activeTopBarMenu === "blocked" ? "ui-chip-active" : ""}`}>Blocked</a>
          <div className="w-auto h-auto">
            <button onClick={() => handleActiveMenu("addfriend")} className="ui-btn ui-btn-primary w-20 md:w-28 h-8">Add Friend</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
