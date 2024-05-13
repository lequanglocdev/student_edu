
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
const AdminPrivateRoute = () => {
  const { createUser } = useSelector((state) => state.user);
  return (
    createUser && createUser.isAdmin ? (
      <Outlet />
    ) : (
      <Navigate to='/login' />
    )
  )
}

export default AdminPrivateRoute