import React, {useEffect, useState} from 'react';
import {Button, Divider, message, Modal, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {TitleVo} from './data.d';
import CreateTitleForm from "./components/add_title";
import UpdateTitleForm from "./components/update_title";
import {addTitle, handleResp, removeTitle, titleList, updateTitle} from "./service";
import AdvancedSearchForm from "./components/search_title";

const Title: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isShowAddModal, setShowAddModal] = useState<boolean>(false);
    const [isShowEditModal, setShowEditModal] = useState<boolean>(false);
    const [titleListData, setTitleListData] = useState<TitleVo[]>([]);
    const [currentTitle, setCurrentTitle] = useState<TitleVo>({
        content: "", create_time: "", id: 0, interview_type: "", title: "", update_time: ""

    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(10);

    const columns: ColumnsType<TitleVo> = [
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title: '答案',
            dataIndex: 'content',
        },
        {
            title: '类型',
            dataIndex: 'interview_type',
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

    const handleAddOk = async (title: TitleVo) => {
        if (handleResp(await addTitle(title))) {
            setShowAddModal(false);
            let res = await titleList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);
        }
    }

    const handleAddCancel = () => {
        setShowAddModal(false);
    };


    const showEditModal = (title: TitleVo) => {
        setCurrentTitle(title)
        setShowEditModal(true);
    };

    const handleEditOk = async (title: TitleVo) => {
        if (handleResp(await updateTitle(title))) {
            setShowEditModal(false);
            let res = await titleList({
                current: currentPage, pageSize
            })
            setTotal(res.total)
            res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
    };


    //删除单条数据
    const showDeleteConfirm = (title: TitleVo) => {
        Modal.confirm({
            content: `确定删除${title.title}吗?`,
            async onOk() {
                await handleRemove([title.id]);
            },
            onCancel() {
                console.log('Cancel');
            }
        })
    };

    //批量删除
    const handleRemove = async (ids: number[]) => {
        if (handleResp(await removeTitle(ids))) {
            let res = await titleList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);
        }

    };

    const handleSearchOk = async (title: TitleVo) => {
        let res = await titleList({current: currentPage, pageSize, ...title,})
        setTotal(res.total)
        res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);
    };

    const handleResetOk = async () => {
        let res = await titleList({current: currentPage, pageSize})
        setTotal(res.total)
        res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);
    };

    useEffect(() => {
        titleList({
            current: currentPage, pageSize
        }).then(res => {
            setTotal(res.total)
            res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);
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
            let res = await titleList({current: page, pageSize})
            setTotal(res.total)
            res.code === 0 ? setTitleListData(res.data) : message.error(res.msg);

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
                dataSource={titleListData}
                rowKey={'id'}
                pagination={paginationProps}
                // tableLayout={"fixed"}
            />

            <CreateTitleForm onCancel={handleAddCancel} onCreate={handleAddOk} open={isShowAddModal}></CreateTitleForm>
            <UpdateTitleForm onCancel={handleEditCancel} onCreate={handleEditOk} open={isShowEditModal} titleVo={currentTitle}></UpdateTitleForm>

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

export default Title;