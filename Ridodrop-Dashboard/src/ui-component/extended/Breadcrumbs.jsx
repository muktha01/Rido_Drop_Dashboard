import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';

// assets
import { IconChevronRight } from '@tabler/icons-react';

// ==============================|| BREADCRUMBS ||============================== //

const BreadcrumbsComponent = ({ navigation, title, ...others }) => {
  const theme = useTheme();
  const location = useLocation();

  const iconStyle = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main
  };

  const linkSX = {
    display: 'flex',
    color: theme.palette.grey[500],
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center',
    '&:hover': {
      color: theme.palette.grey[700]
    }
  };

  const itemSX = {
    display: 'flex',
    alignItems: 'center'
  };

  const separatorSX = {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.grey[500]
  };

  let main;
  let item;

  // collapse item
  const collapseItem = navigation?.filter((menu) => {
    if (menu.children) {
      menu.children.filter((submenu) => {
        if (submenu.children) {
          submenu.children.filter((subsubmenu) => {
            if (subsubmenu.url === location.pathname) {
              main = subsubmenu;
              item = subsubmenu;
            }
            return item;
          });
        }
        if (submenu.url === location.pathname) {
          item = submenu;
        }
        if (submenu.children) {
          submenu.children.filter((subsubmenu) => {
            if (subsubmenu.url === location.pathname) {
              main = subsubmenu;
            }
            return main;
          });
        }
        return item;
      });
    }
    if (menu.url === location.pathname) {
      item = menu;
    }
    if (menu.children) {
      menu.children.filter((submenu) => {
        if (submenu.url === location.pathname) {
          item = submenu;
        }
        if (submenu.children) {
          submenu.children.filter((subsubmenu) => {
            if (subsubmenu.url === location.pathname) {
              main = subsubmenu;
            }
            return main;
          });
        }
        return item;
      });
    }
    return item;
  });

  // main breadcrumbs
  const mainBreadcrumbs = item && (
    <Typography component={MuiLink} href="#" variant="body2" sx={linkSX}>
      {item.breadcrumbs !== false && (
        <>
          {item.icon && <item.icon style={iconStyle} />}
          {item.title}
        </>
      )}
    </Typography>
  );

  // item breadcrumbs
  const itemBreadcrumbs = main && (
    <Typography component={MuiLink} href="#" variant="body2" sx={linkSX}>
      {main.breadcrumbs !== false && (
        <>
          {main.title}
        </>
      )}
    </Typography>
  );

  // breadcrumbs
  const breadcrumbs = main ? [mainBreadcrumbs, itemBreadcrumbs] : [mainBreadcrumbs];

  return (
    <Breadcrumbs
      separator={<IconChevronRight size={16} />}
      {...others}
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-separator': separatorSX
      }}
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent; 