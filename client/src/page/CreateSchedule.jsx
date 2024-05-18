import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useState } from "react";

const CreateSchedule = () => {
  const [formData, setFormData] = useState({
    course: "",
    classId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/schedule/create", {
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
        setSuccessMessage('Lịch học được tạo thành công');
        setFormData({
          course: "",
          classId: "",
          dayOfWeek: "",
          startTime: "",
          endTime: "",
          location: "",
        });
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-2 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-4 font-semibold">Tạo lịch học</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Mã môn học"
            required
            id="course"
            className="flex-1"
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Mã lớp"
            required
            id="classId"
            className="flex-1"
            value={formData.classId}
            onChange={(e) =>
              setFormData({ ...formData, classId: e.target.value })
            }
          />
          <Select
            value={formData.dayOfWeek}
            onChange={(e) =>
              setFormData({ ...formData, dayOfWeek: e.target.value })
            }
          >
            <option value="">Chọn ngày trong tuần</option>
            <option value="Monday">Thứ Hai</option>
            <option value="Tuesday">Thứ Ba</option>
            <option value="Wednesday">Thứ Tư</option>
            <option value="Thursday">Thứ Năm</option>
            <option value="Friday">Thứ Sáu</option>
            <option value="Saturday">Thứ Bảy</option>
            <option value="Sunday">Chủ Nhật</option>
          </Select>
          <TextInput
            type="time"
            placeholder="Thời gian bắt đầu"
            required
            id="startTime"
            className="flex-1"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
          <TextInput
            type="time"
            placeholder="Thời gian kết thúc"
            required
            id="endTime"
            className="flex-1"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Địa điểm"
            required
            id="location"
            className="flex-1"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>

        <Button type="submit" gradientDuoTone="purpleToPink">
          Tạo lịch học
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

export default CreateSchedule;
