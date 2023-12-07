import { Link } from "react-router-dom";
import profile from "../assets/profile-1.jpg";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

const User = ({ user }) => {
  const { auth } = useAuth();
  const decoded = jwtDecode(auth.accesstoken);
  const axiosPrivate = useAxiosPrivate();
  const [followers, setFollowers] = useState(user?.followers);
  const [following, setFollowing] = useState(user?.following);

  const follow = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(
        `/api/users/${user?._id}/follow`,
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const unfollow = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(
        `/api/users/${user?._id}/unfollow`,
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const createChat = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post(
        `/api/chats/`,
        { friendid: user?._id },
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const remove = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/api/chats/${user?._id}`, {
        signal: controller.signal,
      });

      const result = await axiosPrivate.delete(
        `/api/messages/${response?.data?.chat}`,
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-[350px] ">
      <div className="w-full h-[50%] relative bg-black/0">
        <img
          src={`http://localhost:4000/${user ? user?.picture : "no-user.jpg"}`}
          className="absolute w-full h-full object-cover mix-blend-overlay"
        />
      </div>
      <div className="h-[50%] w-full bg-[#B3F0CA] p-4 pt-4 flex flex-col items-center">
        <Link
          className="mb-4 font-semibold tracking-wide text-xl hover:text-[#075e54]"
          to={`${user?._id}`}
        >
          {`${user?.firstname} ${user?.lastname}`}
        </Link>
        {followers.includes(decoded.id) ? (
          <button
            className="py-2 bg-[#1ab7ea] w-full block text-center text-xl font-bold mb-4 tracking-widest"
            onClick={() => {
              if (following.includes(decoded.id)) {
                remove();
              }
              unfollow();
              setFollowers(followers.filter((e) => e !== decoded.id));
            }}
          >
            unfollow
          </button>
        ) : following.includes(decoded.id) ? (
          <button
            className="py-2 bg-[#0078d7] text-white w-full block text-center text-xl font-bold mb-4 tracking-widest"
            onClick={() => {
              follow();
              createChat();
              setFollowers([...followers, decoded.id]);
            }}
          >
            follow back
          </button>
        ) : (
          <button
            className="py-2  bg-[#0078d7] text-white w-full block text-center text-xl font-bold mb-4 tracking-widest"
            onClick={() => {
              follow();
              setFollowers([...followers, decoded.id]);
            }}
          >
            follow
          </button>
        )}

        <div className="flex justify-between w-full font-semibold ">
          <p>{`${followers.length} followers`}</p>
          <p>{`${following.length} following`}</p>
        </div>
      </div>
    </div>
  );
};

export default User;
