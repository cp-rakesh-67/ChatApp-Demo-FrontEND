import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import {IoMdSend} from 'react-icons/io'
import {BsEmojiSmileFill} from 'react-icons/bs'
import {BiLogOutCircle} from 'react-icons/bi'
import EmojiPicker from 'emoji-picker-react';
import { api } from '../utils/Api';

// socket >>>>>>>>>>>>>>>>>>>>>
import io from 'socket.io-client';
const ENDPOINT='https://chatapp-demo-backend.onrender.com';
var socket;
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const Chat = () => {
  const [allUser,setAllUser]=useState([]);
  const navigate=useNavigate();
  const user=localStorage.getItem('user_details');
  const logged_User=(JSON.parse(user));
  const [loggedUser_pic,setLogedUserPic]=useState();
  const [selectChat,setSelectChat]=useState();
  const [currentChat,SetCurrentChat]=useState(false);
  const [chatUser,setchatUser]=useState(null);
  const [photo,setPhoto]=useState();
  const [isEmoji,setIsemoji]=useState(false);
  const [msg,setmsg]=useState('');
  const [Allmessage,setAllmessage]=useState([]);
  const [socketConnected,setSocketConnected]=useState(false);
  const [newMessage,setNewMessage]=useState({});
  const [change,setChange]=useState(false);
  const toast=useToast();



  const SubmitMsgHndeler=async(e)=>{
    try{
        e.preventDefault();
        const {data}=await axios.post(`${api}/api/v1/message/createChat`,{
          sender:logged_User._id,
          reciever:chatUser?._id,
          message:msg
        })
        console.log(data);
        setNewMessage(data.messages)
        // socket>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        socket.emit('new message',data.messages)
        // socket>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        getmessage();
        setIsemoji(false);
        setmsg('');
    }catch(error){
      console.log(error);
    }      
  }

  const getmessage=async(e)=>{
    try{
       if(chatUser!==undefined){
        const {data}=await axios.post(`${api}/api/v1/message/getAllChat`,{
          sender:logged_User?._id,
          reciever:chatUser?._id,       
        });
        setAllmessage(data.messages)
        
       }else{
        return;
       }
    }catch(error){
      console.log(error);
    }
  }

  const handleEmojipicker=()=>{
       setIsemoji(!isEmoji);
  }

  const onEmojiClick=(event)=>{
    let massege=msg;
    massege=massege+""+event.emoji;
    setmsg(massege);
  }

  const photoUpload=async(e)=>{
    try{
      e.preventDefault();
      if(!photo){
        toast({
          title: 'select a photo by clicking the profile Picture',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position:'top',
          })
          
      }
      else{

        const formdata=new FormData();
      formdata.append('id',logged_User._id);
      formdata.append('photo',photo);
      const {data} =await axios.post(`${api}/api/v1/auth/update-profile-picture`,formdata,{
       headers:{
         "Content-Type":"multipart/form-data"
       }
      })
      toast({
        title: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position:'top',
        })

      }
    }catch(error){
      toast({
        title: 'select a photo by clicking the profile Picture',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:'top',
        })
    }
    
  }
  
  const SelectChatFunction=async(id,index)=>{
      try{
        const {data}=await axios.get(`${api}/api/v1/auth/chat_user/${id}`);
        const res=await data; 
        setchatUser(res.chat_user); 
        if(id==chatUser?._id)
        {
           SetCurrentChat(true);
           setSelectChat(index);
           setChange(true);
           toast({
            title: `chat with ${chatUser?.name}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position:'top-right'
          })
        } 
        else{
          setChange(false);
          toast({
            title: `please double click on chat`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position:'top'
          })
        } 
        
        getmessage();

        console.log(chatUser);
        
      //  socket>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
       socket.emit('join Chat',data.chat_user);
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

      }catch(error)
      {
        console.log(error);
      }
  }
 
  const setPic=async()=>{
    try{
      const {data}=await axios.get(`${api}/api/v1/auth/chat_user/${logged_User?._id}`);
      setLogedUserPic(data.chat_user.profilePic);
    }catch(error){
      console.log(error);
    }
    
  }
  
  const getDATA=async()=>{
    try{
       if (!logged_User)navigate('/');
      if(logged_User){ 
        const {data}=await axios.get(`${api}/api/v1/auth/getAlluser/${logged_User._id}`);
        setAllUser(data.users );
     }
      else{
        navigate('/register');
     }    
    }catch(error){
      console.log(error);
    }    
  }


  // ..................socket>>>>>>>>>>>>>>>>
   useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit('setup',logged_User);
    socket.on('connection',()=>{
         setSocketConnected(true);
    })
   },[])

   useEffect(()=>{
       socket.on('message recieved',(newMessage)=>{
       
       setAllmessage([...Allmessage,newMessage])
    })
   })
  // .............................>>>>>>>>>>>>

   useEffect(()=>{
        getDATA();
        setPic();
        getmessage();
    },[])

  return (
    <div className='h-screen w-screen bg-slate-700 flex  justify-evenly'>
    {/* all contract  part..............................*/}
    <div className='h-screen w-4/12 bg-transparent flex flex-col justify-end'>
    {/* log0 and heading */}
     <div className='w-full h-24 bg-slate-700 py-4 flex gap-7 justify-center shadow'>
          <img className='w-12 h-12 rounded-full'  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXc2MohaPawKNKubjkp-LAHCJRBpF1mVX9vw&usqp=CAU'></img>
          <div className='text-white font-extrabold text-4xl'>CHAT APP</div>
     </div>
    {/* fetch all user */}
     <div className='flex flex-col gap-3 items-center mb-2 overflow-auto '>
         {/* show all user */}
         {allUser.map((items,index)=>(<div style={selectChat===index?{backgroundColor:'blue'}:{}} className='bg-slate-500 w-full py-2 rounded-full text-white flex justify-center gap-5 hover:bg-red-300 cursor-pointer' key={index} onClick={()=>{SelectChatFunction(items._id,index)}}>
         
         <img className='w-12 h-12 rounded-full mt-2 bg-transparent'  src={items.profilePic}></img>
         <div>
         <div className='text-2xl font-bold'>{items.name.length>10?items.name.substr(0,10):items.name}</div>
         <div>{items.email}</div>
         </div>
        
         
         </div>))}
     
     </div>
     {/* show logged user profile */}
      <div className='w-full h-24 bg-slate-700 py-1'>
       <div className='bg-green-500 w-full py-2 rounded-full text-white flex  gap-5'>
       <button type='submit' className='font-bold text-red-600 ml-6 mr-9 text-xl' onClick={photoUpload}>upload</button>
        <label>
        <img className='w-12 h-12 rounded-full mt-2 bg-transparent' src={loggedUser_pic}></img>
        <input type='file' className='hidden' onChange={e=>setPhoto(e.target.files[0])}></input>
        </label>
       
        <div>
          <div className='text-2xl font-bold'>{logged_User.name.length>10?logged_User.name.substr(0,10):logged_User.name}  (You)</div>
          <div>{logged_User.email}</div>
        </div>
       </div>
      </div>
    </div>

    {/* chat part ......................................*/}
    <div className='h-screen w-8/12 bg-slate-900'>
    {/* chat section */}
    
    {currentChat?(
      <div className='h-full'>
      {/* chat headers >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
      <div className='w-full h-20 bg-slate-900 shadow-2xl py-4 flex justify-between border-l-2' >
       <div className='flex gap-3'>
       {change&& <img className='h-14 w-14 rounded-full ml-8 ' src={chatUser?.profilePic}></img>}
       {change && <div className='text-white text-4xl mt-1 font-extrabold ml-3'>{chatUser?.name.substr(0,25)}</div>}
       </div>  
        <button className='mr-10 text-red-600 font-extrabold text-4xl ' onClick={()=>{
           localStorage.clear();
           navigate('/');
        }}><BiLogOutCircle></BiLogOutCircle></button>
      </div>
      {/* chat massage>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
      <div className='w-full h-[81%] mb-2 rounded-lg flex flex-col gap-1 overflow-auto'>
     {change && <div>{Allmessage.map((items,index)=>(<div key={index}>
      <div style={items.sender===logged_User?._id?
      {backgroundColor:'#c9de97', marginLeft:'60% '}:
      {background:'white',marginRight:'60%'}} className='py-2 px-4 rounded-2xl mt-1 flex flex-col ml-3 mr-3'>
      <div className='text-lg font-semibold font-serif'>{items.message}</div>
      <div className=' text-end flex gap-2 justify-end sm:flex-col'>
      <span className='font-semibold font-serif'>-{items.createdAt.substr(0,10)}</span>
      <span className='font-sans'>-{items.createdAt.substr(11,8)}</span>
      </div>
      </div>
      </div>))}</div>}
        
      </div>
      

      {/*chat Input >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */}
      <div className='flex gap-3 w-full h-10 '>
        <div className='text-3xl font-bold ml-5 mt-1 text-yellow-300'>
        <BsEmojiSmileFill onClick={handleEmojipicker}></BsEmojiSmileFill>
        {isEmoji && <div className='absolute top-[220px] '><EmojiPicker  onEmojiClick={onEmojiClick}></EmojiPicker></div>}
        </div>
        <div className='w-full h-full flex gap-2 mr-3'>
          <input value={msg} onChange={e=>setmsg(e.target.value)} className='w-full rounded-full px-4 border-hidden font-serif' type='text' placeholder='type your massege here'></input>
        {msg.length>0?<button className='text-green-300 text-4xl' onClick={SubmitMsgHndeler}><IoMdSend></IoMdSend></button>:<span></span>}
        </div>
      </div>
        
      </div>
    ):(
      <div className='w-full h-full flex flex-col gap-7 justify-center text-center items-center'>
         <img className='h-1/3 w-1/3 rounded-full ' src='data:image/jpeg;base64,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' alt='noImage'></img>
        <div className='text-white flex flex-col gap-2'>
          <p className='text-4xl'>welcome ,<span className='text-yellow-500 ml-2 font-bold'>{logged_User.name}</span></p>
          <p className='text-lg'>please!!  <span className='text-xl font-semibold ml-1 mr-2 decoration-red-400 underline'>Double Click </span> A Chat to Start Massage !!</p>
        </div>
      </div>
    )}

    </div>  
    </div>
  )
}

export default Chat