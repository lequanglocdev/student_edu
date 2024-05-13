import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { createUser } = useSelector((state) => state.user);
  return createUser ? <Outlet /> : <Navigate to='/login' />;
}