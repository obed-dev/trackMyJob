import { Routes, Route } from 'react-router-dom';
import {Register} from '../RegisterForm/Register';
import { LoginForm } from '../LoginForm/LoginForm';
import Profile from '../UserComponents/Profile';
import TableComponent from '../UserComponents/TableComponent';
import SettingsComponent from '../UserComponents/Settings';
import { useEffect  } from 'react';
import { useAuthStore  } from "../hooks/useAuthStore";
import App from '../App';






const AppRouter:React.FC = () => {
 
    const { status , checkAuthToken } = useAuthStore();


useEffect(() => {
checkAuthToken();
},[] );

 if (status === 'checking') {
    return (
        <h1>Loading...</h1>
    )
    
 }



    return (
        
        <Routes>
            { 
            ( status === 'not authenticated') ? (
            <>
            <Route path='/' element={<App/>}/>
            <Route path='/Login' element={<LoginForm/>}/>
            <Route path='/Register' element={<Register />} />
             </> )
             : ( 

             <>
             <Route path="/TableComponent" element={<TableComponent />} />
              <Route path="/Profile" element={<Profile />} />
            <Route path='/Settings' element={<SettingsComponent/>}  />
             </> 
               )
             }
            
            
        </Routes>
    );
}

export default AppRouter;
