import { Button, Card, message } from "antd";
import { FC, ReactNode} from "react";
import useLocalStore from "../hooks/useLocalStore";
import { AUTH_DATA } from "../const";
import { useNavigate } from "react-router-dom";
interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children}) => {
    const navigate = useNavigate()
    const [authData, setAuthData] = useLocalStore(AUTH_DATA, {})
    const handleLogout = ()=>{
        setAuthData({})
        message.success('Logged out successfully!')
        navigate('/login')
    }
    return (
        <div>
            <Card className="mb-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg">{authData?.firstName} {authData.lastName}</p>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </Card>
            {children}
        </div>
    );
};

export default Layout;