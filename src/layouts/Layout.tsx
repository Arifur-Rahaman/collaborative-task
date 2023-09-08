import { Card } from "antd";
import { FC, ReactNode} from "react";
interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children}) => {
    return (
        <div>
            <Card className="mb-4">
                Header
            </Card>
            {children}
        </div>
    );
};

export default Layout;