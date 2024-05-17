import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
const DashPost = () => {
  const { createUser } = useSelector((state) => state.user);
  const [course, setCourse] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  console.log(course);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `/api/course/getCourse?userId=${createUser._id}`
        );
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
    if (createUser.isAdmin) {
      fetchPost();
    }
  }, [createUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {createUser.isAdmin && course.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ngày tạo</Table.HeadCell>
              <Table.HeadCell>Mã môn học</Table.HeadCell>
              <Table.HeadCell>Tên môn học</Table.HeadCell>
              <Table.HeadCell>Số tín chỉ</Table.HeadCell>
              <Table.HeadCell>Bắt buộc</Table.HeadCell>
              <Table.HeadCell>Xóa</Table.HeadCell>
              <Table.HeadCell>
                <span>Sửa</span>
              </Table.HeadCell>
            </Table.Head>
            {course.map((course) => (
              // eslint-disable-next-line react/jsx-key
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
                        // set(post._id);
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

export default DashPost;
