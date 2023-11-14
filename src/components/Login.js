import React, { useState } from 'react'
import { NavLink,useNavigate} from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { api } from '../utils/Api';

const Login = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const toast=useToast();
  const navigate=useNavigate();

  const submitHandler=async(e)=>{
    try{
      e.preventDefault();
      if(!email || !password)
         {
           toast({
           title: 'Please!!! Fill All Field.................',
           status: 'warning',
           duration: 3000,
           isClosable: true,
           position:'top',
           })
          }
          else{
            const body={
              email,
              password
            }
            const {data}=await axios.post(`${api}/api/v1/auth/login`,body);
            localStorage.setItem('user_details',JSON.stringify(data.user));   
            toast({
             title: data.message,
             status: 'success',
             duration: 3000,
             isClosable: true,
             position:'top',
             })
             navigate('/chats');
         }
    }catch(error){
      toast({
        title: error.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:'top',
        })
    }    
  }
  return (
    <div className='bg-slate-700 h-screen w-screen flex justify-center p-24'>
            
            <form onSubmit={submitHandler} className='shadow-md hover:shadow-2xl rounded-3xl flex flex-col h-4/5 w-4/12 bg-slate-900 px-10 justify-center gap-4'>
               <div className='flex justify-center gap-4 mb-3'>
                <img className='w-9 h-9' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXc2MohaPawKNKubjkp-LAHCJRBpF1mVX9vw&usqp=CAU' alt='no'></img>
                <h1 className='text-white font-bold mt-1 text-xl'>CHAT_APP</h1>
                </div>
                <input className='bg-transparent border-b-2 rounded-lg py-1 px-3 text-center text-blue-500' name='email' type='email' placeholder='Enter Email , eg--xyz@gmail.com' value={email} onChange={e=>setEmail(e.target.value)}></input>
                <input className='bg-transparent border-b-2 rounded-lg  py-1 px-3 text-center text-blue-500' name='password' type='password' placeholder='Enter your password' value={password} onChange={e=>setPassword(e.target.value)}></input>          
                <button type='submit' className='bg-blue-300 mt-3 rounded-3xl py-1 font-semibold hover:bg-blue-800'>Login</button>
                <div className='flex text-white gap-3 mb-1 mt-2 justify-center'><span >If You Don't Have Account.</span><NavLink to='/register'><span className='text-blue-700 font-semibold underline text-lg decoration-white underline-offset-1'>Create Account</span></NavLink></div>
            </form>
      
    </div>
  )
}

export default Login