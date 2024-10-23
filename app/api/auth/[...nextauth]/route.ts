import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

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
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const user = response.data;

          if (response.status === 200 && user) {
            // Return user object to be stored in the session
            return {
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              accessToken: user.access_token,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Credentials sign-in error:", error);
          throw new Error(
            error.response?.data?.msg || "Failed to sign in."
          );
        }
      },
    }),
  ],
  callbacks: {
    // Handle user sign-in
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { email, given_name, family_name, sub } = profile as any;
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth-login`,
            {
              email,
              first_name: given_name,
              last_name: family_name,
              provider_id: sub,
              auth_provider: "google",
            }
          );
          console.log("OAuth login success:", response.data);
          return true;
        } catch (error: any) {
          console.error(
            "Error creating/updating user:",
            error.response ? error.response.data : error
          );
          return false;
        }
      }
      return true; // Allow sign-in for CredentialsProvider
    },
    // Add accessToken to JWT
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // Add accessToken to session
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        email: token.email,
        name: token.name,
      };
      return session;
    },
    // Redirect after sign-in
    async redirect({ url, baseUrl }) {
      return baseUrl + "/idea-generator"; // Redirect to protected page
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
