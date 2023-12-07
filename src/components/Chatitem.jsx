import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";
import { format } from "timeago.js";
import { useDispatch } from "react-redux";
import { setFriend } from "../Friendslice.jsx";

const Chatitem = ({ chat }) => {
  const { auth } = useAuth();
  const [motho, setMotho] = useState();
  const axiosPrivate = useAxiosPrivate();
  const decoded = jwtDecode(auth.accesstoken);
  const popDispatch = useDispatch();

  useEffect(() => {
    const friend = chat.chatters.find((e) => {
      return e !== decoded.id;
    });
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/api/users/${friend}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          setMotho(response.data.user);
          popDispatch(setFriend(response.data.user.picture));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
    return () => {
      isMounted = false;
      controller.abort;
    };
  }, []);

  return (
    <div
      className={
        "rounded-md py-4 md:py-4 px-2 flex items-center justify-between gap-2 group w-full "
      }
    >
      <div className="">
        <img
          className="w-11 h-11 object-cover rounded-[100%] max-[300px]:w-9 max-[300px]:h-9"
          src={`https://capp-api-9sa2.onrender.com/${motho?.picture}`}
        />
      </div>
      <div className="flex flex-col w-[85%] gap-1">
        <div className="flex items-center justify-between">
          {" "}
          <p className="text-md font-semibold group-hover:text-white">
            {motho && `${motho?.firstname} ${motho?.lastname}`}
          </p>
          <p className="text-[12px] group-hover:text-[#dcf8c6]">
            {format(chat?.updatedAt)}
          </p>
        </div>
        <p className="text-[12px] group-hover:text-[#dcf8c6]">
          {chat?.recentmessage?.length > 32
            ? `${chat?.recentmessage?.slice(1, 32)}.....`
            : chat?.recentmessage}
        </p>
      </div>
    </div>
  );
};

export default Chatitem;
