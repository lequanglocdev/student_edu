import { Alert, Button, Select, TextInput } from "flowbite-react";

import "react-quill/dist/quill.snow.css";

import "react-circular-progressbar/dist/styles.css";
import { useState , } from "react";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    credits: "uncategorized",
    mandatory: "uncategorized",
  });
  const [publishError, setPublishError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  console.log(formData);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/course/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        setSuccessMessage('Môn học đc tạo thành công');
        setFormData({
          courseCode: "",
          courseName: "",
          credits: "uncategorized",
          mandatory: "uncategorized",
        });
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
 
  return (
    <div className="p-2 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-4 font-semibold">Tạo môn học</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Mã môn học"
            required
            id="courseCode"
            className="flex-1"
            value={formData.courseCode}
            onChange={(e) =>
              setFormData({ ...formData, courseCode: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Tên môn học"
            required
            id="courseName"
            className="flex-1"
            value={formData.courseName  }
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
          Tạo môn học
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
        {successMessage && (
          <Alert className="mt-5" color="success">
          {successMessage}
        </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
