import { User, UserRole } from "@/@types/module/users/response";
import { authApi } from "@/lib/apis";
import { exactNetError } from "@/lib/utils";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthConfig: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: "laundry-fe-session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          const loginResult = await authApi.login(credentials.username, credentials.password);

          return await Promise.resolve({
            id: loginResult.data.user.id,
            username: loginResult.data.user.username,
            fullName: loginResult.data.user.fullName,
            role: loginResult.data.user.role,
            isActive: loginResult.data.user.isActive,
            createdAt: loginResult.data.user.createdAt,
            updatedAt: loginResult.data.user.updatedAt,
            token: loginResult.data.token,
          } as User);
        } catch (error) {
          throw new Error(exactNetError(error as Error), { cause: error });
        }
      },
    }),
    CredentialsProvider({
      id: "register",
      name: "register",
      credentials: {
        username: { type: "text" },
        password: { type: "text" },
        confirmPassword: { type: "text" },
        fullName: { type: "password" },
        role: { type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("No credentials provided");
          }

          const registerUser = await authApi.register({
            username: credentials.username,
            password: credentials.password,
            confirmPassword: credentials.confirmPassword,
            fullName: credentials.fullName,
            role: credentials.role as UserRole,
          });

          return await Promise.resolve({
            id: registerUser.data.user.id,
            username: registerUser.data.user.username,
            fullName: registerUser.data.user.fullName,
            role: registerUser.data.user.role,
            isActive: registerUser.data.user.isActive,
            createdAt: registerUser.data.user.createdAt,
            updatedAt: registerUser.data.user.updatedAt,
            token: registerUser.data.token,
          } as User);
        } catch (error) {
          throw new Error(exactNetError(error as Error), { cause: error });
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  logger: {
    error: (...message) => console.error(`[NEXT-AUTH ERROR] :: `, ...message),
    warn: (...message) => console.warn(`[NEXT-AUTH WARNING] :: `, ...message),
    debug: (...message) => console.debug(`[NEXT-AUTH DEBUG] :: `, ...message),
  },
  callbacks: {
    session(params) {
      const token = params.token as User;
      const session = params.session as Session & User;

      if (token?.id) {
        session.token = token.token as string;
        session.user = {
          id: token.id,
          username: token.username,
          fullName: token.fullName,
          role: token.role,
          isActive: token.isActive,
          createdAt: token.createdAt,
          updatedAt: token.updatedAt,
          token: token.token,
        };
      }

      return session;
    },
    jwt(params) {
      const user = params.user as User;
      if (user?.token) {
        params.token = user;
        params.token.sub = user.id;
      }

      return params.token;
    },
  },
};
