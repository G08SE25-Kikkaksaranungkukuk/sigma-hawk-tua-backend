// request body of the auth's register
export interface authRegisterReq {
    first_name : string
    middle_name : string | null
    last_name : string
    birth_date : Date
    sex : string
    interests : string[]
    travel_styles : string[]
    phone : string
    email : string
    password : string
    salt : string
};

// request body of the auth's login
export interface authLoginReq {
    email : string
    password : string
}