export interface BannerListParam {
    current: number;
    pageSize?: number;
    title?: string;
    banner_status?: number;
}

export interface BannerVo {
    id: number;
    title: string;
    image_url: string;
    webview_url: string;
    banner_sort: number;
    banner_status: number;
    remark: string;
    create_time: string;
    update_time: string;
}
