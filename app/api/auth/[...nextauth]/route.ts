// route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface CustomUser {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider for Manual Sign-In
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "name@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Send login request to Flask backend
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            { email: credentials.email, password: credentials.password }
          );

          const data = response.data;

          if (response.status === 200 && data.access_token) {
            // Return user data, including tokens, to store in session
            return {
              id: data.user.id,
              name: `${data.user.first_name} ${data.user.last_name}`,
              email: data.user.email,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            } as CustomUser;
          }

          return null;
        } catch (error: any) {
          console.error("Credentials sign-in error:", error);
          throw new Error(error.response?.data?.msg || "Failed to sign in.");
        }
      },
    }),
  ],

  callbacks: {
    // Google OAuth Callback
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Send OAuth login request to Flask backend
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth/callback`,
            {
              token: account.access_token, // Send the access token received from Google
            }
          );

          const data = response.data;

          if (response.status === 200 && data.access_token) {
            // Attach tokens to user object
            (user as CustomUser).accessToken = data.access_token;
            (user as CustomUser).refreshToken = data.refresh_token;
            (user as CustomUser).id = data.user.id;
            return true;
          }

          return false;
        } catch (error: any) {
          console.error("Google sign-in error:", error.response?.data || error);
          return false;
        }
      }
      return true;
    },

    // JWT Callback to handle tokens
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as CustomUser).accessToken;
        token.refreshToken = (user as CustomUser).refreshToken;
        token.id = (user as CustomUser).id;
      }

      // Token refresh logic
      const now = Math.floor(Date.now() / 1000);
      const accessTokenExpiration = (token.accessTokenExpiresAt as number) || 0;
      if (accessTokenExpiration < now && token.refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
            {
              refresh_token: token.refreshToken,
            }
          );
          const newToken = response.data;

          token.accessToken = newToken.access_token;
          token.accessTokenExpiresAt = now + 15 * 60; // Assuming 15 minutes expiry
        } catch (error) {
          console.error("Error refreshing access token:", error);
          // Optionally, you can sign out the user here
        }
      }

      return token;
    },

    // Session Callback to pass tokens to client
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.id = token.id as string;
      return session;
    },

    // Redirect after sign-in
    async redirect({ url, baseUrl }) {
      return baseUrl + "/idea-generator";
    },
  },

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.JWT_SECRET_KEY,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
