import {Routes,Route} from 'react-router-dom'
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
 
  return (
    <Routes>  
       <Route path='/' element={<Login></Login>}></Route>
       <Route path='/register' element={<Register></Register>}></Route>
       <Route path='/chats' element={<Chat></Chat>}></Route>)
    </Routes>  
  );
}

export default App;
