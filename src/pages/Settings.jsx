import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../Profileslice";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth.jsx";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "../api/axios.jsx";
import profile from "../assets/no-user.jpg";
import { setImage } from "../Imageslice";

const Settings = () => {
  const dispatch = useDispatch();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [status, setStatus] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const decoded = jwtDecode(auth.accesstoken);
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
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
        if (isMounted) {
          setFirst(response.data.user?.firstname);
          setLast(response.data.user?.lastname);
          setStatus(response.data.user?.status);
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

  const firstChange = async (val) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        `/api/users/updatefirstname`,
        { firstname: val },
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const lastChange = async (val) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        `/api/users/updatelastname`,
        { lastname: val },
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const statusChange = async (val) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        `/api/users/updatestatus`,
        { status: val },
        {
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const validateImg = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", img);
      const response = await axios.post(
        `api/users/upload/${decoded.id}`,
        formData
      );
      dispatch(setImage(response.data.file));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-[74px]  w-full h-screen flex items-center">
      <div className="max-w-[500px] w-full bg-white mx-auto p-4  ">
        <h2 className="text-xl font-semibold text-center mb-4">Edit profile</h2>
        <div className="flex py-3 ">
          <label className="w-[20%] ">First Name:</label>
          <input
            className="border border-gray-300 p-2 rounded-md ml-4 grow"
            type="text"
            minLength="4"
            maxLength="10"
            defaultValue={first}
            onChange={(e) => {
              setFirst(e.target.value);
              firstChange(e.target.value);
            }}
          />
        </div>
        <div className="flex py-3">
          <label className="w-[20%]">Last Name:</label>
          <input
            className="border border-gray-300 p-2 rounded-md ml-4 grow"
            type="text"
            minLength="4"
            maxLength="10"
            defaultValue={last}
            onChange={(e) => {
              setLast(e.target.value);
              lastChange(e.target.value);
            }}
          />
        </div>

        <div className="flex py-3">
          <label className="w-[20%]">status:</label>
          <textarea
            className="border border-gray-300 ml-4 grow h-[70px] p-2"
            maxLength="45"
            onChange={(e) => {
              setStatus(e.target.value);
              statusChange(e.target.value);
            }}
            defaultValue={status}
          ></textarea>
        </div>

        <div className="flex flex-col py-3 items-center">
          <div className="mb-4 relative">
            <img
              src={imgPreview || profile}
              className="w-20 h-20 rounded-[100%] object-cover"
            />
            <label htmlFor="image-upload">
              <PlusIcon className="w-4 h-4 bg-slate-400 rounded-[100%] absolute left-14 bottom-0 cursor-pointer" />
            </label>
            <input
              type="file"
              hidden
              id="image-upload"
              accept="image/png,image/jpeg"
              onChange={validateImg}
            />
          </div>
          <button
            className=" bg-[#25d366] py-2 px-4 font-medium text-white"
            onClick={upload}
          >
            update picture:
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
