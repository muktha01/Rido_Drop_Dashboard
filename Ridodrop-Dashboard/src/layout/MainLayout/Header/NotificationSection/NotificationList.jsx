// import PropTypes from 'prop-types';

// // material-ui
// import { alpha, useTheme } from '@mui/material/styles';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import Chip from '@mui/material/Chip';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemText from '@mui/material/ListItemText';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// // assets
// import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
// import User1 from 'assets/images/users/user-round.svg';

// function ListItemWrapper({ children }) {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         p: 2,
//         borderBottom: '1px solid',
//         borderColor: 'divider',
//         cursor: 'pointer',
//         '&:hover': {
//           bgcolor: alpha(theme.palette.grey[200], 0.3)
//         }
//       }}
//     >
//       {children}
//     </Box>
//   );
// }

// // ==============================|| NOTIFICATION LIST ITEM ||============================== //

// export default function NotificationList() {
//   const containerSX = { pl: 7 };

//   return (
//     <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
//       <ListItemWrapper>
     
       
//       </ListItemWrapper>
//       <ListItemWrapper>
//         <ListItem
//           alignItems="center"
//           disablePadding
//           secondaryAction={
//             <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
//               <Typography variant="caption">2 min ago</Typography>
//             </Stack>
//           }
//         >
//           <ListItemAvatar>
//             <Avatar
//               sx={{
//                 color: 'success.dark',
//                 bgcolor: 'success.light'
//               }}
//             >
//               <IconBuildingStore stroke={1.5} size="20px" />
//             </Avatar>
//           </ListItemAvatar>
//           <ListItemText primary={<Typography variant="subtitle1">Store Verification Done</Typography>} />
//         </ListItem>
//         <Stack spacing={2} sx={containerSX}>
//           <Typography variant="subtitle2">We have successfully received your request.</Typography>
//           <Chip label="Unread" color="error" size="small" sx={{ width: 'min-content' }} />
//         </Stack>
//       </ListItemWrapper>
//       <ListItemWrapper>
//         <ListItem
//           alignItems="center"
//           disablePadding
//           secondaryAction={
//             <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
//               <Typography variant="caption">2 min ago</Typography>
//             </Stack>
//           }
//         >
//           <ListItemAvatar>
//             <Avatar
//               sx={{
//                 color: 'primary.dark',
//                 bgcolor: 'primary.light'
//               }}
//             >
//               <IconMailbox stroke={1.5} size="20px" />
//             </Avatar>
//           </ListItemAvatar>
//           <ListItemText primary={<Typography variant="subtitle1">Check Your Mail.</Typography>} />
//         </ListItem>
     
//       </ListItemWrapper>
    
//     </List>
//   );
// }

// ListItemWrapper.propTypes = { children: PropTypes.node };
