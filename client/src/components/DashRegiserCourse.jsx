import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashRegiserCourse = () => {
  const { createUser } = useSelector((state) => state.user);
  const [course, setCourse] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const handleRowClick = (courseId) => {
    setSelectedCourse((prevSelectedCourse) =>
      prevSelectedCourse === courseId ? null : courseId
    );
  };

  const getScheduleForCourse = (courseId) => {
    // Here you would fetch or prepare the schedule data for the course.
    // For this example, we'll use dummy data.
    const schedules = {
      'course1': ['Monday 10:00 - 12:00', 'Wednesday 14:00 - 16:00'],
      'course2': ['Tuesday 09:00 - 11:00', 'Thursday 13:00 - 15:00'],
      'course3': ['Friday 10:00 - 12:00'],
    };

    return schedules[courseId] || [];
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {course.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Check</Table.HeadCell>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell>Mã môn học</Table.HeadCell>
              <Table.HeadCell>Tên môn học</Table.HeadCell>
              <Table.HeadCell>Số tín chỉ</Table.HeadCell>
              <Table.HeadCell>Bắt buộc</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
              <Table.HeadCell>Sửa</Table.HeadCell>
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
                      to={`/course/${course.slug}`}
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
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${course._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
                {selectedCourse === course._id && (
                  <Table.Row className="bg-gray-100 dark:bg-gray-700">
                    <Table.Cell colSpan="8">
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Schedule</h4>
                        <ul className="list-disc list-inside">
                          {getScheduleForCourse(course._id).map((schedule, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">
                              {schedule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              // onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashRegiserCourse;
