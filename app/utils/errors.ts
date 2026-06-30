import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type = "Username or password is incorrect"
}

export class InactiveUserError extends AuthError {
  static type = "User is inactive"
}