export interface BlogSearchFilter {
    keyword?: string;
    interest_id?: number[];
    author?: string;
    date?: string;
    page?: number;
    page_size?: number;
}