import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashRegiserCourse = () => {
  const { createUser } = useSelector((state) => state.user);
  const [course, setCourse] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [registrationInfo, setRegistrationInfo] = useState(null);
  useEffect(() => {
    console.log(registrationInfo);
  }, [registrationInfo]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/course/getCourse`);
        const data = await res.json();
        if (res.ok) {
          setCourse(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [createUser._id]);

  const handleShowMore = async () => {
    const startIndex = course.length;
    try {
      const res = await fetch(
        `/api/course/getCourse?userId=${createUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setCourse((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRowClick = async (courseId) => {
    setSelectedCourse((prevSelectedCourse) =>
      prevSelectedCourse === courseId ? null : courseId
    );

    if (selectedCourse !== courseId) {
      try {
        const res = await fetch(`/api/schedule/getScheduleByCourseId/${courseId}`);
        const data = await res.json();
        if (res.ok) {
          setSchedule(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setSchedule([]);
    }
  };

  const handleRegisterCourse = async () => {
    try {
      const res = await fetch("/api/registercourse/registerCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: createUser._id,
          courseId: selectedCourse,
          scheduleId: schedule.map(sch => sch._id),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegistrationInfo(data.registration);
      } else {
        console.log("Đăng ký không thành công:", data.message);
      }
    } catch (error) {
      console.log("Lỗi khi đăng ký môn học:", error.message);
    }
  };


  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {course.length > 0 ? (
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
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Cell>
                    <input
                      type="radio"
                      checked={selectedCourse === course._id}
                      onChange={() => handleRowClick(course._id)}
                      className={`form-radio ${selectedCourse === course._id ? 'text-green-500' : ''}`}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{course.courseCode}</Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                    >
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
          {/* {schedule.length > 0 && (
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-2">Lịch học:</h2>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Ngày</Table.HeadCell>
                  <Table.HeadCell>Thời gian bắt đầu</Table.HeadCell>
                  <Table.HeadCell>Thời gian kết thúc</Table.HeadCell>
                  <Table.HeadCell>Giáo viên</Table.HeadCell>
                  <Table.HeadCell>Địa điểm</Table.HeadCell>
                </Table.Head>
                {schedule.map((sch) => (
                  <Table.Body key={sch._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
          )} */}
           <Button gradientDuoTone="purpleToBlue" outline onClick={handleRegisterCourse}>
                Đăng ký
              </Button>
           {/* Hiển thị thông tin đăng ký sau khi đăng ký thành công */}
           
           {registrationInfo && (
  <div className="mt-5">
    <h2 className="text-xl font-semibold mb-2">Thông tin đăng ký:</h2>
    console.log(registrationInfo)
    <p>Sinh viên: {registrationInfo?.student?.username}</p>
    <p>Môn học: {registrationInfo.course}</p>
    <h3 className="text-lg font-semibold mb-2">Lịch học:</h3>
    <Table>
      <Table.Head>
        <Table.HeadCell>Ngày</Table.HeadCell>
        <Table.HeadCell>Thời gian bắt đầu</Table.HeadCell>
        <Table.HeadCell>Thời gian kết thúc</Table.HeadCell>
        <Table.HeadCell>Giáo viên</Table.HeadCell>
        <Table.HeadCell>Địa điểm</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {Array.isArray(registrationInfo.schedule) && registrationInfo.schedule.map((sch) => (
          <Table.Row key={sch._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>{sch.dayOfWeek}</Table.Cell>
            <Table.Cell>{sch.startTime}</Table.Cell>
            <Table.Cell>{sch.endTime}</Table.Cell>
            <Table.Cell>{sch.teacher}</Table.Cell>
            <Table.Cell>{sch.location}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
)}

        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashRegiserCourse;
