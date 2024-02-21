import { createContext, useState, useEffect, useCallback } from 'react';
import { baseUrl, getRequest, postRequest } from './../outils/service';
import { io } from "socket.io-client";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("messages", messages);
  console.log("onlineUsers", onlineUsers);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return ;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) =>{
      setOnlineUsers(res);
    });
  }, [socket]);


  useEffect(() => {
    if (socket === null) return ;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", {...newMessage, recipientId})

  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return ;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return ;

      setMessages((prev) =>[...prev, res]);
    });

    return () => {
      socket.off("getMessage");
    };

  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response =  await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("L'erreur qui est liée à l'utilisateur", response);
      };

      setPotentialChats(response); // Stockez la réponse directement dans potentialChats
    };

    getUsers();
  }, []);
  

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id && !userChats) { // Ajoutez !userChats comme condition
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
  
        setIsUserChatsLoading(false);
  
        if (response.error) {
          return setUserChatsError(response);
        }
  
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user, userChats]); // Ajoutez userChats comme dépendance

  useEffect(() => {
    const getMessages = async () => {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
  
        setIsMessagesLoading(false);
  
        if (response.error) {
          return setMessagesError(response);
        }
  
        setMessages(response);
    };
    getMessages();
  }, [currentChat]);


  const sendTextMessage = useCallback(
    async ( textMessage, sender, currentChatId, setTextMessage ) => {
      if (!textMessage) return console.log("Vous devez taper quelque chose....");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("")

    }, 
    []
  );


  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);
  
  const createChat = useCallback( async(firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })

    );

    if (response.error) {
      return console.log("Erreur liée a la création du chat", Message);
    };

    setUserChats((prev) => [...prev, response]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};