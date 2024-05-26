import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const DashRegisterCourse = () => {
  const { createUser } = useSelector((state) => state.user);
  const [course, setCourse] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null); // New state for selected schedule
  const [registrationInfo, setRegistrationInfo] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/course/getCourse`);
        const data = await res.json();
        if (res.ok) {
          setCourse(data?.courses);
          if (data.courses?.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };

    fetchCourses();
  }, []);

  const handleShowMore = async () => {
    const startIndex = course.length;
    try {
      const res = await fetch(
        `/api/course/getCourse?userId=${createUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setCourse((prev) => [...prev, ...data.courses]);
        if (data.courses.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more courses:", error.message);
    }
  };

  const handleRowClick = async (courseId) => {
    if (selectedCourse === courseId) {
      setSelectedCourse(null);
      setSchedule([]);
      setSelectedSchedule(null); // Reset selected schedule
      return;
    }
    setSelectedCourse(courseId);
    try {
      const res = await fetch(
        `/api/schedule/getScheduleByCourseId/${courseId}`
      );
      const data = await res.json();
      if (res.ok) {
        setSchedule(data);
        setSelectedSchedule(null); // Reset selected schedule
      }
    } catch (error) {
      console.error("Error fetching schedule:", error.message);
    }
  };

  const handleRegisterCourse = async () => {
    if (!selectedCourse || !selectedSchedule) {
      console.error("No course or schedule selected");
      return;
    }
    try {
      const res = await fetch("/api/registercourse/registerCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: createUser._id,
          courseId: selectedCourse,
          scheduleId: selectedSchedule, // Use the selected schedule
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegistrationInfo(data.registration);
        console.log("Course registered successfully");
        fetchRegisteredCourses(createUser._id); // Fetch updated registered courses
        setTimeout(() => {
          setRegistrationInfo(null);
        }, 2000);
      } else {
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Error during course registration:", error.message);
    }
  };

  useEffect(() => {
    if (createUser._id) {
      fetchRegisteredCourses(createUser._id);
    }
  }, [createUser._id]);

  const fetchRegisteredCourses = async (userId) => {
    try {
      const res = await fetch(
        `/api/registercourse/getRegistrationsByStudent/${userId}`
      );
      const data = await res.json();
      if (res.ok) {
        setRegisteredCourses(data.registrations);
      }
    } catch (error) {
      console.error("Error fetching registered courses:", error.message);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    try {
      const res = await fetch(
        `/api/registercourse/deleteRegistration/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        console.log("Registration deleted successfully");
        fetchRegisteredCourses(createUser._id);
      } else {
        console.error("Deletion failed");
      }
    } catch (error) {
      console.error("Error during registration deletion:", error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {!createUser.isAdmin && course?.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Môn học:</h2>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Check</Table.HeadCell>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell>Mã môn học</Table.HeadCell>
              <Table.HeadCell>Tên môn học</Table.HeadCell>
              <Table.HeadCell>Số tín chỉ</Table.HeadCell>
              <Table.HeadCell>Bắt buộc</Table.HeadCell>
            </Table.Head>
            {course.map((course) => (
              <Table.Body className="divide-y" key={course._id}>
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  onClick={() => handleRowClick(course._id)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>
                    <input
                      type="radio"
                      checked={selectedCourse === course._id}
                      onChange={() => handleRowClick(course._id)}
                      className={`form-radio ${
                        selectedCourse === course._id ? "text-green-500" : ""
                      }`}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{course.courseCode}</Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white">
                      {course.courseName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{course.credits}</Table.Cell>
                  <Table.Cell>
                    {course.mandatory ? (
                      <FaCheck className="text-green-500 " />
                    ) : (
                      <FaTimes className="text-red-500 " />
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}

          {/* Lịch học */}

          {selectedCourse && schedule?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-2">Lịch học:</h2>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Chọn</Table.HeadCell>
                  <Table.HeadCell>Ngày</Table.HeadCell>
                  <Table.HeadCell>Thời gian bắt đầu</Table.HeadCell>
                  <Table.HeadCell>Thời gian kết thúc</Table.HeadCell>
                  <Table.HeadCell>Giáo viên</Table.HeadCell>
                  <Table.HeadCell>Địa điểm</Table.HeadCell>
                </Table.Head>
                {schedule.map((sch) => (
                  <Table.Body key={sch._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <input
                          type="radio"
                          checked={selectedSchedule === sch._id}
                          onChange={() => setSelectedSchedule(sch._id)}
                          className={`form-radio ${
                            selectedSchedule === sch._id ? "text-green-500" : ""
                          }`}
                        />
                      </Table.Cell>
                      <Table.Cell>{sch.dayOfWeek}</Table.Cell>
                      <Table.Cell>{sch.startTime}</Table.Cell>
                      <Table.Cell>{sch.endTime}</Table.Cell>
                      <Table.Cell>{sch.teacher}</Table.Cell>
                      <Table.Cell>{sch.location}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </div>
          )}
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleRegisterCourse}
          >
            Đăng ký
          </Button>
          {registrationInfo && (
            <div className="mt-5 p-4 bg-green-100 text-green-700 rounded">
              Đăng ký thành công! Thông tin đăng ký:
            </div>
          )}
        </>
      ) : (
        <p>Bạn chưa có môn học nào!</p>
      )}
      {registeredCourses.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-2">
            Danh sách môn học đã đăng ký:
          </h2>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Mã môn học</Table.HeadCell>
              <Table.HeadCell>Tên môn học</Table.HeadCell>
              <Table.HeadCell>Lớp học</Table.HeadCell>
              <Table.HeadCell>Lịch học</Table.HeadCell>
              <Table.HeadCell>Ngày đăng ký</Table.HeadCell>
              <Table.HeadCell>Học phí</Table.HeadCell>
              <Table.HeadCell>Tên giảng viên</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
              <Table.HeadCell>Hủy môn học</Table.HeadCell>
            </Table.Head>
            {registeredCourses.map((registration) => (
              <Table.Body className="divide-y" key={registration._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{registration.course.courseCode}</Table.Cell>
                  <Table.Cell>{registration.course.courseName}</Table.Cell>
                  <Table.Cell>{registration.schedule.class}</Table.Cell>
                  <Table.Cell>{registration.schedule.dayOfWeek}</Table.Cell>
                  <Table.Cell>{`${registration.schedule.startTime} - ${registration.schedule.endTime}`}</Table.Cell>
                  <Table.Cell>{registration.tuitionFee}</Table.Cell>
                  <Table.Cell>{registration.schedule.teacher}</Table.Cell>
                  <Table.Cell>{registration.status}</Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleDeleteRegistration(registration._id)}
                    >
                      <FaTrash className="text-red-500 ml-6 s text-xl" />
                    </button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      )}
     
    </div>
  );
};

export default DashRegisterCourse;
