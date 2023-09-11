import React, {useEffect} from 'react';
import {Form, Input, Modal, Select} from 'antd';
import {MemberVo} from "../data";

const {Option} = Select;

interface UpdateMemberFormProps {
    open: boolean;
    onCreate: (values: MemberVo) => void;
    onCancel: () => void;
    memberVo: MemberVo;
}

const UpdateMemberForm: React.FC<UpdateMemberFormProps> = ({open, onCreate, onCancel, memberVo}) => {
    const [form] = Form.useForm();
    const FormItem = Form.Item;

    useEffect(() => {
        if (memberVo) {
            form.setFieldsValue(memberVo);
        }
    }, [open]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    const memberFormContent = () => {
        return (
            <>
                <FormItem
                    label="id"
                    name="id"
                    hidden={true}
                >
                    <Input/>
                </FormItem>
                <FormItem
                    label={'会员手机'}
                    name="phone"
                    rules={[{required: true, message: '请输入手机号!'}]}
                >
                    <Input placeholder="手机号"/>
                </FormItem>
                <FormItem
                    label={'会员名称'}
                    name="name"
                    rules={[{required: true, message: '请输入会员名称!'}]}
                >
                    <Input placeholder="会员名称"/>
                </FormItem>
                <FormItem
                    label={'会员密码'}
                    name="password"
                    rules={[{required: true, message: '请输入会员密码!'}]}
                >
                    <Input placeholder="会员密码"/>
                </FormItem>
                <FormItem
                    label={'会员等级'}
                    name="level"
                    rules={[{required: true, message: '请输入会员等级!'}]}
                >
                    <Select style={{width: 234}}>
                        <Option value="0">普通会员</Option>
                        <Option value="1">黄金会员</Option>
                        <Option value="2">白金会员</Option>
                        <Option value="3">钻石会员</Option>
                    </Select>
                </FormItem>
            </>
        )
    }

    const modalFooter = {title: "更新", okText: '保存', onOk: handleOk, onCancel, cancelText: '取消', open, width: 480};
    const formLayout = {labelCol: {span: 7}, wrapperCol: {span: 13}, form};

    return (
        <Modal {...modalFooter} style={{top: 150}}>
            <Form {...formLayout} style={{marginTop: 30}}>
                {memberFormContent()}
            </Form>
        </Modal>
    );
};

export default UpdateMemberForm;