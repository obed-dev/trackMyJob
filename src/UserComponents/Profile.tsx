import React, { useEffect, useState } from "react";
import { static_URL } from "../env";
import NavBar from "./NavBar";
import perfil from "../assets/obed-animated.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

const Profile: React.FC = () => {
  const { user } = useSelector((state: { auth: any }) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startUpdateProfile } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(user?.description || "");
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || perfil
  );
  const [newImgFile, setNewImgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Sincroniza el estado local con Redux cuando el usuario cambia
  useEffect(() => {
    setDescription(user?.description || "");
    setProfileImage(user?.profileImage || perfil);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout(undefined));
    localStorage.clear();
    navigate("/login");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImgFile(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await startUpdateProfile({
      name: user?.name || "",
      description,
      profileImage: newImgFile,
    });
    if (success) {
      setEditing(false);
      setNewImgFile(null);
    }
    setLoading(false);
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center max-h-screen">
        <div className="bg-white dark:bg-darkBackground border border-color1 dark:border-darkColor1 rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
          <div className="relative">
            <img
              src="https://selfmadewebdesigner.com/wp-content/uploads/2020/07/how-to-advance-your-career-as-a-frontend-web-developer.jpg"
              alt="Cover"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute left-4 bottom-0 transform translate-y-1/2">
              <img
  src={
    profileImage
      ? profileImage.startsWith("http")
        ? profileImage
        : `${static_URL}${profileImage.replace(/\\/g, "/")}`
      : perfil
  }
  alt="Profile"
  className="w-24 h-24 rounded-full border-4 border-color4 dark:border-darkColor2 object-cover"
/>
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={handleImageChange}
                />
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-montserrat font-bold text-black dark:text-darkText p-10">
                  {user?.name || "Guest"}
                </h2>
                <p className="text-color2 font-montserrat font-bold dark:text-color5">
                  Software Engineer
                </p>
                <p className="text-color2 font-montserrat font-bold  dark:text-color5">
                  San Jose, Costa Rica | 200+ connections
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:flex-row space-y-2 sm:space-y-2 sm:space-x-2">
                {!editing ? (
                  <>
                    <button
                      className="bg-buttons dark:bg-darkButtons text-white py-2 px-4 rounded-lg hover:bg-buttonsHover dark:hover:bg-darkButtonsHover"
                      onClick={() => setEditing(true)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                      onClick={() => setEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4">
              {!editing ? (
                <p className="text-color1 dark:text-darkText font-montserrat font-bold">
                  {user?.description ||
                    "Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success."}
                </p>
              ) : (
                <textarea
                  className="w-full p-2 border rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
