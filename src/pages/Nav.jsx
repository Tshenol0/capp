import { Outlet, Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../Profileslice";
import { setImage } from "../Imageslice";
import { useOutsideClick } from "@chakra-ui/react";
import {
  useNavigate,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";

import { setSearch } from "../Searchslice";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";

const Nav = () => {
  const [searchBtn, setSearchBtn] = useState(true);
  const [searchWidth, setSearchWidth] = useState(window.innerWidth >= 639);
  const userNav = useNavigate();
  const pstate = useSelector((state) => state.profile.profile);
  const searchVal = useSelector((state) => state.search.search);
  const imgVal = useSelector((state) => state.image.image);
  const [write, setWrite] = useState("");
  const popDispatch = useDispatch();
  const profRef = useRef(null);
  const [searchParams] = useSearchParams();
  const { auth } = useAuth();
  const decoded = jwtDecode(auth.accesstoken);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const searchFunc = (e) => {
    e.preventDefault();
    if (!searchBtn && !searchWidth) {
      setSearchBtn(true);
      if (write) {
        popDispatch(setSearch(!searchVal));
        userNav({
          pathname: "users",
          search: `?${createSearchParams({
            search: `${write}`,
          })}`,
        });
      }
    } else if (!searchWidth && searchBtn) {
      setSearchBtn(false);
    } else {
      if (write) {
        popDispatch(setSearch(!searchVal));
        userNav({
          pathname: "users",
          search: `?${createSearchParams({
            search: `${write}`,
          })}`,
        });
      }
    }
  };
  const func = () => {
    if (window.innerWidth >= 639) {
      setSearchWidth(true);
      setSearchBtn(true);
    } else {
      setSearchWidth(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", func);
    return () => {
      window.removeEventListener("resize", func);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    setWrite(searchParams.get("search"));
    let isMounted = true;
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/api/users/${decoded.id}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          popDispatch(setImage(response.data.user.picture));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useOutsideClick({
    ref: profRef,
    handler: () => popDispatch(setProfile(false)),
  });

  return (
    <>
      <header className=" w-full h-[60px] bg-[#25d366] flex justify-between items-center sm:px-6 px-1 fixed z-20">
        <h1
          className={
            searchWidth || (!searchWidth && searchBtn)
              ? "w-[20%] flex font-bold tracking-wide text-[#E9FBF0]"
              : "hidden"
          }
        >
          Capp
        </h1>
        <div className="grow-1 sm:grow-0 w-[380px] md:w-[440px] items-stretch ">
          <form className="flex justify-center">
            <input
              className={
                searchWidth || (!searchWidth && searchBtn)
                  ? "py-2 px-2 w-full mr-[-47px] hidden sm:block transition-all border-none "
                  : "py-2 px-2 w-full mr-[-47px] sm:block transition-all border-none "
              }
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setWrite(e.target.value.trim());
              }}
              defaultValue={write}
            />
            {
              <button
                className="bg-transperant flex justify-between items-center sm:px-2 px-3 "
                onClick={searchFunc}
              >
                <MagnifyingGlassIcon className="h-6 w-6 text-[#04150A] hover:text-[#1C9E4D]" />
              </button>
            }
          </form>
        </div>
        <div className="flex items-center sm:grow-1  justify-end ml-2 self-stretch ">
          <Link
            className="mr-1 self-stretch  flex items-center sm:px-6 px-3 hover:text-white"
            to="/loggedin"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
          </Link>

          <div
            className=" cursor-pointer w-15 self-stretch flex relative sm:px-4 px-2"
            ref={profRef}
          >
            <div
              onClick={() => {
                popDispatch(setProfile(!pstate));
              }}
              className="self-stretch flex items-center w-9"
            >
              <img
                src={`https://capp-api-9sa2.onrender.com/${imgVal}`}
                className="w-9 h-9 rounded-[100%] object-cover"
              />
            </div>
            <div
              className={
                pstate
                  ? "px-10 justify-start pt-6 flex flex-col items-start z-8 opacity-100 visible absolute top-[72px] right-[10px] bg-[#128c7e] w-[200px] h-[200px] rounded-md before:content-[''] before:w-[20px] before:absolute before:top-[-6px] before:bg-[#128c7e] before:right-[10px] before:h-[20px] before:rotate-45 cursor-auto translate-x-0 transition-all duration-200 ease-out"
                  : "px-10 justify-start pt-6 flex flex-col items-start opacity-0 invisible absolute w-[200px] h-[200px] rounded-md before:content-[''] before:w-[20px] before:absolute before:top-[-6px] before:bg-[#128c7e] before:right-[10px] before:h-[20px] before:rotate-45 cursor-auto translate-x-12"
              }
            >
              <div className="py-2 ">
                <Link
                  to={`users/profile`}
                  className="flex items-center justify-start hover:text-white"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  <span className=" text-xl font-medium">Profile</span>
                </Link>
              </div>
              <div className="py-2 font-medium mb-2">
                <Link
                  to={"users/settings"}
                  className="flex items-center hover:text-white"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  <span className="text-xl">Settings</span>
                </Link>
              </div>

              <button
                className="flex items-center hover:text-white"
                onClick={() => {
                  signOut();
                }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                <span className="text-xl font-semibold">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Nav;
