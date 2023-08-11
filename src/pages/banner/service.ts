import {axiosInstance, IResponse} from "../../api/ajax";
import {BannerListParam, BannerVo} from "./data";
import {message} from "antd";

/**
 * @description: 轮播图列表
 * @params {req} BannerListParam
 * @return {Promise}
 */
export const bannerList = (req: BannerListParam): Promise<IResponse> => {
    return axiosInstance.post('api/banner_list', req).then(res => res.data);
};

/**
 * @description: 添加轮播图
 * @params {banner} BannerVo
 * @return {Promise}
 */
export const addBanner = (banner: BannerVo): Promise<IResponse> => {
    return axiosInstance.post('api/banner_save', banner).then(res => res.data);
};

/**
 * @description: 更新轮播图
 * @params {{banner} BannerVo
 * @return {Promise}
 */
export const updateBanner = (banner: BannerVo): Promise<IResponse> => {
    return axiosInstance.post('api/banner_update', banner).then(res => res.data);
};

/**
 * @description: 删除轮播图
 * @params {ids} number[]
 * @return {Promise}
 */
export const removeBanner = (ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/banner_delete', {ids: ids}).then(res => res.data);
};

/**
 * @description: 查询轮播图菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const query_banner_menu = (banner_id: Number): Promise<IResponse> => {
    return axiosInstance.post('api/query_banner_menu', {banner_id: banner_id}).then(res => res.data);
};

/**
 * @description: 更新轮播图菜单
 * @params {ids} number[]
 * @return {Promise}
 */
export const update_banner_menu = (banner_id: Number, menu_ids: Number[]): Promise<IResponse> => {
    return axiosInstance.post('api/update_banner_menu', {banner_id: banner_id, menu_ids: menu_ids}).then(res => res.data);
};

/**
 * 统一处理
 * @param resp
 */
export const handleResp = (resp: IResponse): boolean => {
    resp.code === 0 ? message.success(resp.msg) : message.error(resp.msg);
    return resp.code === 0
};