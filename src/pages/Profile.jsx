import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "../Profileslice";
import background from "../assets/background.jpg";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userid } = useParams();
  const [user, setUser] = useState();
  const decoded = jwtDecode(auth.accesstoken);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    dispatch(setProfile(false));
    let isMounted = true;
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/api/users/${userid}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          setUser(response.data.user);
          setFollowers(response.data.user?.followers);
          setFollowing(response.data.user?.following);
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
      await axiosPrivate.post(
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
    <div className="bg-[#66e094]/100 w-full h-screen pt-[62px]  relative">
      <img
        src={background}
        className="absolute w-full h-full object-cover mix-blend-overlay"
        alt="/"
      />
      <div className=" relative w-full py-4 left-[50%] translate-x-[-50%] top-14 flex flex-col h-[100vh]">
        <div className=" relative flex justify-center">
          {" "}
          <img
            src={`http://localhost:4000/${user?.picture}`}
            className="rounded-[100%] w-40 h-40 max-[300px]:w-28 max-[300px]:h-28 object-cover mb-2"
          />
        </div>
        <div className="w-full bg-[#66e094] pt-2 grow">
          {" "}
          <div className=" text-center w-full ">{`${user?.status}`}</div>
          <div className="pt-4">
            <div className="text-center font-semibold text-2xl mb-2 tracking-wider ">{`${user?.firstname} ${user?.lastname}`}</div>
            <div className="text-center mb-4">{`joined on ${
              user &&
              new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                new Date(user?.createdAt)
              )
            }`}</div>
            <div className="flex items-center gap-10 justify-center mb-4 font-semibold">
              <Link>{`${user?.followers.length} followers`}</Link>
              <Link>{`${user?.following.length} following`}</Link>
            </div>
            <div>
              {followers.includes(decoded.id) ? (
                <button
                  className="py-2 bg-[#1ab7ea] hover:bg-[#0078d7] hover:text-white w-full max-w-[300px] text-xl font-bold mb-4 tracking-widest block text-center mx-auto px-16"
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
                  className="py-2 bg-[#0078d7] text-white hover:bg-[#1ab7ea] hover:text-black w-full max-w-[300px] text-xl font-bold mb-4 tracking-widest block text-center mx-auto px-16"
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
                  className="py-2 bg-[#0078d7] text-white hover:bg-[#1ab7ea] hover:text-black w-full max-w-[300px] text-xl font-bold mb-4 tracking-widest block text-center mx-auto px-16"
                  onClick={() => {
                    follow();
                    setFollowers([...followers, decoded.id]);
                  }}
                >
                  follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
