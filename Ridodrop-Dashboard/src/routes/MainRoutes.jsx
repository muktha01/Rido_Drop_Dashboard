import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from 'components/ProtectedRoute';
// import AddAdmin from './AddAdmin';
// import AlllAdmins from './AlllAdmins';
// import AddDriverSafety from './AddDriverSafety';
import AddPrice from '../views/price/AddPrice';
import VehicleList from '../views/vehicle/VehicleList';
import OrderAnalytics from '../views/order/OrderAnalytics';
import OrdersList from '../views/order/OrdersList';
import ServiceCityStatus from '../views/service/ServiceCityStatus';
import AppSetting from '../views/app/AppSetting';
import AppSettingDetail from '../views/app/AppSettingDetail';
import VehicleManagement from '../views/app/VehicleManagement';
import TicketRise from '../views/app/TicketRise';
import CustomerTicketQueries from '../views/app/CustomerTicketQueries';
import PartnerTicketQueries from '../views/app/PartnerTicketQueries';
import CouponCode from '../views/coupon/CouponCode';
import TicketOverview from '../views/ticket/TicketOverview';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const SiteAnalytics = Loadable(lazy(() => import('views/dashboard/SiteAnalytics')));

// test components
const CookieTestComponent = Loadable(lazy(() => import('components/CookieTestComponent')));

// utilities routing
// const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const AllDrivers = Loadable(lazy(() => import('../routes/AllDrivers')));
// const DetailDriver = Loadable(lazy(() => import('../routes/DriverDetail')));
// const DriverRequest = Loadable(lazy(() => import('../routes/DriverRequests')));
// const DriversCaution = Loadable(lazy(() => import('../routes/DriversCaution')));
const ManageDriver = Loadable(lazy(() => import('views/driver/ManageDriver')));
const DriverDetail = Loadable(lazy(() => import('views/driver/DriverDetail')));
const ManageVehicle = Loadable(lazy(() => import('views/vehicle/ManageVehicle')));
const ManageRate = Loadable(lazy(() => import('views/rate/ManageRate')));
const ManageUser = Loadable(lazy(() => import('views/user/ManageUser')));
const ManageService = Loadable(lazy(() => import('views/service/ManageService')));
const ManageCustomer = Loadable(lazy(() => import('views/customer/ManageCustomer')));
const CustomerDetail = Loadable(lazy(() => import('views/customer/CustomerDetail')));
const CustomerOrders = Loadable(lazy(() => import('views/customer/CustomerOrders')));
const OrderDetails = Loadable(lazy(() => import('views/order/OrderDetails')));
const ManageOrder = Loadable(lazy(() => import('views/order/ManageOrder')));
const AssignOrder = Loadable(lazy(() => import('views/order/AssignOrder')));
const CustomerWallet = Loadable(lazy(() => import('views/customer/CustomerWallet')));
const LiveTracking = Loadable(lazy(() => import('views/tracking/LiveTracking')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <DashboardDefault />
    },
    {
      path: 'default',
      element: <DashboardDefault />
    },
    // {
    //   path: 'AllDrivers',
    //   element: <AllDrivers />
    // },
    // {
    //   path: 'DriverRequest',
    //   element: <DriverRequest />
    // },
    // {
    //   path: 'driver/detail/:id',
    //   element: <DetailDriver />
    // },
    {
      path: 'test-cookies',
      element: <CookieTestComponent />
    },
    // {
    //   path: 'add/admin',
    //   element: <AddAdmin />
    // },
    // {
    //   path: 'all/admin',
    //   element: <AlllAdmins />
    // },
    // {
    //   path: 'driver/safety',
    //   element: <DriversCaution />
    // },
    // {
    //   path: 'add/safety',
    //   element: <AddDriverSafety />
    // },
    // // {
    //   path: 'analytics',
    //   element: <SiteAnalytics />
    // },
    {
      path: 'drivers',
      element: <ManageDriver />
    },
    {
      path: 'drivers/:id',
      element: <DriverDetail />
    },
    {
      path: 'driver/details/:regNo',
      element: <DriverDetail />
    },
    {
      path: 'vehicles',
      element: <ManageVehicle />
    },
    {
      path: 'vehicle/list/:vehicleType/:subType',
      element: <VehicleList />
    },
    {
      path: 'vehicle/list/:vehicleType/:subType/:truckType',
      element: <VehicleList />
    },
    {
      path: 'rates',
      element: <ManageRate />
    },
    {
      path: 'price/add/:vehicleType/:subType',
      element: <AddPrice />
    },
    {
      path: 'users',
      element: <ManageUser />
    },
    {
      path: 'services',
      element: <ManageService />
    },
    {
      path: 'customers',
      element: <ManageCustomer />
    },
    {
      path: 'customers/:id',
      element: <CustomerDetail />
    },
    {
      path: 'customers/:customerId/orders',
      element: <CustomerOrders />
    },
    {
      path: 'customers/:customerId/wallet',
      element: <CustomerWallet />
    },
    {
      path: 'orders',
      element: <OrderDetails />
    },
    {
      path: 'manage-orders',
      element: <ManageOrder />
    },
    {
      path: 'orders/assign/:orderId',
      element: <AssignOrder />
    },
    {
      path: 'order-analytics',
      element: <OrderAnalytics />
    },
    {
      path: 'orders/list/:filterType',
      element: <OrdersList />
    },
    {
      path: 'service/city/:vehicleType/:subType',
      element: <ServiceCityStatus />
    },
    {
      path: 'app-setting',
      element: <AppSetting />
    },
    {
      path: 'app-setting/:appType',
      element: <AppSettingDetail />
    },
    {
      path: 'app-setting/customer/vehicles',
      element: <VehicleManagement />
    },
    {
      path: 'ticket-rise',
      element: <TicketRise />
    },
    {
      path: 'ticket-overview',
      element: <TicketOverview />
    },
    {
      path: 'ticket-rise/customer',
      element: <CustomerTicketQueries />
    },
    {
      path: 'ticket-rise/partner',
      element: <PartnerTicketQueries />
    },
    {
      path: 'coupon-code',
      element: <CouponCode />
    },
    {
      path: 'live-tracking',
      element: <LiveTracking />
    }
    // {
    //   path: 'typography',
    //   element: <UtilsTypography />
    // },
    // {
    //   path: 'color',
    //   element: <UtilsColor />
    // },
    // {
    //   path: 'shadow',
    //   element: <UtilsShadow />
    // },
    // {
    //   path: '/sample-page',
    //   element: <SamplePage />
    // }
  ]
};

export default MainRoutes;
