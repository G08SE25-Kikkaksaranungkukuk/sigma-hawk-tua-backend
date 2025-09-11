import e from "express";

// request body of the group creation
export interface groupCreateReq {
  group_name: string;
  group_leader_id: number;
  description?: string;
  max_members?: number;
  interest_fields?: string[];  // Changed from interest_ids to interest_fields
}

export interface groupMemberReq {
  group_id : number; 
  user_id : number;
}

export interface groupGetReq{
  group_id : number;
}

export interface groupFilterReq {
  interest_fields? : string[];
  group_name? : string;
  page? : number;
  page_size? : number;
}

export interface groupInfo {
  interest_fields : string[];
  group_name : string;
}

export interface groupFilterRes {
  group_array : groupInfo[];
  group_count : number;
}

export interface GroupMemberReq {
  group_id : number;
  user_id : number;
}