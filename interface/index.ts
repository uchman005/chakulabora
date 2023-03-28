export interface IUser extends Document {
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
}

export interface ResponseFunctions {
    GET?: Function;
    POST?: Function;
  }
