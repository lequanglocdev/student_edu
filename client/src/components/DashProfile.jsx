// import React from 'react'
import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFail,
} from "../redux/user/userSlice";

const DashProfile = () => {
  // eslint-disable-next-line no-unused-vars
  const { createUser, error, loading } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const fileRef = useRef();

  const [formData, setFormData] = useState({});
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };
  // console.log(image,imageUrl)
  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 5MB)"
        );
        setImageFileUploadProgress(null);
        setImage(null);
        setImageUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
    // console.log("uploadimgae ...");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      console.log(imageFileUploading);
      setUpdateUserError("Please wait for image to upload");

      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${createUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFail(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFail(error.message));
      setUpdateUserError(error.message);
    }
  };
 
  return (
    <div className="max-w-3xl mx-auto p-3 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-7">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => fileRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 132, 189, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageUrl || createUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <div className={`flex ${createUser.isAdmin ? 'flex-col' : 'justify-between'} gap-4`}>
          <div className={`${createUser.isAdmin ? 'w-3xl' : 'w-96'} flex flex-col gap-4`}>
            <TextInput
              type="text"
              id="username"
              placeholder="username"
              defaultValue={createUser.username}
              onChange={handleChange}
            />
            <TextInput
              type="email"
              id="email"
              placeholder="email"
              defaultValue={createUser.email}
              onChange={handleChange}
            />
            {!createUser.isAdmin && (
              <TextInput
                type="idstudent"
                id="idstudent"
                placeholder="mssv"
                defaultValue={createUser.idstudent}
                onChange={handleChange}
              />
            )}
          </div>
          <div className={` ${createUser.isAdmin ? 'w-3xl' : 'w-96'}  flex flex-col gap-4`}>
          {!createUser.isAdmin && (
              <Select
              id="gender"
              // defaultValue={createUser.gender}
              // onChange={handleChange}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="uncategorized">Chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </Select>
          )}

            {!createUser.isAdmin && (
              <TextInput
                type="class"
                id="class"
                placeholder="Lớp"
                defaultValue={createUser.class}
                onChange={handleChange}
              />
            )}
            <TextInput
              type="password"
              id="password"
              placeholder="password"
              onChange={handleChange}
            />
          </div>
        </div>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Cập nhật thông tin"}
        </Button>
        {createUser.isAdmin && (
          <Link to={"/create-course"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              <span className="text-base"> Tạo tạo môn học</span>
            </Button>
          </Link>
        )}
          {createUser.isAdmin && (
          <Link to={"/create-schedule"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              <span className="text-base"> Tạo tạo lịch học</span>
            </Button>
          </Link>
        )}
      </form>
     
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}

    
    </div>
  );
};

export default DashProfile;
