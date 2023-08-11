import {axiosInstance, IResponse} from "../../api/ajax";
import {TitleListParam, TitleVo} from "./data";
import {message} from "antd";

/**
 * @description: 试题列表
 * @params {req} TitleListParam
 * @return {Promise}
 */
export const titleList = (req: TitleListParam): Promise<IResponse> => {
    return axiosInstance.post('api/title_list', req).then(res => res.data);
};

/**
 * @description: 添加试题
 * @params {title} TitleVo
 * @return {Promise}
 */
export const addTitle = (title: TitleVo): Promise<IResponse> => {
    return axiosInstance.post('api/title_save', title).then(res => res.data);
};

/**
 * @description: 更新试题
 * @params {{title} TitleVo
 * @return {Promise}
 */
export const updateTitle = (title: TitleVo): Promise<IResponse> => {
    return axiosInstance.post('api/title_update', title).then(res => res.data);
};

/**
 * @description: 删除试题
 * @params {ids} number[]
 * @return {Promise}
 */
export const removeTitle = (ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/title_delete', {ids: ids}).then(res => res.data);
};

/**
 * @description: 查询试题菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const query_title_menu = (title_id: Number): Promise<IResponse> => {
    return axiosInstance.post('api/query_title_menu', {title_id: title_id}).then(res => res.data);
};

/**
 * @description: 更新试题菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const update_title_menu = (title_id: Number, menu_ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/update_title_menu', {title_id: title_id, menu_ids: menu_ids}).then(res => res.data);
};

/**
 * 统一处理
 * @param resp
 */
export const handleResp = (resp: IResponse): boolean => {
    resp.code === 0 ? message.success(resp.msg) : message.error(resp.msg);
    return resp.code === 0
};