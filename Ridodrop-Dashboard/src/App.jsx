import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';

// auth provider
import { AdminAuthProvider } from 'contexts/AdminAuthContext';

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <AdminAuthProvider>
        <NavigationScroll>
          <>
            <RouterProvider router={router} />
          </>
        </NavigationScroll>
      </AdminAuthProvider>
    </ThemeCustomization>
  );
}
