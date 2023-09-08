import { Card, Input, Form, Button, message } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import {USERS} from '../../const'
import useLocalStore from '../../hooks/useLocalStore';

interface IUser {
    firstName: string
    lastName: string
    password: string
    email: string
    confirmPassword?: string
}

const SignUp = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useLocalStore(USERS, [])

    //Handle sign up
    const handleSignUp = (value: IUser) => {
        const isAlreadySignedUp = users.find((user:IUser)=>user.email === value.email)
        if(isAlreadySignedUp){
            message.error("Already signed up!");
            return
        }
        const updated = {...value, id: uuidv4(), groups: []}
        delete updated.confirmPassword;
        setUsers([...users, updated])
        message.success("Signed up successfully!");
        navigate('/login')

    }

    return (
        <div className='flex justify-center items-center w-full h-screen'>
            <Card style={{ width: 400 }}>
                <Form onFinish={handleSignUp} layout="vertical" scrollToFirstError={true} autoComplete="off">
                    <div className="grid grid-cols-1 gap-4">
                        <p className='text-center text-2xl mb-4'>Sign Up</p>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input first name!",
                                },
                            ]}
                        >
                            <Input size="large" placeholder={"First Name"} />
                        </Form.Item>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input last name!",
                                },
                            ]}
                        >
                            <Input size="large" placeholder={"Last Name"} />
                        </Form.Item>
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
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Password do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input size="large" type='password' placeholder={"Confirm Password"} />
                        </Form.Item>
                        <Form.Item className="col-span-full mb-0">
                            <Button block type="primary" htmlType="submit" className="bg-primary" size="large">
                                Sign Up
                            </Button>
                        </Form.Item>
                        <div className='col-span-full mt-2'>
                            <p>Already have an account? <Link className='text-primary hover:text-primary' to={'/login'}>Sign in</Link></p>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;