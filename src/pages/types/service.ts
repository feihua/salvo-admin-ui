import {axiosInstance, IResponse} from "../../api/ajax";
import {TypesListParam, TypesVo} from "./data";
import {message} from "antd";

/**
 * @description: 试题类型列表
 * @params {req} TypesListParam
 * @return {Promise}
 */
export const typesList = (req: TypesListParam): Promise<IResponse> => {
    return axiosInstance.post('api/type_list', req).then(res => res.data);
};

/**
 * @description: 添加试题类型
 * @params {types} TypesVo
 * @return {Promise}
 */
export const addTypes = (types: TypesVo): Promise<IResponse> => {
    return axiosInstance.post('api/type_save', types).then(res => res.data);
};

/**
 * @description: 更新试题类型
 * @params {{types} TypesVo
 * @return {Promise}
 */
export const updateTypes = (types: TypesVo): Promise<IResponse> => {
    return axiosInstance.post('api/type_update', types).then(res => res.data);
};

/**
 * @description: 删除试题类型
 * @params {ids} number[]
 * @return {Promise}
 */
export const removeTypes = (ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/type_delete', {ids: ids}).then(res => res.data);
};

/**
 * @description: 查询试题类型菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const query_types_menu = (types_id: Number): Promise<IResponse> => {
    return axiosInstance.post('api/query_types_menu', {types_id: types_id}).then(res => res.data);
};

/**
 * @description: 更新试题类型菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const update_types_menu = (types_id: Number, menu_ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/update_types_menu', {types_id: types_id, menu_ids: menu_ids}).then(res => res.data);
};

/**
 * 统一处理
 * @param resp
 */
export const handleResp = (resp: IResponse): boolean => {
    resp.code === 0 ? message.success(resp.msg) : message.error(resp.msg);
    return resp.code === 0
};