export interface IUser {
    id?: string;
    fname: string;
    lname: string;
    email: string;
    bio: string;
    phone?: string;
    role: string;
    password: string;
    postal_code: string;
    country?: string;
    street_address?: string;
    city?: string;
    state?: string;
    website?: string;
    pv?: number
}
export interface IPost {
    title?: string;
    _id?: string;
    approved: boolean;
    body: string;
    author: IUser;
    date?: number;
    upvotes?: Array<string>;
    downvotes?: Array<string>;
    category?: string;
    blob?: string;
}

export interface ResponseFunctions {
    GET?: Function;
    POST?: Function;
}
