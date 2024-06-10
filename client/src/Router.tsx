import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Home, Lobby, Login, NotFound, Puissance4 } from './Pages';
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
        <Route path="/puissance-4" element={<Puissance4 />} />
        <Route path="/gameid/:id" element={<Lobby />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
