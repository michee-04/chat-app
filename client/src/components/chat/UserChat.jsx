import React from 'react'
import { useFetchRecipientUser } from './../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import avatar from "./../../assets/avatar.svg";
import { useContext } from 'react';
import { ChatContext } from './../../context/ChatContext';

export default function UserChat({ chat, user }) {

    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)

  return (
    <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role = "button"
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} alt="profil" height="35px" />
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">Message</div >
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">01/10/2023</div>
                <div className="this-user-notifications">2</div>
                <span className={isOnline ? "user-online" : ""}></span>
            </div>
    </Stack>
  )
};
