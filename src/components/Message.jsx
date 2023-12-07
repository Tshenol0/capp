import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";

const Message = ({ user }) => {
  const { auth } = useAuth();
  const decoded = jwtDecode(auth.accesstoken);
  const friendVal = useSelector((state) => state.friend.friend);
  const imgVal = useSelector((state) => state.image.image);

  return (
    <div
      className={
        user?.senderId === decoded.id
          ? "max-w-[220px] w-full  mb-4 "
          : "max-w-[220px] w-full self-end mb-4 "
      }
    >
      {" "}
      <div className="flex gap-2">
        <Link
          to={
            user?.senderId === decoded.id
              ? `/loggedin/users/${decoded.id}`
              : `/loggedin/users/${user?.senderId}`
          }
        >
          <img
            src={
              user?.senderId === decoded.id
                ? `https://capp-api-9sa2.onrender.com/${imgVal}`
                : `https://capp-api-9sa2.onrender.com/${friendVal}`
            }
            className="w-8 h-8 rounded-[100%] object-cover"
          />
        </Link>

        <p
          className={
            user?.senderId === decoded.id
              ? "w-[80%] p-2 bg-white mb-2 text-md text-[#04150a] break-words"
              : "w-[80%] p-2 bg-[#04150a]  mb-2 text-md text-white break-words"
          }
        >
          {`${user?.content}`}
        </p>
      </div>
      <div className="text-[12px] ">{format(user?.createdAt)}</div>
    </div>
  );
};

export default Message;
