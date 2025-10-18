export interface BlogSearchFilter {
    keyword?: string;
    interest_id?: number[];
    author?: string;
    date?: string;
    page?: number;
    page_size?: number;
}

export interface blogCreateReq {
    title: string;
    description: string;
    json_config: string;
    html_output: string;
}