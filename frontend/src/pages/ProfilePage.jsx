import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const MAX_SIZE = 2 * 1024 * 1024;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if(file.size > MAX_SIZE){
      toast.error("File size must be less than 2MB");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-16 pb-16 bg-base-100">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-200 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-primary">Profile</h1>
            <p className="mt-1 text-base-content/70">Your personal information</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-primary/20 overflow-hidden shadow-md">
                  <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-primary hover:bg-primary-focus
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200 shadow-md
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-70" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-base-content/60">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* User info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </div>
                <p className="px-4 py-3 bg-base-100 rounded-lg border border-base-300 text-base-content">
                  {authUser?.fullName}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </div>
                <p className="px-4 py-3 bg-base-100 rounded-lg border border-base-300 text-base-content">
                  {authUser?.email}
                </p>
              </div>
            </div>

            {/* Account information */}
            <div className="bg-base-100 rounded-xl p-6 border border-base-300">
              <h2 className="text-lg font-medium flex items-center gap-2 text-primary mb-4">
                <Shield className="w-5 h-5" />
                Account Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-3 border-b border-base-300">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    Member Since
                  </span>
                  <span className="font-medium">{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    Account Status
                  </span>
                  <span className="font-medium text-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;