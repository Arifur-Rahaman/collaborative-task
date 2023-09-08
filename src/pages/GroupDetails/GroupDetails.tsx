import { Button, Card, Form, Input, Modal, Progress, Select, Table } from "antd";
import { AiOutlineClockCircle, AiOutlineUnorderedList, AiOutlinePieChart, AiOutlineLayout } from "react-icons/ai";
import { useParams } from "react-router-dom";
import useLocalStore from "../../hooks/useLocalStore";
import { GROUPS, USERS } from "../../const";
import { useState } from "react";

const GroupDetails = () => {
    const { id } = useParams()
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

    //Retrieve data from local store
    const [groups, setGroups] = useLocalStore(GROUPS, [])
    const [users, setUsers] = useLocalStore(USERS, [])

    const currentGroup = groups.find((group: any) => group.id === id)

    //Invite new members
    const inviteMember = (values: any)=>{
        const newInvitedMembers = users.filter((user: any) => values.invitedMembers.includes(user.id))
        setGroups(groups.map((group:any)=>group.id ===currentGroup.id ? {...group, invitedMembers:[...group.invitedMembers, ...newInvitedMembers]} :group))
        setIsInviteModalOpen(false)
    }

    //Remove member from options those are already member of invited
    const getOptions = ()=>{
        const membersId = currentGroup.members.map((member:any)=>member.id)
        const invitedMembersId = currentGroup.invitedMembers.map((im:any)=>im.id)
        return users.filter((user:any)=> !membersId.includes(user.id) && !invitedMembersId.includes(user.id))
        
    }

    const groupAnalytics = [
        {
            title: 'Total Member',
            value: 'Sample category',
            icon: <AiOutlineClockCircle color={'#FA8B0C'} size={25} />,
            background_color: '#FEF3E6',
        },
        {
            title: 'Total Task',
            value: currentGroup.tasks.length,
            icon: <AiOutlineUnorderedList color={'#5F63F2'} size={25} />,
            background_color: '#EFEFFE',
        },
        {
            title: 'Task Completed',
            value: 10,
            icon: <AiOutlinePieChart color={'#FF69A5'} size={25} />,
            background_color: '#FFF0F6',
        },
        {
            title: 'Total Pending',
            // value: project.total_spending,
            value: 10,
            icon: <AiOutlineLayout color={'#20C997'} size={25} />,
            background_color: '#E8F9F4',
        },
    ];

    const membersColumns = [
        {
            title: 'Member Name',
            dataIndex: 'first_name',
            key: 'id',
            render: (text: string, record: any) => {
                const { firstName, lastName } = record
                return <p>{firstName} {lastName}</p>
            },
        },
        {
            title: 'Member Name',
            dataIndex: 'email',
            key: 'id',
            render: (text: string) => {
                return <p>{text}</p>
            },
        },
    ]

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <Card className="col-start-1 col-end-2" bodyStyle={{ padding: 0 }}>
                    <Card className="bg-primary">
                        <p className="text-white">Progress</p>
                        <Progress
                            strokeColor='white'
                            percent={80}
                            trailColor='#4DD4AC'
                            strokeWidth={6}
                            className='project_desc_progress_text'
                        />
                    </Card>
                    <div className="p-4 flex flex-col gap-4 justify-center">
                        {groupAnalytics.map(data => (
                            <div key={data.title} className="flex items-center">
                                <div className="mr-4 p-3 rounded" style={{ background: data.background_color }}>{data.icon}</div>
                                <p className="text-grey-dark-2">{data.title}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="col-start-2 col-end-4" bodyStyle={{ padding: 0 }}>
                    <Card bodyStyle={{ padding: "12px 16px" }}>
                        <p className="text-grey-dark-1 text-base">About Group</p>
                    </Card>
                    <div className="p-4">
                        <p className="text-grey-dark-2">{currentGroup.about}</p>
                    </div>
                </Card>

                {/* Second Row */}
                <Card className="col-start-1 col-end-1" bodyStyle={{ padding: 0 }} bordered={false}>
                    <div className="mb-4">
                        <Card bodyStyle={{ padding: '8px 16px' }}>
                            <div className="flex justify-between">
                                <p className="text-lg">Members</p>
                                <Button onClick={()=>setIsInviteModalOpen(true)}>Invite Member</Button>
                            </div>
                        </Card>
                        <div className="p-4">
                            <Table
                                bordered={true}
                                dataSource={currentGroup?.members}
                                columns={membersColumns}
                                showHeader={false}
                                pagination={false}
                                rowKey={'id'}

                            />
                        </div>
                    </div>

                    <div>
                        <Card bodyStyle={{ padding: '8px 16px' }}>
                            <div className="flex justify-between">
                                <p className="text-lg">Invited Members</p>
                            </div>
                        </Card>
                        <div className="p-4">
                            <Table
                                bordered={true}
                                dataSource={currentGroup?.invitedMembers}
                                columns={membersColumns}
                                showHeader={false}
                                pagination={false}
                                rowKey={'id'}

                            />
                        </div>
                    </div>
                </Card>
                <Card className="col-start-2 col-end-4" bodyStyle={{ padding: 0 }}>

                </Card>
            </div>
            <Modal
                title="Create Group"
                footer={null}
                open={isInviteModalOpen}
                destroyOnClose
                onCancel={() =>
                    setIsInviteModalOpen(false)
                }
            >
                <Form onFinish={inviteMember} layout="vertical" scrollToFirstError={true} autoComplete="off">
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
                            options={getOptions().map((user: any) => ({ label: `${user.firstName} ${user.lastName}`, value: user.id }))
                        }
                        />
                    </Form.Item>
                    <Form.Item className="col-span-full mb-0">
                        <Button block type="primary" htmlType="submit" className="bg-primary" size="large">
                            Invite
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GroupDetails;