import {axiosInstance, IResponse} from "../../api/ajax";
import {MemberListParam, MemberVo} from "./data";
import {message} from "antd";

/**
 * @description: 会员列表
 * @params {req} MemberListParam
 * @return {Promise}
 */
export const memberList = (req: MemberListParam): Promise<IResponse> => {
    return axiosInstance.post('api/member_list', req).then(res => res.data);
};

/**
 * @description: 添加会员
 * @params {member} MemberVo
 * @return {Promise}
 */
export const addMember = (member: MemberVo): Promise<IResponse> => {
    return axiosInstance.post('api/member_save', member).then(res => res.data);
};

/**
 * @description: 更新会员
 * @params {{member} MemberVo
 * @return {Promise}
 */
export const updateMember = (member: MemberVo): Promise<IResponse> => {
    return axiosInstance.post('api/member_update', member).then(res => res.data);
};

/**
 * @description: 删除会员
 * @params {ids} number[]
 * @return {Promise}
 */
export const removeMember = (ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/member_delete', {ids: ids}).then(res => res.data);
};

/**
 * @description: 查询会员菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const query_member_menu = (member_id: Number): Promise<IResponse> => {
    return axiosInstance.post('api/query_member_menu', {member_id: member_id}).then(res => res.data);
};

/**
 * @description: 更新会员菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const update_member_menu = (member_id: Number, menu_ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/update_member_menu', {member_id: member_id, menu_ids: menu_ids}).then(res => res.data);
};

/**
 * 统一处理
 * @param resp
 */
export const handleResp = (resp: IResponse): boolean => {
    resp.code === 0 ? message.success(resp.msg) : message.error(resp.msg);
    return resp.code === 0
};