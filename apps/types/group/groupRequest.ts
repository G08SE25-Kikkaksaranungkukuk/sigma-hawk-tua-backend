// request body of the group creation
export interface groupCreateReq {
  group_name: string;
  interest_field?: string;
  group_leader_id: number;
}