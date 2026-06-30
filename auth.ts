import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  InactiveUserError,
  InvalidEmailPasswordError,
} from "./app/utils/errors";
import { sendRequest } from "./app/utils/api";
import { IUser } from "./app/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const resp = await sendRequest<IBackendResponse<ILogin>>({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          body: { ...credentials },
        });

        if (resp.statusCode === 201) {
          return {
            id: resp.data!.user!.id.toString(),
            email: resp.data!.user!.email,
            username: resp.data!.user!.username,
            accessToken: resp.data!.access_token,
          };
        } else if (resp.statusCode === 400) {
          throw new InactiveUserError();
        } else if (resp.statusCode === 401) {
          throw new InvalidEmailPasswordError();
        } else {
          throw new Error("Unexpected error occurred");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user = user as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
