
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from "../hooks/useAuthStore";
import { useForm } from '../hooks';
import Swal from "sweetalert2";


interface RegisterFormFields {
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerPassword2: string;
}

const registerFormFields: RegisterFormFields = {
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerPassword2: '',
};


export const Register = () => {

  const { startRegister  } = useAuthStore();
  const { registerEmail, registerName, registerPassword, registerPassword2, onInputChange:onRegisterInputChange } = useForm( registerFormFields );

   const navigate = useNavigate();

  const registerSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validación: Contraseña debe tener al menos 6 caracteres
    const passwordRegistered =  registerPassword2.length < 6;
   
if (passwordRegistered) {
    Swal.fire('Error en registro', 'La contraseña debe tener al menos 6 caracteres', 'error');
    
    return;
  
}

// Validación: Contraseñas deben coincidir
 if ( registerPassword !== registerPassword2 ) {
        Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
        
        return;
    }


     await startRegister({ name: registerName, email: registerEmail, password: registerPassword , password2 : registerPassword2 });
     navigate('/Profile');

    }




  return (
<section className="flex flex-col items-center justify-center min-h-screen color3">
  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-center">Register Form</h1>
    <form className="space-y-6" onSubmit={registerSubmit}>
      <div className="space-y-2">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:color1"
          type="text"
          placeholder="Type your username"
          value={registerName}
          onChange={onRegisterInputChange}
          name='registerName'
          required
        />
      </div>
      <div className="space-y-2">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:color1"
          type="password"
          placeholder="Type your password"
          value={registerPassword}
          onChange={onRegisterInputChange}
          name='registerPassword'
          required
        />
      </div>
      <div className="space-y-2">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:color1"
          type="password"
          placeholder="Confirm your password"
          value={registerPassword2}
          onChange={onRegisterInputChange}
          name='registerPassword2'
          required
        />
      </div>
      <div className="space-y-2">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:color1"
          type="email"
          placeholder="Type your email"
          value={registerEmail}
          onChange={onRegisterInputChange}
          name='registerEmail'
          required
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white color2 rounded-md hover:bg-buttonsHover focus:outline-none focus:ring-2 focus:color1"
        >
          Log In
        </button>

        <Link to={'/Login'}>
        <div className='py-2'>  
          <button
          type="submit"
          className="w-full  px-4 py-2 font-bold text-white color2  rounded-md hover:bg-buttonsHover focus:outline-none focus:ring-2 focus:color1"
        >
          Cancel Register
        </button> 
         </div>
       
        </Link>
       
      </div>
    </form>
   
    

  </div>
</section>


  )
}

