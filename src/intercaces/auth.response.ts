export interface IUserResponse {
  _id: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date
}
  
export interface ILoginResponse {
  user: IUserResponse;
  token: string;
}