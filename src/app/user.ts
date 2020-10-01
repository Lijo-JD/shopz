export class User {
  _id?: string
  email: string
  password: string
  security: string
  __v?: number

  constructor(data: User) {
    this._id = data._id
    this.email = data.email
    this.password = data.password
    this.security = data.security
    this.__v = data.__v
  }
}
