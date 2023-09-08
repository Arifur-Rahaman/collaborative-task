import { Button, Card, Form, Input, Modal, Progress, Select, Table, DatePicker, Tag } from "antd";
import { AiOutlineClockCircle, AiOutlineUnorderedList, AiOutlinePieChart, AiOutlineLayout } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import useLocalStore from "../../hooks/useLocalStore";
import { AUTH_DATA, GROUPS, USERS } from "../../const";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Layout from "../../layouts/Layout";

const { TextArea } = Input

const GroupDetails = () => {
    const { id } = useParams()
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
    const [filterStatus, setFilterStatus] = useState('')
    const [sortPriority, setSortPriority] = useState('')
    const [dueDate, setDueDate] = useState<(Dayjs | null)>(null)

    //Retrieve data from local store
    const [groups, setGroups] = useLocalStore(GROUPS, [])
    const [users] = useLocalStore(USERS, [])

    const currentGroup = groups.find((group: any) => group.id === id)

    //Invite new members
    const inviteMember = (values: any) => {
        const newInvitedMembers = users.filter((user: any) => values.invitedMembers.includes(user.id))
        setGroups(groups.map((group: any) => group.id === currentGroup.id ? { ...group, invitedMembers: [...group.invitedMembers, ...newInvitedMembers] } : group))
        setIsInviteModalOpen(false)
    }

    //Create task
    const createTask = (values: any) => {
        values.dueDate = values.dueDate.format()
        values.status = 'pending'
        values.id = uuidv4()
        setGroups(groups.map((group: any) => group.id === currentGroup.id ? { ...group, tasks: [values, ...group.tasks] } : group))
        setIsCreateTaskModalOpen(false)
    }

    //Update task status
    const updateTaskStatus = (taskToBeUpdate: any) => {
        const currentStatus = taskToBeUpdate.status || 'pending'
        let updatedStatus = '';
        if (currentStatus === 'pending') {
            updatedStatus = 'in progress'
        }
        else if (currentStatus === 'in progress') {
            updatedStatus = 'completed'
        }
        else if (currentStatus === 'completed') {
            updatedStatus = 'pending'
        }

        setGroups(groups.map((group: any) => group.id === currentGroup.id ? { ...group, tasks: group.tasks.map((task: any) => task.id === taskToBeUpdate.id ? { ...task, status: updatedStatus } : task) } : group))
    }

    //Remove member from options those are already member of invited
    const getOptions = () => {
        const membersId = currentGroup.members.map((member: any) => member.id)
        const invitedMembersId = currentGroup.invitedMembers.map((im: any) => im.id)
        return users.filter((user: any) => !membersId.includes(user.id) && !invitedMembersId.includes(user.id))

    }

    //Filter and sort task
    function filterAndSortTasks() {
        // Filter tasks by status
        let filteredTasks = [...currentGroup.tasks];
        if (filterStatus) {
            filteredTasks = filteredTasks.filter((task: any) => task.status === filterStatus);
        }

        //Filter tasks by due date

        if (dueDate) {
            filteredTasks = filteredTasks.filter((task: any) => dayjs(task.dueDate).isSame(dueDate, 'date'));
        }
        //Sort by priority
        const priorityOrder: { [key: string]: number } = {
            high: 1,
            medium: 2,
            low: 3
        };

        if (sortPriority) {
            filteredTasks.sort((taskA: {priority:string}, taskB: {priority:string}) => {
                const priorityA = priorityOrder[taskA.priority];
                const priorityB = priorityOrder[taskB.priority];

                if (sortPriority === 'low to high') {
                    return priorityB - priorityA;
                } else if (sortPriority === 'high to low') {
                    return priorityA - priorityB;
                } else {
                    return 0;
                }
            });
        }


        return filteredTasks;
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
    const tasksColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'id',
            render: (text: string) => {
                return <p>{text}</p>
            },
        },
        {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'id',
            render: (text: string) => {
                const user = users?.find((user: any) => user.id === text)
                return <p>{user?.firstName} {user?.lastName}</p>
            },
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'id',
            render: (text: string) => {
                return <Tag className="capitalize">{text}</Tag>
            },
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'id',
            render: (text: string) => {
                return <p>{dayjs(text).format('DD-MM-YYYY')}</p>
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'id',
            render: (text: string) => {
                return <Tag className="capitalize">{text || 'Pending'}</Tag>
            },
        },
        {
            title: 'Update Status',
            dataIndex: 'status',
            key: 'id',
            render: (text: string, task: any) => {
                return <Button onClick={() => updateTaskStatus(task)}>Update</Button>
            },
        },
    ]

    return (
        <Layout>
            <div className="grid grid-cols-3 gap-4">
                <Card className="col-start-1 col-end-2" bodyStyle={{ padding: 0 }} bordered={false}>
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
                <Card className="col-start-2 col-end-4" bodyStyle={{ padding: 0 }} bordered={false}>
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
                                <Button onClick={() => setIsInviteModalOpen(true)}>Invite Member</Button>
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

                {/* Task Section */}
                <Card className="col-start-2 col-end-4" bodyStyle={{ padding: 0 }} bordered={false}>
                    <div className="mb-4">
                        <Card bodyStyle={{ padding: '8px 16px' }}>
                            <div className="flex justify-between">
                                <p className="text-lg">Tasks</p>
                                <Button onClick={() => setIsCreateTaskModalOpen(true)}>Add Task</Button>
                            </div>
                        </Card>
                        <div className="p-4">
                            <div className="grid grid-cols-3 mb-4 gap-4">
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Filter by Status"
                                    optionLabelProp="label"
                                    options={[{ label: 'Pending', value: 'pending' }, { label: 'In Progress', value: 'in progress' }, { label: 'Completed', value: 'completed' }]}
                                    onChange={(value: string) => { setFilterStatus(value) }}
                                />
                                <div>
                                    <DatePicker
                                        placeholder="Filter by due date"
                                        style={{ width: '100%' }}
                                        onChange={(value) => setDueDate(value)}
                                    />
                                </div>
                                <div>
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Sort by priority"
                                        optionLabelProp="label"
                                        options={[{ label: 'High to low', value: 'high to low' }, { label: 'Low to high', value: 'low to high' }]}
                                        onChange={(value) => setSortPriority(value)}
                                    />
                                </div>
                            
                            </div>
                            <Table
                                bordered={true}
                                dataSource={filterAndSortTasks()}
                                columns={tasksColumns}
                                showHeader={true}
                                pagination={false}
                                rowKey={'id'}

                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Invite Member Modal */}
            <Modal
                title="Invite Member"
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

            {/* Add new task Modal */}
            <Modal
                title="Create Task"
                footer={null}
                open={isCreateTaskModalOpen}
                destroyOnClose
                onCancel={() =>
                    setIsCreateTaskModalOpen(false)
                }
            >
                <Form onFinish={createTask} layout="vertical" scrollToFirstError={true} autoComplete="off">
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please input task title!",
                            },
                        ]}
                    >
                        <Input size="large" placeholder={"Task Title"} />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Please input task description!",
                            },
                        ]}
                    >
                        <TextArea rows={4} placeholder="Task Description" />
                    </Form.Item>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-start-1 col-end-7">
                            <Form.Item
                                label="Due Date"
                                name="dueDate"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select due date!",
                                    },
                                ]}
                            >
                                <DatePicker size="large" style={{ width: '100%' }} />
                            </Form.Item >
                        </div>
                        <div className="col-start-7 col-end-13">
                            <Form.Item
                                label="Priority"
                                name="priority"
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    size="large"
                                    placeholder="Select Priority"
                                    optionLabelProp="label"
                                    options={[{ label: 'High', value: 'high' }, { label: 'Medium', value: 'medium' }, { label: 'Low', value: 'low' }]}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item
                        label="Assign Member"
                        name="assignee"
                    >
                        <Select
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="Select Member"
                            optionLabelProp="label"
                            options={currentGroup.members.map((user: any) => ({ label: `${user.firstName} ${user.lastName}`, value: user.id }))}
                        />
                    </Form.Item>
                    <Form.Item className="col-span-full mb-0">
                        <Button block type="primary" htmlType="submit" className="bg-primary" size="large">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default GroupDetails;