export interface FailAuth {
  statusMsg: string
  message: string
}

export interface SuccessLogin  {
    message: string
    token: string
    user: Userinfo
}

export interface Userinfo   {
    name: string
    email: string
    role: string
}