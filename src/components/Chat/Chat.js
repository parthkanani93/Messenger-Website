import React, { useState, useEffect } from 'react';
import './Chat.css';
import queryString from 'query-string'; //helping retriving data from url
import io from 'socket.io-client';


let socket;

//it come from props so we pass object as a props location
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = 'localhost:5000'; //url of server

    useEffect(() => {
        const { name, room } = queryString.parse(location.search); //this will get data from url

        socket = io(ENDPOINT);


        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {

        }); //send the event of this person has join to the server

        //this will happen when component is unmount
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);


    return (
        <div>
            <p>Chat</p>
        </div>
    )
}

export default Chat;