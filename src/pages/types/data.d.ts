export interface TypesListParam {
    current: number;
    pageSize?: number;
    interview_code?: string;
}

export interface TypesVo {
    id: number;
    interview_code: string;
    create_time: string;
    update_time: string;
}
