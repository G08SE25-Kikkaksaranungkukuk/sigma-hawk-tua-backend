// request body of the auth's register
export interface authRegisterReq {
    first_name : string
    middle_name? : string
    last_name : string
    birth_date : Date
    sex : string
    phone : string
    email : string
    password : string
    role: string
};

export interface UserPreferences {
    interest_ids: number[];
    travel_style_ids: number[];
}

export interface UserPreferencesWithData {
    interests: Array<{ id: number; key: string; label: string; emoji: string; color: string; }>;
    travel_styles: Array<{ id: number; key: string; label: string; emoji: string; color: string; }>;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}
// request body of the auth's login
export interface authLoginReq {
    email : string
    password : string
}