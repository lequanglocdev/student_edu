import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSideBar from "../components/DashSideBar";
import DashPost from "../components/DashPost";
// import DashPost from "../components/DashPost";
// import DashUsers from "../components/DashUsers";
// import DashBoardComponent   from "../components/DashBoardComponent";
const DashBoard = () => {
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    // console.log(tabFromURL)
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSideBar />
      </div>
      {/* profile */}
      {tab === 'profile' && <DashProfile />}
      {/* post */}
      {tab === 'post' && <DashPost />}
    </div>
  );
};

export default DashBoard;
