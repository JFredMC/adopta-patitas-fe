import { IEvent } from "../../reserva-me/interfaces/reserva-me.interface";

export interface User {
    id: number,
    roleId: number,
    name: string,
    firstName: string,
    lastName: string,
    identification: string,
    identificationTypeId: number,
    email: string,
    phone: string,
    profilePicture?: string,
    profilePictureUrl?: string,
    url?: string,
    birthday: string,
    username: string,
    password?: string,
    salt?: string,
    //roleId?: number,
    // clientId?: number,
    isActive?: boolean,
    secondAuthMode?: boolean,
    TOKEN_WEBPUSH?: string,
    TOKEN_MOBILEPUSH?: string,
    createdAt?: string,
    updatedAt?: string,
    role: Role,
    identificationType: IdentificationType,
}

export interface UserRegister {
    roleId: number,
    firstName: string,
    lastName: string,
    identification: string,
    identificationTypeId: number,
    email: string,
    phone: string,
    profilePicture?: string,
    birthday: string,
    username: string,
    password: string,
}


export interface Role {
    id: number,
    name: string,
    identifier: string,
    description: string,
}

export interface IClient {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    nit?: string;
    url?: string;
    events: IEvent[];
  }


export interface IdentificationType {
    id: number,
    name: string,
    abbreviation: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface City {
    ID: number,
    NAME: string,
    SUBREGION_ID: number,
    REGION_ID: number,
    COUNTRY_ID: number,
    CREATED_AT?: string,
    UPDATED_AT?: string
}

export interface RequestValidateOtp {
    email:  string,
    otp:            string
}

export interface ResponseValidateOtp {
    message:    string,
    error:      string,
    statusCode: number
}

export interface RequestGenerateVerificationCode {
    email?: string
}

export interface ResponseRegister {
    user: User
}

export interface RecoverPasswordRequest {
    username: string,
    isMobile: boolean
}

export interface RecoverPasswordErrorResponse {
    message?: string,
    error?: string,
    statusCode?: number
}

export interface ResetPasswordRequest {
    userId: number,
    otp: string,
    newPassword: string
}

export interface ResetPasswordResponse {
    message?: string,
    success?: string,
    status?: number
}

export interface updateTokenWebPushRequest {
    TOKEN_WEBPUSH: string
}