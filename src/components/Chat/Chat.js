import React, { useState, useEffect } from 'react';
import './Chat.css';
import queryString from 'query-string'; //helping retriving data from url
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';


let socket;

//it come from props so we pass object as a props location
const Chat = ({ location }) => {
    const [name, setName] = useState(''); //for store user-name
    const [room, setRoom] = useState(''); // for store room name

    const [message , setMessage]= useState(''); //for store one message
    const [messages , setMessages] = useState([]); //for storing set of messages in array

    const ENDPOINT = 'localhost:5000'; //url of server


    //this use effect of join user to the server
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



    //second use effect for handling messages
    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages , message]); //spedring because when new message arrive they add in array
        })

    },[messages]);




    //function for sending message 
    const sendMessage = (event) =>{
        
        event.preventDefault(); //because of when we press key not all page reload only that event is reload

        //if message occure than it will execute and after callback happen and clear the message
        if(message){
            socket.emit('sendMessage' , message , ()=>{
                setMessage('');
            })
        };

        console.log(message , messages);

    }


    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

            </div>
        </div>
    )
}

export default Chat;