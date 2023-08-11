import React, {useEffect, useState} from 'react';
import {Button, Divider, message, Modal, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {MemberVo} from './data.d';
import CreateMemberForm from "./components/add_member";
import UpdateMemberForm from "./components/update_member";
import {addMember, handleResp, memberList, removeMember, updateMember} from "./service";
import AdvancedSearchForm from "./components/search_member";

const Member: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isShowAddModal, setShowAddModal] = useState<boolean>(false);
    const [isShowEditModal, setShowEditModal] = useState<boolean>(false);
    const [memberListData, setMemberListData] = useState<MemberVo[]>([]);
    const [currentMember, setCurrentMember] = useState<MemberVo>({
        create_time: "", id: 0, level: "", name: "", password: "", phone: "", update_time: ""

    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(10);

    const columns: ColumnsType<MemberVo> = [
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '会员姓名',
            dataIndex: 'name',
        },
        {
            title: '会员等级',
            dataIndex: 'level',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<EditOutlined/>} onClick={() => showEditModal(record)}>编辑</Button>
                    <Button type="primary" danger icon={<DeleteOutlined/>}
                            onClick={() => showDeleteConfirm(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setShowAddModal(true);
    };

    const handleAddOk = async (member: MemberVo) => {
        if (handleResp(await addMember(member))) {
            setShowAddModal(false);
            let res = await memberList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);
        }
    }

    const handleAddCancel = () => {
        setShowAddModal(false);
    };


    const showEditModal = (member: MemberVo) => {
        setCurrentMember(member)
        setShowEditModal(true);
    };

    const handleEditOk = async (member: MemberVo) => {
        if (handleResp(await updateMember(member))) {
            setShowEditModal(false);
            let res = await memberList({
                current: currentPage, pageSize
            })
            setTotal(res.total)
            res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
    };


    //删除单条数据
    const showDeleteConfirm = (member: MemberVo) => {
        Modal.confirm({
            content: `确定删除${member.name}吗?`,
            async onOk() {
                await handleRemove([member.id]);
            },
            onCancel() {
                console.log('Cancel');
            }
        })
    };

    //批量删除
    const handleRemove = async (ids: number[]) => {
        if (handleResp(await removeMember(ids))) {
            let res = await memberList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);
        }

    };

    const handleSearchOk = async (member: MemberVo) => {
        let res = await memberList({current: currentPage, pageSize, ...member,})
        setTotal(res.total)
        res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);
    };

    const handleResetOk = async () => {
        let res = await memberList({current: currentPage, pageSize})
        setTotal(res.total)
        res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);
    };

    useEffect(() => {
        memberList({
            current: currentPage, pageSize
        }).then(res => {
            setTotal(res.total)
            res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);
        });
    }, []);


    const paginationProps = {
        defaultCurrent: 1,
        defaultPageSize: 10,
        current: currentPage, //当前页码
        pageSize, // 每页数据条数
        pageSizeOptions: [10, 20, 30, 40, 50],
        showQuickJumper: true,
        showTotal: (total: number) => (
            <span>总共{total}条</span>
        ),
        total,
        onChange: async (page: number, pageSize: number) => {
            console.log('onChange', page, pageSize)
            setCurrentPage(page)
            setPageSize(pageSize)
            let res = await memberList({current: page, pageSize})
            setTotal(res.total)
            res.code === 0 ? setMemberListData(res.data) : message.error(res.msg);

        }, //改变页码的函数
        onShowSizeChange: (current: number, size: number) => {
            console.log('onShowSizeChange', current, size)
        }
    }

    return (
        <div style={{padding: 24}}>
            <div>
                <Space size={100}>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>新建</Button>
                    <AdvancedSearchForm search={handleSearchOk} reSet={handleResetOk}></AdvancedSearchForm>
                </Space>
            </div>

            <Divider/>

            <Table
                rowSelection={{
                    onChange: (selectedRowKeys: React.Key[]) => {
                        setSelectedRowKeys(selectedRowKeys)
                    },
                }}
                size={"middle"}
                columns={columns}
                dataSource={memberListData}
                rowKey={'id'}
                pagination={paginationProps}
                // tableLayout={"fixed"}
            />

            <CreateMemberForm onCancel={handleAddCancel} onCreate={handleAddOk} open={isShowAddModal}></CreateMemberForm>
            <UpdateMemberForm onCancel={handleEditCancel} onCreate={handleEditOk} open={isShowEditModal} memberVo={currentMember}></UpdateMemberForm>

            {selectedRowKeys.length > 0 &&
                <div>
                    已选择 {selectedRowKeys.length} 项
                    <Button style={{float: "right"}} danger icon={<DeleteOutlined/>} type={'primary'}
                            onClick={async () => {
                                await handleRemove(selectedRowKeys as number[]);
                                setSelectedRowKeys([]);
                            }}
                    >
                        批量删除
                    </Button>
                </div>
            }

        </div>
    );
};

export default Member;