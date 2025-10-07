
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load components
const Home = lazy(() => import('../pages/home/page'));
const About = lazy(() => import('../pages/about/page'));
const Auth = lazy(() => import('../pages/auth/page'));
const Request = lazy(() => import('../pages/request/page'));
const Donate = lazy(() => import('../pages/donate/page'));
const Profile = lazy(() => import('../pages/profile/page'));
const BloodBanks = lazy(() => import('../pages/blood-banks/page'));
const BloodBankDetail = lazy(() => import('../pages/blood-banks/detail/page'));
const BloodBankDashboard = lazy(() => import('../pages/blood-banks/dashboard/page'));
const DonorDashboard = lazy(() => import('../pages/donor/dashboard/page'));
const Facilities = lazy(() => import('../pages/facilities/page'));
const FacilityDetail = lazy(() => import('../pages/facilities/detail/page'));
const FacilityDashboard = lazy(() => import('../pages/facilities/dashboard/page'));
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/request',
    element: <Request />
  },
  {
    path: '/donate',
    element: <Donate />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/blood-banks',
    element: <BloodBanks />
  },
  {
    path: '/blood-banks/:id',
    element: <BloodBankDetail />
  },
  {
    path: '/blood-banks/dashboard',
    element: <BloodBankDashboard />
  },
  {
    path: '/donor/dashboard',
    element: <DonorDashboard />
  },
  {
    path: '/facilities',
    element: <Facilities />
  },
  {
    path: '/facilities/:id',
    element: <FacilityDetail />
  },
  {
    path: '/facilities/dashboard',
    element: <FacilityDashboard />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
