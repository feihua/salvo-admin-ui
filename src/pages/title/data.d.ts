export interface TitleListParam {
    current: number;
    pageSize?: number;
    title?: string;
    interview_type?: string;
}

export interface TitleVo {

    id: number;
    title: string;
    content: string;
    interview_type: string;
    create_time: string;
    update_time: string;
}
