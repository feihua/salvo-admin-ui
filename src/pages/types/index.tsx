import React, {useEffect, useState} from 'react';
import {Button, Divider, message, Modal, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {TypesVo} from './data.d';
import CreateTypesForm from "./components/add_types";
import UpdateTypesForm from "./components/update_types";
import {addTypes, handleResp, removeTypes, typesList, updateTypes} from "./service";
import AdvancedSearchForm from "./components/search_types";

const Types: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isShowAddModal, setShowAddModal] = useState<boolean>(false);
    const [isShowEditModal, setShowEditModal] = useState<boolean>(false);
    const [typesListData, setTypesListData] = useState<TypesVo[]>([]);
    const [currentTypes, setCurrentTypes] = useState<TypesVo>({
        create_time: "", id: 0, interview_code: "", update_time: ""

    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(10);

    const columns: ColumnsType<TypesVo> = [
        {
            title: '题目类型',
            dataIndex: 'interview_code',
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

    const handleAddOk = async (types: TypesVo) => {
        if (handleResp(await addTypes(types))) {
            setShowAddModal(false);
            let res = await typesList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);
        }
    }

    const handleAddCancel = () => {
        setShowAddModal(false);
    };


    const showEditModal = (types: TypesVo) => {
        setCurrentTypes(types)
        setShowEditModal(true);
    };

    const handleEditOk = async (types: TypesVo) => {
        if (handleResp(await updateTypes(types))) {
            setShowEditModal(false);
            let res = await typesList({
                current: currentPage, pageSize
            })
            setTotal(res.total)
            res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
    };


    //删除单条数据
    const showDeleteConfirm = (types: TypesVo) => {
        Modal.confirm({
            content: `确定删除${types.interview_code}吗?`,
            async onOk() {
                await handleRemove([types.id]);
            },
            onCancel() {
                console.log('Cancel');
            }
        })
    };

    //批量删除
    const handleRemove = async (ids: number[]) => {
        if (handleResp(await removeTypes(ids))) {
            let res = await typesList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);
        }

    };

    const handleSearchOk = async (types: TypesVo) => {
        let res = await typesList({current: currentPage, pageSize, ...types,})
        setTotal(res.total)
        res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);
    };

    const handleResetOk = async () => {
        let res = await typesList({current: currentPage, pageSize})
        setTotal(res.total)
        res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);
    };

    useEffect(() => {
        typesList({
            current: currentPage, pageSize
        }).then(res => {
            setTotal(res.total)
            res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);
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
            let res = await typesList({current: page, pageSize})
            setTotal(res.total)
            res.code === 0 ? setTypesListData(res.data) : message.error(res.msg);

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
                dataSource={typesListData}
                rowKey={'id'}
                pagination={paginationProps}
                // tableLayout={"fixed"}
            />

            <CreateTypesForm onCancel={handleAddCancel} onCreate={handleAddOk} open={isShowAddModal}></CreateTypesForm>
            <UpdateTypesForm onCancel={handleEditCancel} onCreate={handleEditOk} open={isShowEditModal} typesVo={currentTypes}></UpdateTypesForm>

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

export default Types;