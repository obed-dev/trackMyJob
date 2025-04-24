import { Link } from "react-router-dom";
import { useForm } from "../hooks/index";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { api_URL } from "../env";

interface LoginFormFields {
  loginEmail: string;
  loginPassword: string;
 
}



const loginFormFields: LoginFormFields = {
  loginEmail: '',
  loginPassword: '',

};


export const LoginForm = () => {
  const { startLogin  } = useAuthStore();
  const { loginEmail, loginPassword ,  onInputChange: onLoginInputChange } = useForm(loginFormFields);

   
  const navigate = useNavigate();

  const loginSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
   
    const isAuthenticated = await startLogin({ email: loginEmail, password: loginPassword  });
    console.log(api_URL);
    if (isAuthenticated) {
      navigate('/profile'); // Navega a /profile si las credenciales son correctas
    }
  };
  
 
 

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen color3">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Sign In Form</h1>
          <form className="space-y-6" onSubmit={loginSubmit} >
            <div className="space-y-2">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:color1"
                type="text"
                placeholder="Type your email"
                value={loginEmail}
                onChange={onLoginInputChange}
                name="loginEmail"
                required
              />
            </div>
            <div className="space-y-2">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:color1"
                type="password"
                placeholder="Type your password"
                value={loginPassword}
                onChange={onLoginInputChange}
                name="loginPassword"
                required
              />
            </div>
            
            <div>
              <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white color2 rounded-md hover:bg-buttonsHover focus:outline-none focus:ring-2 focus:color1"
             
              >
                Sign In
              </button>
              
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white color2 rounded-md hover:bg-buttonsHover focus:outline-none focus:ring-2 focus:color1"
              >
                Forgot Password?
              </button>
            </div>
            <Link to={'/Register'}>
              <div className="flex justify-end py-6">
                <button
                  type="button"
                  className="w-3/12 px-4 py-2 font-bold text-white color2 rounded-md hover:bg-buttonsHover focus:outline-none focus:ring-2 focus:color1"
                >
                  Register
                </button>
              </div>
            </Link>
          </form>
        </div>
      </section>
    </>
  );
};