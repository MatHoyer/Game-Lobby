import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Games, Home, Login, NotFound } from './Pages';
import { useUserStore } from './store';

export const routes = [
  {
    path: '/',
    name: 'Home',
    element: <Home />,
  },
];

const UnloggedRoutes = () => {
  const store = useUserStore();

  if (store.name !== '') {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

const LoggedRoutes = () => {
  const store = useUserStore();

  if (store.name === '') {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export const Router = () => {
  return (
    <Routes>
      <Route element={<UnloggedRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<LoggedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/gameid/:id" element={<Games />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
