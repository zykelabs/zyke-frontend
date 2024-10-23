import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  }
);

// Define which routes to protect
export const config = {
  matcher: [
    "/idea-generator",
  ],
};
