// // assets
// import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';
// import { GiSteeringWheel } from 'react-icons/gi';
// import { LuHandHelping } from 'react-icons/lu';
// import { BsDatabaseCheck } from 'react-icons/bs';
// import { FaHireAHelper } from 'react-icons/fa6';
// import { BsPersonVcard } from 'react-icons/bs';
// import { GiTowTruck } from 'react-icons/gi';

// // constant
// const icons = {
//   IconTypography,
//   IconPalette,
//   IconShadow,
//   IconWindmill,
//   GiSteeringWheel,
//   LuHandHelping,
//   BsDatabaseCheck,
//   FaHireAHelper,
//   BsPersonVcard,
//   GiTowTruck
// };

// // ==============================|| UTILITIES MENU ITEMS ||============================== //

// const utilities = {
//   id: 'utilities',
//   title: 'Utilities',
//   type: 'group',
//   children: [
//     {
//       id: 'util-typography',
//       title: 'AllDrivers',
//       type: 'item',
//       url: '/AllDrivers',
//       icon: icons.GiSteeringWheel,
//       breadcrumbs: false
//     },
//     {
//       id: 'util-typography',
//       title: 'Requests',
//       type: 'item',
//       url: '/DriverRequest',
//       icon: icons.FaHireAHelper,
//       breadcrumbs: false
//     },
//     {
//       id: 'util-color',
//       title: 'Add Admin',
//       type: 'item',
//       url: '/add/admin',
//       icon: icons.BsDatabaseCheck,
//       breadcrumbs: false
//     },
//     {
//       id: 'util-color',
//       title: 'All Admins',
//       type: 'item',
//       url: '/all/admin',
//       icon: icons.BsPersonVcard,
//       breadcrumbs: false
//     },
//     {
//       id: 'util-color',
//       title: 'Driver Safety Caution',
//       type: 'item',
//       url: '/driver/safety',
//       icon: icons.GiTowTruck,
//       breadcrumbs: false
//     }
//     // {
//     //   id: 'util-shadow',
//     //   title: 'Shadow',
//     //   type: 'item',
//     //   url: '/shadow',
//     //   icon: icons.IconShadow,
//     //   breadcrumbs: false
//     // }
//   ]
// };

// export default utilities;


// assets 
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';
import { GiSteeringWheel } from 'react-icons/gi';
import { LuHandHelping } from 'react-icons/lu';
import { BsDatabaseCheck } from 'react-icons/bs';
import { FaHireAHelper } from 'react-icons/fa6';
import { BsPersonVcard } from 'react-icons/bs';
import { GiTowTruck } from 'react-icons/gi';
import { FaChartLine, FaUserCog, FaCar, FaMoneyCheckAlt, FaUsers, FaCogs, FaGlobe, FaSignOutAlt } from 'react-icons/fa';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  GiSteeringWheel,
  LuHandHelping,
  BsDatabaseCheck,
  FaHireAHelper,
  BsPersonVcard,
  GiTowTruck,
  FaChartLine,
  FaUserCog,
  FaCar,
  FaMoneyCheckAlt,
  FaUsers,
  FaCogs,
  FaGlobe,
  FaSignOutAlt
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',

  type: 'group',
  children: [
    {
      id: 'site-analytics',
      title: 'Site Analytics',
      type: 'item',
      url: '/site-analytics',
      icon: icons.FaChartLine,
      breadcrumbs: false
    },
    {
      id: 'manage-driver',
      title: 'Manage Driver',
      type: 'item',
      url: '/manage-driver',
      icon: icons.FaUserCog,
      breadcrumbs: false
    },
    {
      id: 'manage-vehicle',
      title: 'Manage Vehicle',
      type: 'item',
      url: '/manage-vehicle',
      icon: icons.FaCar,
      breadcrumbs: false
    },
    {
      id: 'manage-rates',
      title: 'Manage Rates',
      type: 'item',
      url: '/manage-rates',
      icon: icons.FaMoneyCheckAlt,
      breadcrumbs: false
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      type: 'item',
      url: '/manage-users',
      icon: icons.FaUsers,
      breadcrumbs: false
    },
    {
      id: 'manage-services',
      title: 'Manage Services',
      type: 'item',
      url: '/manage-services',
      icon: icons.FaCogs,
      breadcrumbs: false
    },
    {
      id: 'website-settings',
      title: 'Website Settings',
      type: 'item',
      url: '/website-settings',
      icon: icons.FaGlobe,
      breadcrumbs: false
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.FaSignOutAlt,
      breadcrumbs: false
    },
   
  
   
   
   
  ]
};

export default utilities;
