import React, {useEffect, useState} from 'react';
import {Button, Divider, message, Modal, Space, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {BannerVo} from './data.d';
import CreateBannerForm from "./components/add_banner";
import UpdateBannerForm from "./components/update_banner";
import {addBanner, bannerList, handleResp, removeBanner, updateBanner} from "./service";
import AdvancedSearchForm from "./components/search_banner";

const Banner: React.FC = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isShowAddModal, setShowAddModal] = useState<boolean>(false);
    const [isShowEditModal, setShowEditModal] = useState<boolean>(false);
    const [bannerListData, setBannerListData] = useState<BannerVo[]>([]);
    const [currentBanner, setCurrentBanner] = useState<BannerVo>({
        banner_sort: 0, banner_status: 0, create_time: "", id: 0, image_url: "", remark: "", title: "", update_time: "", webview_url: ""
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(10);

    const columns: ColumnsType<BannerVo> = [
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title: '图片url',
            dataIndex: 'image_url',
        },
        {
            title: '轮播图详情url',
            dataIndex: 'webview_url',
        },
        {
            title: '排序',
            dataIndex: 'banner_sort',
        },
        {
            title: '状态',
            dataIndex: 'banner_status',
            render: (_, {banner_status}) => (
                <>
                    {
                        <Tag color={banner_status === 0 ? '#ff4d4f' : '#67c23a'} style={{width: 50, height: 30, textAlign: "center", paddingTop: 4}}>
                            {banner_status === 0 ? '禁用' : '启用'}
                        </Tag>
                    }
                </>
            ),
        },
        {
            title: '备注',
            dataIndex: 'remark',
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

    const handleAddOk = async (banner: BannerVo) => {
        if (handleResp(await addBanner(banner))) {
            setShowAddModal(false);
            let res = await bannerList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);
        }
    }

    const handleAddCancel = () => {
        setShowAddModal(false);
    };


    const showEditModal = (banner: BannerVo) => {
        setCurrentBanner(banner)
        setShowEditModal(true);
    };

    const handleEditOk = async (banner: BannerVo) => {
        if (handleResp(await updateBanner(banner))) {
            setShowEditModal(false);
            let res = await bannerList({
                current: currentPage, pageSize
            })
            setTotal(res.total)
            res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
    };

    //删除单条数据
    const showDeleteConfirm = (banner: BannerVo) => {
        Modal.confirm({
            content: `确定删除${banner.title}吗?`,
            async onOk() {
                await handleRemove([banner.id]);
            },
            onCancel() {
                console.log('Cancel');
            }
        })
    };

    //批量删除
    const handleRemove = async (ids: number[]) => {
        if (handleResp(await removeBanner(ids))) {
            let res = await bannerList({current: currentPage, pageSize})
            setTotal(res.total)
            res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);
        }

    };

    const handleSearchOk = async (banner: BannerVo) => {
        let res = await bannerList({current: currentPage, pageSize, ...banner,})
        setTotal(res.total)
        res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);
    };

    const handleResetOk = async () => {
        let res = await bannerList({current: currentPage, pageSize})
        setTotal(res.total)
        res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);
    };

    useEffect(() => {
        bannerList({
            current: currentPage, pageSize
        }).then(res => {
            setTotal(res.total)
            res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);
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
            let res = await bannerList({current: page, pageSize})
            setTotal(res.total)
            res.code === 0 ? setBannerListData(res.data) : message.error(res.msg);

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
                dataSource={bannerListData}
                rowKey={'id'}
                pagination={paginationProps}
                // tableLayout={"fixed"}
            />

            <CreateBannerForm onCancel={handleAddCancel} onCreate={handleAddOk} open={isShowAddModal}></CreateBannerForm>
            <UpdateBannerForm onCancel={handleEditCancel} onCreate={handleEditOk} open={isShowEditModal} bannerVo={currentBanner}></UpdateBannerForm>

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

export default Banner;