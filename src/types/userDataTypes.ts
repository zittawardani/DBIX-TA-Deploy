export interface UserDataType {
  id: string,
  name?: string,
  email?: string,
  phone?: string,
  emailVerified?: boolean,
  password?: string,
  items?: [],
  type?: string,
  image?: string,
  orders?: []
}