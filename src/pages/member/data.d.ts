export interface MemberListParam {
    current: number;
    pageSize?: number;
    phone?: string;
    name?: string;
    level?: string;
}

export interface MemberVo {
    id: number;
    phone: string;
    name: string;
    password: string;
    level: string;
    create_time: string;
    update_time: string;
}
