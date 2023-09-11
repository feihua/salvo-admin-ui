import React from 'react';
import {SearchOutlined} from '@ant-design/icons';
import {Button, Form, Input, Select, Space} from 'antd';
import {MemberVo} from "../data";

const {Option} = Select;

interface CreateMemberFormProps {
    search: (values: MemberVo) => void;
    reSet: () => void;
}

const AdvancedSearchForm: React.FC<CreateMemberFormProps> = ({search, reSet}) => {
    const FormItem = Form.Item;
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        search(values)
    };

    const onReset = () => {
        form.resetFields();
        reSet()
    };

    const searchForm = () => {
        return (
            <>
                <FormItem
                    label={'手机号'}
                    name="phone"
                >
                    <Input placeholder="手机号"/>
                </FormItem>
                <FormItem
                    label={'会员名称'}
                    name="name"
                >
                    <Input placeholder="会员名称"/>
                </FormItem>
                <FormItem
                    label={'会员等级'}
                    name="level"
                >
                    <Select style={{width: 200}}>
                        <Option value="0">普通会员</Option>
                        <Option value="1">黄金会员</Option>
                        <Option value="2">白金会员</Option>
                        <Option value="3">钻石会员</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>} style={{width: 120}}>
                            查询
                        </Button>
                        <Button htmlType="button" onClick={onReset} style={{width: 100}}>
                            重置
                        </Button>
                    </Space>
                </FormItem>
            </>
        )
    }
    return (
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
            {searchForm()}
        </Form>
    );
};

export default AdvancedSearchForm;