import React, { useContext, useState } from 'react'
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!selectedImage && !removeProfilePic){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }
    if(removeProfilePic){
      await updateProfile({fullName: name, bio, profilePic: null});
      navigate('/');
      return;
    }
    const render = new FileReader();
    render.readAsDataURL(selectedImage);
    render.onload = async() => {
      const base64Image = render.result;
      await updateProfile({fullName: name, bio, profilePic: base64Image});
      navigate('/');
    }
  }

  const handleRemoveProfilePic = () => {
    setRemoveProfilePic(true);
    setSelectedImage(null);
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-sm text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer underline'>
            <input
              onChange={(e) => {
                setSelectedImage(e.target.files[0]);
                setRemoveProfilePic(false);   // reset remove state
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />

            <img 
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : removeProfilePic
                  ? assets.avatar_icon
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt=""
              className="w-12 h-12 rounded-full"
            />

            {(authUser?.profilePic && !removeProfilePic) || selectedImage ? 'Change profile picture' : 'Upload Profile Picture'}
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' placeholder='Your Name' />
          <textarea placeholder='Write a bio' required onChange={(e) => setBio(e.target.value)} value={bio} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
          <button type='submit' className='bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <div className="flex flex-col items-center mx-10 max-sm:mt-10">
          <img
            className={`max-w-44 aspect-square rounded-full`}
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : removeProfilePic
                ? assets.logo_icon
                : authUser?.profilePic || assets.logo_icon
            }
            alt=""
          />

          {((authUser?.profilePic || selectedImage) && !removeProfilePic) && (
            <button
              type="button"
              onClick={handleRemoveProfilePic}
              className="flex items-center gap-2 mt-3 text-red-400 text-sm hover:text-red-300 transition"
            >
              <FiTrash2 size={16} />
              Remove
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfilePage