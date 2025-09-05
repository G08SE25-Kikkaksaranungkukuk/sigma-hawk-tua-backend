import e from "express";

// request body of the group creation
export interface groupCreateReq {
  group_name: string;
  interest_fields: string[];
  group_leader_id: number;
}

export interface groupMemberAddReq {
  group_id : number; 
  user_id : number;
}

export interface groupGetReq{
  group_id : number;
}