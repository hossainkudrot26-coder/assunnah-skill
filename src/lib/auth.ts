import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;
        if (!user.isActive) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },

    async authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isHub = nextUrl.pathname.startsWith("/hub");
      const isAdmin = nextUrl.pathname.startsWith("/admin");
      const isAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      // Hub pages require login
      if (isHub && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      // Admin pages require admin role
      if (isAdmin) {
        if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl));
        if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "SUPER_ADMIN") {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      // Redirect logged-in users away from auth pages
      if (isAuth && isLoggedIn) {
        return Response.redirect(new URL("/hub", nextUrl));
      }

      return true;
    },
  },
});
