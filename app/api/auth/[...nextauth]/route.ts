import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface CustomUser {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
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
    // Handle user sign-in
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { email, given_name, family_name, sub } = profile as any;
        try {
          // Call your Flask backend to register or log in the user
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

          // Assuming the backend returns: id, access_token
          (user as CustomUser).id = response.data.id;
          (user as CustomUser).accessToken = response.data.access_token;

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

    // Add accessToken and user ID to JWT
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (user) {
        token.accessToken = (user as CustomUser).accessToken;
        token.id = (user as CustomUser).id;
      }

      // Persist the accessToken to the token right after signin
      if (account?.provider === "google") {
        token.accessToken = (user as CustomUser).accessToken as string;
        token.id = (user as CustomUser).id;
      }

      return token;
    },

    // Add accessToken and user ID to session
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      (session.user as any).id = token.id as string;
      return session;
    },

    // Redirect after sign-in
    async redirect({ url, baseUrl }) {
      // Let the SignIn component handle redirection based on brand voice
      return baseUrl + '/idea-generator';
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