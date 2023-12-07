import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "../Profileslice";
import background from "../assets/background.jpg";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const Myprofile = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState();
  const decoded = jwtDecode(auth.accesstoken);
  const imgVal = useSelector((state) => state.image.image);

  useEffect(() => {
    dispatch(setProfile(false));
    let isMounted = true;
    const controller = new AbortController();
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/api/users/${decoded.id}`, {
          signal: controller.signal,
        });
        isMounted && setUser(response.data.user);
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
            src={`http://localhost:4000/${imgVal}`}
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
            <div className="flex items-center gap-10 justify-center mb-2">
              <Link>{`${user?.followers.length} followers`}</Link>
              <Link>{`${user?.following.length} following`}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
