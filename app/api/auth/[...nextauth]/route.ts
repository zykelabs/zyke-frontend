import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
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
        console.log('OAuth login success:', response.data);
      } catch (error: any) {
        console.error(
          "Error creating/updating user:",
          error.response ? error.response.data : error
        );
        return false;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', token);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', session);
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
