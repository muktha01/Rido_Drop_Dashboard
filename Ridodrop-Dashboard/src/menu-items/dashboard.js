// assets
import {
  IconDashboard,
  IconChartBar,
  IconUserCheck,
  IconTruck,
  IconCurrencyDollar,
  IconUsers,
  IconTools,
  IconSettings,
  IconLogout,
  IconMapPin
} from '@tabler/icons-react';

// constant
const icons = {
  IconDashboard,
  IconChartBar,
  IconUserCheck,
  IconTruck,
  IconCurrencyDollar,
  IconUsers,
  IconTools,
  IconSettings,
  IconLogout,
  IconMapPin
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',

  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'manage-driver',
      title: 'Manage Driver',
      type: 'item',
      url: '/dashboard/drivers',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'live-tracking',
      title: 'Live Tracking',
      type: 'item',
      url: '/dashboard/live-tracking',
      icon: icons.IconMapPin,
      breadcrumbs: false
    },
    {
      id: 'manage-vehicle',
      title: 'Manage Vehicle',
      type: 'item',
      url: '/dashboard/vehicles',
      icon: icons.IconTruck,
      breadcrumbs: false
    },
    {
      id: 'manage-rates',
      title: 'Manage Price',
      type: 'item',
      url: '/dashboard/rates',
      icon: icons.IconCurrencyDollar,
      breadcrumbs: false
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      type: 'item',
      url: '/dashboard/users',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'Customer',
      type: 'item',
      url: '/dashboard/customers',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'manage-order',
      title: 'Analyze Order',
      type: 'item',
      url: '/dashboard/manage-orders',
      icon: icons.IconTruck,
      breadcrumbs: false
    },
    // {
    //   id: 'manage-service',
    //   title: 'Manage Service',
    //   type: 'item',
    //   url: '/dashboard/services',
    //   icon: icons.IconTools,
    //   breadcrumbs: false
    // },
    {
      id: 'ticket-rise',
      title: 'Ticket Rise',
      type: 'item',
      url: '/dashboard/ticket-rise',
      icon: icons.IconTools,
      breadcrumbs: false
    },
    {
      id: 'coupon-code',
      title: 'Coupon Code',
      type: 'item',
      url: '/dashboard/coupon-code',
      icon: icons.IconCurrencyDollar,
      breadcrumbs: false
    },
    {
      id: 'App-settings',
      title: 'App Settings',
      type: 'item',
      url: '/dashboard/app-setting',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
