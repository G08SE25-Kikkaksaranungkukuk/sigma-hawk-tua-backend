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
    interest_id: number[];
    description: string;
    json_config: string;
    html_output: string;
}

export interface blogInterest {
    blog_id: number;
    interest_id: number;
}