import { Outlet, Navigate } from 'umi'
import { useAuth } from '@/utils/hooks';

const authWrappers = () => {
   const isLogin = useAuth();
   if (isLogin) {
      return <Outlet />
   }
   return <Navigate to="/login" />;
}
export default authWrappers