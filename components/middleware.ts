// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // You can add additional middleware logic here if needed
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


export const config = {
  matcher: [
    "/idea-generator",
    "/user-type",
    "/brandvoice",
    "/brandprofile",
    "/generated-posts"
  ],
};
