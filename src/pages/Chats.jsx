import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../Notificationslice.jsx";
import { setProfile } from "../Profileslice.jsx";
import Chatitem from "../components/Chatitem.jsx";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Message from "../components/Message.jsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.jsx";
import useAuth from "../hooks/useAuth.jsx";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

const Chats = () => {
  const { auth } = useAuth();

  const [chats, setChats] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [width, setWidth] = useState(window.innerWidth < 716);
  const [text, setText] = useState("");
  const scrollRef = useRef();
  const isMounted = useRef(false);
  const socket = useRef();
  const dispatch = useDispatch();
  const decoded = jwtDecode(auth.accesstoken);

  useEffect(() => {
    socket.current = io("wss://capp-api-9sa2.onrender.com");
    socket.current.emit("setup", decoded.id);
  }, []);

  useEffect(() => {
    socket.current.on("recieve", (message) => {
      if (decoded.id !== message.senderId) {
        setMessages([...messages, message]);
      }
    });
  });

  const func = () => {
    if (window.innerWidth >= 716) {
      setWidth(false);
    } else {
      setWidth(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", func);
    return () => {
      window.removeEventListener("resize", func);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentChat]);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(setNotification(false));
    dispatch(setProfile(false));

    const getChats = async () => {
      try {
        const response = await axiosPrivate.get(`/api/chats/${decoded.id}`, {
          signal: controller.signal,
        });
        setChats(response.data.chats);
      } catch (error) {
        console.error(error);
      }
    };
    getChats();

    return () => {
      isMounted.current = true;
      controller.abort;
    };
  }, [currentChat]);

  useEffect(() => {
    const controller = new AbortController();
    if (isMounted.current === true) {
      const getMessages = async () => {
        try {
          if (currentChat) {
            const response = await axiosPrivate.get(
              `/api/messages/${currentChat}`,
              {
                signal: controller.signal,
              }
            );
            setMessages(response.data.messages);
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getMessages();
    }
    return () => {
      isMounted.current = true;
      controller.abort;
    };
  }, [currentChat]);

  const createMessage = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post(
        `/api/messages`,
        {
          content: text,
          senderId: decoded.id,
          chatId: currentChat,
        },
        {
          signal: controller.signal,
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const updateChat = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(
        `/api/chats/${currentChat}`,
        {
          recentmessage: text,
        },
        {
          signal: controller.signal,
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid h-[100vh] bg-[#92e9b3] pt-[74px] gap-1 sm:gap-2 max-[716px]:grid-cols-1 max-[1054px]:grid-cols-[340px,1fr] max-[300px]:grid-cols-1 min-[1055px]:grid-cols-[380px_minmax(100px,1fr)] ">
      <div
        className={
          currentChat
            ? "h-[90vh] pb-8 bg-[#25d366] flex flex-col  max-[716px]:invisible max-[716px]:opacity-0 max-[716px]:translate-x-[-100%] max-[716px]:absolute overflow-y-auto scroll-smooth max-[716px]:z-2"
            : " h-[90vh] pb-8 bg-[#25d366] flex flex-col  overflow-y-auto scroll-smooth max-[716px]:visible max-[716px]:opacity-100 max-[716px]:translate-x-[0]"
        }
      >
        <p className="text-3xl font-medium text-center pt-4 pb-8 tracking-[4px] max-[300px]:text-2xl">
          Conversations
        </p>
        {chats?.map((e, i) => {
          return (
            <div
              key={i}
              className="cursor-pointer hover:bg-[#136a33] group"
              onClick={() => {
                setCurrentChat(e._id);
                socket.current.emit("join", e._id);
              }}
            >
              <Chatitem chat={e} />
            </div>
          );
        })}
      </div>
      {!currentChat ? (
        <div className="flex h-[90vh] justify-center items-center rounded-md bg-transparent max-[716px]:hidden">
          <div className="text-5xl font-semibold text-[#e9fbf0] tracking-widest">
            Select Chat
          </div>
        </div>
      ) : (
        <div
          className={
            currentChat
              ? "flex flex-col h-[90vh] relative rounded-md  max-[716px]:visible max-[716px]:opacity-100 max-[716px]:translate-x-[0]"
              : "flex flex-col h-[90vh] relative rounded-md max-[716px]:hidden max-[716px]:invisible max-[716px]:opacity-0 max-[716px]:translate-x-[-100%] max-[716px]:absolute max-[716px]:z-2"
          }
        >
          <div className="w-full  h-[80vh] relative z-5 flex flex-col pt-20 pb-6 px-5 overflow-y-auto scroll-smooth">
            {" "}
            {currentChat != null && width ? (
              <button
                onClick={() => {
                  setCurrentChat(null);
                }}
                className="fixed bg-[#f0f0ff] left-6 top-6 rounded-[100%] p-1 z-12"
              >
                <ArrowLeftIcon className="w-6 h-6 " />
              </button>
            ) : (
              <></>
            )}
            {messages?.map((e, i) => {
              return (
                <div
                  ref={scrollRef}
                  key={i}
                  className={
                    e.senderId === decoded.id
                      ? "w-full "
                      : "w-full flex justify-end"
                  }
                >
                  <Message user={e} />
                </div>
              );
            })}
          </div>
          <div className=" w-full h-[80px] flex justify-center mb-0 md:items-center items-end border-none">
            <div className="max-w-[650px] w-full h-[60%] md:h-[70%] flex items-center ">
              <textarea
                placeholder="Type something... "
                className="h-full px-4 py-3 md:py-4 outline-none border-none flex-grow overflow-y-auto"
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
              ></textarea>
              <button
                className="h-full flex items-center px-4 bg-[#25d366] "
                onClick={() => {
                  if (currentChat) {
                    createMessage();
                    updateChat();
                    setMessages([
                      ...messages,
                      {
                        content: text,
                        senderId: decoded.id,
                        chatId: currentChat,
                      },
                    ]);
                    socket.current.emit("send", {
                      content: text,
                      senderId: decoded.id,
                      chatId: currentChat,
                    });

                    setText("");
                  }
                }}
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;
