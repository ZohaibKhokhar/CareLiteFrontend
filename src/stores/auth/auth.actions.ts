// store/auth.actions.ts
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public credentials: { username: string; password: string }) {}
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public data: { username: string; password: string; confirmPassword: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class changePassword{
  static readonly type = '[Auth] Change-Password';
   constructor(public credentials: { oldPassword: string; newPassword: string }) {}
}
