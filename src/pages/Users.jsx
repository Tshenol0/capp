import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import User from "../components/User";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";

const Users = () => {
  const [searchParams] = useSearchParams();
  const search = useSelector((state) => state.search.search);
  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(
          `/api/users?search=${searchParams.get("search")}`,
          {
            signal: controller.signal,
          }
        );
        isMounted && setUsers(response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [search]);

  return (
    <div className="h-[100vh] pt-[62px]">
      <div className=" max-w-[500px] w-full mx-auto pt-12 mb-6">
        <h3 className="text-xl min-[280px]-text-2xl min-[470px]:text-4xl font-medium tracking-wider text-center">
          Find friends to chat with
        </h3>
      </div>
      <div className="relative w-full h-[75vh] min-[1000px]:h-[70vh] py-4 p-2 sm:px-10 grid gap-2 min-[1020px]:grid-cols-4 min-[1020px]:gap-12 min-[740px]:grid-cols-3 min-[450px]:grid-cols-2 overflow-y-auto scroll-smooth">
        {users.length > 0 ? (
          users.map((e, i) => {
            return <User key={i} user={e} />;
          })
        ) : (
          <div className="font-bold tracking-widest absolute md:text-xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            No users
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
