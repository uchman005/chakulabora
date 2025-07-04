export interface IUser {
  id?: string;
  fname: string;
  lname: string;
  email: string;
  bio?: string;
  googleId?:string;
  phone?: string;
  role?: string;
  password?: string;
  postal_code?: string;
  country?: string;
  street_address?: string;
  city?: string;
  state?: string;
  website?: string;
  pv?: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}
export interface IPost {
  title?: string;
  _id?: string;
  approved: boolean;
  solved: boolean;
  body: string;
  author: IUser;
  time?: string;
  image: string;
  upvotes?: Array<string>;
  downvotes?: Array<string>;
  category?: string;
  blob?: string;
}

export interface ResponseFunctions {
  GET?: Function;
  POST?: Function;
}

export interface IAnswer {
  body: string;
  author: IUser | null;
  post: string;
  isSolution: boolean;
  time?: string;
  _id?: string;
  upvotes?: Array<string>;
  downvotes?: Array<string>;
}
export interface IComment {
  body: string;
  author: IUser;
  time?: string;
}

export interface ISubscriber {
  email: string;
  time?: string;
  _id?: string;
}

export interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface OverrideParameterType {
  fileNameOnLocalSystem: string;
}