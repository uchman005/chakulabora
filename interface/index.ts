export interface IUser {
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
    body: string;
    author: IUser;
    date?: string;
    upvotes?: number;
    downvotes?: number;
    category?: string;
    image?: string;
    blob?: string;
}

export interface ResponseFunctions {
    GET?: Function;
    POST?: Function;
}
