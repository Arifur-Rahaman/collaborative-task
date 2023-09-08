import { FC, ReactNode} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useLocalStore from '../hooks/useLocalStore';
import { AUTH_DATA } from '../const';

interface IProps {
    children: ReactNode
}
const ProtectedRoute: FC<IProps> = ({children}) => {
    let location = useLocation();
    const [authData] = useLocalStore(AUTH_DATA, {})

    if (!authData?.email) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (authData?.email) {
        return children;
    }
};

export default ProtectedRoute;