import { useDispatch, useSelector } from 'react-redux';
import  trackMyJobApi  from '../api/trackMyJobApi';
import { clearErrorMessage , login , logout , onChecking } from '../store/auth/authSlice';
import { Dispatch } from 'redux';
import Swal from 'sweetalert2';
 

// Define interfaces para los parámetros
interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  password2: string;
  name: string;
}

// Define la forma del estado de autenticación
interface AuthState {
  status: string; // 'checking', 'authenticated', 'not-authenticated'
  user: { name: string; uid: string } | null;
  errorMessage: string | null;
}

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state: AuthState) => state.auth); 
  const dispatch: Dispatch = useDispatch(); 

  const startLogin = async ({ email, password }: LoginParams): Promise<boolean> => {
    dispatch(onChecking()); // Cambia el estado a 'checking'
    try {
      const { data } = await trackMyJobApi.post('/auth', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime().toString());
      dispatch(login({ name: data.name, uid: data.uuid })); // Cambia 'uid' por 'uuid'
      return true;
     
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || "Error en las credenciales";
      Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      dispatch(logout(errorMsg)); // Cambia el estado a 'not authenticated'
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 3000);
      return false;
    }
  };

  const startRegister = async ({ email, password, name }: RegisterParams): Promise<void> => {
    dispatch(onChecking());
    try {
      const { data } = await trackMyJobApi.post('/auth/register', { email, password, name });
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime().toString());
      dispatch(login({ name: data.name, uid: data.uid }));
    } catch (error: any) {
      dispatch(logout(error.response?.data?.msg || '--'));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 3000);
    }
  };

  const checkAuthToken = async (): Promise<any> => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      console.log("Token no encontrado, cerrando sesión...");
      return dispatch(logout('token expiro'));
    }
    try {
      const { data } = await trackMyJobApi.get('/auth/new');
     
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime().toString());
      dispatch(login({ name: data.name, uid: data.uid }));
    } catch (error: any) {
    
      localStorage.clear();
      dispatch(logout("Token inválido"));
    }
  };

  const startLogout = (): void => {
    localStorage.clear();
   
    dispatch(logout({}));
  };

  return {
    // Propiedades
    errorMessage,
    status,
    user,

    // Métodos
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  };
};