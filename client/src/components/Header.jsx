import { Button, TextInput } from "flowbite-react";
import { Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa6";
import { Avatar, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { logoutSuccess } from "../redux/user/userSlice";
const Header = () => {
  const path = useLocation().pathname;
  const { createUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-blue-400 to-violet-400 rounded-lg text-white">
          IUH
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Tìm kiếm..."
          rightIcon={IoMdSearch}
          className="hidden lg:inline"
        />
      </form>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">
            <p className="text-base">Trang chủ</p>
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/project"} as={"div"}>

           {createUser && createUser.isAdmin ? (
              <Link to="/dashboard?tab=dash">
                <p className="text-base">Trang quản trị</p>
              </Link>
            ) : (
              <Link to="/dashboard?tab=dash">
                <p className="text-base">Đăng kí môn học</p>
              </Link>
            )}
        </Navbar.Link>
        <Navbar.Link active={path === "/project"} as={"div"}>
          <Link to="/dashboard?tab=dash">
            <p className="text-base">About</p>
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
      <div className="flex gap-4">
        <Button onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        <div className="flex gap-4">
          {createUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={createUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{createUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {createUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Hồ sơ của bạn</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button gradientDuoTone="purpleToBlue" outline>
                Đăng nhập
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default Header;
