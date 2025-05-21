import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store"; // Importa el tipo RootState
import trackMyJobApi from "../api/trackMyJobApi";
import {
  clearErrorMessage,
  login,
  logout,
  onChecking,
} from "../store/auth/authSlice";
import { Dispatch } from "redux";
import Swal from "sweetalert2";

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

interface UpdateProfileParams {
  name: string;
  description: string;
  profileImage?: File | null;
}

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: Dispatch = useDispatch();

  const startLogin = async ({
    email,
    password,
  }: LoginParams): Promise<boolean> => {
    dispatch(onChecking()); // Cambia el estado a 'checking'
    try {
      const { data } = await trackMyJobApi.post("/auth", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime().toString());
      dispatch(login({
      id: data.id,
      name: data.name,
      email: data.email,
      description: data.description, 
      profileImage: data.profileImage, 
    }));
      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || "Error en las credenciales";
      Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "OK",
      });
      dispatch(logout(errorMsg)); // Cambia el estado a 'not authenticated'
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 3000);
      return false;
    }
  };

  const startRegister = async ({
    email,
    password,
    name,
  }: RegisterParams): Promise<void> => {
    dispatch(onChecking());
    try {
      const { data } = await trackMyJobApi.post("/auth/register", {
        email,
        password,
        name,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime().toString());
      dispatch(login({ id: data.id, name: data.name, email: data.email }));
    } catch (error: any) {
      dispatch(logout(error.response?.data?.msg || "--"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 3000);
    }
  };

  const checkAuthToken = async (): Promise<any> => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      console.log("Token no encontrado, cerrando sesión...");
      dispatch(logout("token expiro"));
      return;
    }
    try {
      const { data } = await trackMyJobApi.get("/auth/new");

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime().toString());
      dispatch(
        login({
          id: data.user.uuid,
          name: data.user.name,
          email: data.user.email,
          description: data.user.description,
          profileImage: data.user.profileImage,
        })
      );
    } catch (error: any) {
      localStorage.clear();
      dispatch(logout("Token inválido"));
    }
  };

  const startUpdateProfile = async ({
    name,
    description,
    profileImage,
  }: UpdateProfileParams): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const { data } = await trackMyJobApi.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(
        login({
          ...user,
          ...data.user,
        })
      );

      return true;
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el perfil",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }
  };

  const startLogout = (): void => {
    localStorage.clear();

    dispatch(logout(undefined));
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
    startUpdateProfile,
  };
};
