import { Card, Input, Form, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import useLocalStore from '../../hooks/useLocalStore';
import { USERS, AUTH_DATA } from '../../const';

interface IValue {
    password: string
    email: string
}
const LogIn = () => {
    const [users] = useLocalStore(USERS, [])
    const [_, setAuthData] = useLocalStore(AUTH_DATA, {})
    const navigate = useNavigate()

    const handleSignIn = (values: IValue)=>{
        const isUserExist = users.find((user: IValue)=>user.email === values.email)
        if(isUserExist && isUserExist.password === values.password){
            const authenticatedUser = {...isUserExist}
            delete authenticatedUser.password
            setAuthData(authenticatedUser)
            message.success("Logged in successfully!")
            navigate('/')
        }
        else{
            message.error("Invalid credentials!");
            
        }
    }

    return (
        <div className='flex justify-center items-center w-full h-screen'>
            <Card style={{ width: 400 }}>
                <Form onFinish={handleSignIn} layout="vertical" scrollToFirstError={true} autoComplete="off">
                    <div className="grid grid-cols-1 gap-4">
                        <p className='text-center text-2xl mb-4'>Sign In</p>
                        <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Please input valid email!",
                                },
                            ]}
                        >
                            <Input size="large" placeholder={"Email Address"} />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input valid password!",
                                },
                                {
                                    min: 6, message: 'Password must be minimum 6 characters!'
                                },
                            ]}
                        >
                            <Input size="large" type='password' placeholder={"Password"} />
                        </Form.Item>
                        <Form.Item className="col-span-full mb-0">
                            <Button block type="primary" htmlType="submit" className="bg-primary" size="large">
                                Sign In
                            </Button>
                        </Form.Item>
                        <div className='col-span-full mt-2'>
                            <p>Don't have an account? <Link className='text-primary hover:text-primary' to={'/signup'}>Sign up</Link></p>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LogIn;