
import { Alert, Button, Select, TextInput } from 'flowbite-react';

import 'react-quill/dist/quill.snow.css';

import { useEffect, useState } from 'react';

import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UpadateCourse = () => {

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { createUser } = useSelector((state) => state.user);

useEffect(() => {
  try {
    const fetchPost = async () => {
      const res = await fetch(`/api/course/getCourse?courseId=${courseId}`);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        const editedCourse = data.courses.find(
          (course) => course._id === courseId
        );

        if (editedCourse) {
          setFormData(editedCourse);
        }
        console.log("course", editedCourse);
      }
    };

    fetchPost();
  } catch (error) {
    console.log("lỗi",error.message);
  }
}, [courseId]);


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`/api/course/updatecourse/${formData._id}/${createUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log("response",data)
    
    if (!res.ok) {
      setPublishError(data.message);
      return;
    }

    if (res.ok) {
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    }
  } catch (error) {
    setPublishError('Something went wrong');
  }
};
  return (
    <div className="p-2 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-4 font-semibold">Cập nhật môn học</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Mã môn học"
            required
            id="courseCode"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, courseCode: e.target.value })
            }
            value={formData.courseCode}
            
          />
          <TextInput
            type="text"
            placeholder="Tên môn học"
            required
            id="courseName"
            className="flex-1"
            value={formData.courseName }
            onChange={(e) =>
              setFormData({ ...formData, courseName: e.target.value })
            }
          />
          <Select
           value={formData.credits}
            onChange={(e) =>
              setFormData({ ...formData, credits: e.target.value })
            }
          >
            <option value="uncategorized">Số tín chỉ</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
          <Select
           value={formData.mandatory}
            onChange={(e) =>
              setFormData({ ...formData, mandatory: e.target.value })
            }
          >
            <option value="uncategorized">Bắt buộc</option>
            <option value="true">Co</option>
            <option value="false">Không</option>
          </Select>
        </div>

        <Button type="submit" gradientDuoTone="purpleToPink">
          Cập nhật môn học
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
       
      </form>
    </div>
  )
}

export default UpadateCourse