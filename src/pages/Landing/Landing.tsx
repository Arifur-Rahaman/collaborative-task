import { Avatar, Button, Card, Divider, Form, Input, Modal, Progress, Select } from "antd";
import { BsArrowRight } from "react-icons/bs";
import { colors } from "../../theme/colors";
import { useState } from "react";
import useLocalStore from "../../hooks/useLocalStore";
import { v4 as uuidv4 } from 'uuid';
import { AUTH_DATA, GROUPS, USERS } from "../../const";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input

interface IGroup {
    id: string
    name: string
    about: string
    tasks: {}[]
    members: { firstName: string; lastName: string; id: string }[]
    invitedMembers: {}[]
}

interface IUser {
    id: string,
    groups: {}[]
}

const Landing = () => {
    const navigate = useNavigate()
    const [isGroupCreateModalOpen, setIsGroupCreateModalOpen] = useState(false)

    //Retrieve data from local store
    const [users, setUsers] = useLocalStore(USERS, [])
    const [authData] = useLocalStore(AUTH_DATA, {})
    const [groups, setGroups] = useLocalStore(GROUPS, [])

    const currentUser = users.find((user: IUser) => user.id === authData.id)
    const connectedGroups = groups.filter((group: IGroup) => currentUser.groups.includes(group.id))

    //Create new group
    const createGroup = (values: IGroup) => {
        const newGroupId = uuidv4()
        const newGroup = {
            id: newGroupId,
            name: values.name,
            about: values.about,
            tasks: [],
            members: users.filter((user: any) => user.id === authData.id),
            invitedMembers: users.filter((user: IUser) => values.invitedMembers.includes(user.id))
        }
        setGroups([...groups, newGroup])
        setUsers(users.map((user: IUser) => user.id === authData.id ? { ...user, groups: [...user.groups, newGroupId] } : user))
        setIsGroupCreateModalOpen(false)
    }

    const acceptInvitation = (groupId: string)=>{
        setGroups(groups.map((group:any)=>group.id ===groupId? {...group, members: [...group.members, currentUser] ,invitedMembers: group.invitedMembers.filter((member:any)=>member.id !==authData.id)} :group))
        setUsers(users.map((user:any)=>user.id ===currentUser.id? {...user, groups:[...user.groups, groupId]}: user))
    }

    const navigateGroupDetail = (id: string) => {
        navigate(`/group/${id}`)
    }

    return (
        <div>
            <div className="grid grid-cols-12 gap-4">
                <Card className="col-start-1 col-end-10">
                    <Card bordered={false} className="mb-4" bodyStyle={{ padding: '8px 16px' }}>
                        <div className="flex justify-between">
                            <h6 className="text-xl font-medium">Groups</h6>
                            <Button
                                type="primary"
                                className="bg-primary text-white"
                                onClick={() => setIsGroupCreateModalOpen(true)}
                            >
                                Create New Group
                            </Button>
                        </div>
                    </Card>
                    {
                        connectedGroups.length === 0 ? (<div className="flex justify-center h- items-center">
                            <p className="text-red-500 mt-5">No groups found!</p>
                        </div>) : (
                            <div className="grid grid-cols-4 gap-4">
                                {
                                    connectedGroups.map((group: IGroup) => (
                                        <Card key={group.id} bordered={false}>
                                            <div className="flex justify-between items-center">
                                                <p
                                                    className="capitalize text-base font-medium mb-4 cursor-pointer hover:text-primary"
                                                    onClick={() => navigateGroupDetail(group.id)}
                                                >
                                                    {group.name}
                                                </p>
                                                <p><BsArrowRight
                                                    onClick={() => navigateGroupDetail(group.id)} size={18}
                                                    className={'text-primary cursor-pointer'} />
                                                </p>
                                            </div>
                                            <span className="text-grey-dark-2 block text-sm mb-1">Created At</span>
                                            <p className="text-grey-dark-1 text-sm mb-4">21 Aug, 2023</p>
                                            <Progress
                                                percent={80}
                                                strokeColor={colors.primary}
                                                strokeWidth={6}
                                                status="active"
                                            />
                                            <p className="text-grey-dark-2 text-sm">10/{group.tasks.length} Task Completed</p>
                                            <Divider />
                                            <p className="text-grey-dark-2 text-sm">Group Members</p>
                                            <Avatar.Group>
                                                {group.members.map((member) => {
                                                    return (

                                                        <Avatar
                                                            src={''}
                                                            key={member.id}
                                                            size={"small"}
                                                            gap={4}
                                                            style={{
                                                                backgroundColor: '#f56a00',
                                                                verticalAlign: 'middle',
                                                            }}
                                                        >

                                                            {`${member?.firstName} ${member?.lastName}`?.split(' ')?.map(element => element?.charAt(0))}

                                                        </Avatar>
                                                    )
                                                })}
                                            </Avatar.Group>
                                        </Card>
                                    ))
                                }
                            </div>
                        )
                    }
                </Card>
                <Card className="col-start-10 col-end-13">
                    <Card bordered={false} bodyStyle={{ padding: '8px 16px' }} className="mb-4">
                        <h6 className="text-xl font-medium">Invitations</h6>
                    </Card>
                    <div>
                        {
                            groups.filter((group: any) => group.invitedMembers.some((member: any) => member.id === authData.id)).map((group: any) => (
                                <Card className="mb-2">
                                    <div className="flex justify-between">
                                        <p>{group.name}</p>
                                        <Button
                                            type="primary"
                                            size="small"
                                            className="bg-primary"
                                            onClick={()=>acceptInvitation(group.id)}
                                        >
                                            Accept
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                </Card>
            </div>

            {/* **Modal to create new group** */}
            <Modal
                title="Create Group"
                footer={null}
                open={isGroupCreateModalOpen}
                destroyOnClose
                onCancel={() =>
                    setIsGroupCreateModalOpen(false)
                }
            >
                <Form onFinish={createGroup} layout="vertical" scrollToFirstError={true} autoComplete="off">
                    <Form.Item
                        label="Group Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input group name!",
                            },
                        ]}
                    >
                        <Input size="large" placeholder={"Group Name"} />
                    </Form.Item>
                    <Form.Item
                        label="About Group"
                        name="about"
                        rules={[
                            {
                                required: true,
                                message: "Please input about group!",
                            },
                        ]}
                    >
                        <TextArea rows={4} placeholder="About Group" />
                    </Form.Item>
                    <Form.Item
                        label="Invite Member"
                        name="invitedMembers"
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="Select Members"
                            optionLabelProp="label"
                            options={users.filter((user: any) => user.id !== authData.id).map((user: any) => ({ label: `${user.firstName} ${user.lastName}`, value: user.id }))}
                        />
                    </Form.Item>
                    <Form.Item className="col-span-full mb-0">
                        <Button block type="primary" htmlType="submit" className="bg-primary" size="large">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Landing;