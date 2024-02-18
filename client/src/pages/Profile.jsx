import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserSucess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSucess,
  deleteUserStart,
  signoutUserFailure,
  signoutUserSucess,
  signoutUserStart,
} from "../redux/user/userSlice";
import axios from "axios";
const Profile = () => {
  //request.resource.size < 2 * 1024 * 1024 &&
  //request.resource.contentType.matches('image/.*')
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePer] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileUploadError, setFileUploadError] = useState(false);
  console.log(formData);
  const handleFileUpLoad = (file) => {
    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    if (file) {
      handleFileUpLoad(file);
    }
  }, [file]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSucess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      const data = res.data;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSucess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await axios.get("/api/user/signout");
      const data = res.data;
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSucess());
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          name="avatar"
          id="avatar"
          hidden
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover mx-auto"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 hover:opacity-95 uppercase disabled:opacity-85 rounded-lg"
          type="submit"
        >
          Update
        </button>
        <button
          className=" bg-green-600 text-white p-3 hover:opacity-95 uppercase disabled:opacity-85 rounded-lg"
          type="submit"
          disabled
        >
          Create Listing
        </button>
      </form>
      <div className="flex gap-2 my-4 justify-between">
        <span
          className="font-semibold text-red-700 cursor-pointer"
          onClick={handleDelete}
        >
          Delete account?
        </span>
        <span
          className="text-red-700 font-semibold cursor-pointer"
          onClick={handleSignOut}
        >
          Sign out
        </span>
      </div>
    </div>
  );
};

export default Profile;
