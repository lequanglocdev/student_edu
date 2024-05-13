// import React from 'react'
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { FaRegUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFileInvoice } from "react-icons/fa6";
import { LuUserCircle2 } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import { IoMdClipboard } from "react-icons/io";
import { logoutSuccess } from "../redux/user/userSlice";
const DashSideBar = () => {
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { createUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    // console.log(tabFromURL)
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full wd:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          
        {createUser && createUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={IoMdClipboard}
                as='div'
              >
                Trang quản trị
              </Sidebar.Item>
            </Link>
          )}

          {createUser && createUser.isAdmin && (
            <Link to="/dashboard?tab=post">
              <Sidebar.Item
                active={tab === "post"}
                icon={FaFileInvoice}
                labelColor="dark"
              >
               Quản lý bài viết
              </Sidebar.Item>
            </Link>
          )}
          {createUser && createUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={FaRegUser}
                labelColor="dark"
              >
                Quản lý thành viên
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={LuUserCircle2}
              label={createUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
                Cá nhân
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            className="cursor-pointer"
            icon={IoLogOutOutline}
            labelColor="dark"
            onClick={handleLogout}
          >
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
