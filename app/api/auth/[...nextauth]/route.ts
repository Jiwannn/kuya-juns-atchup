import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { sql } from "@vercel/postgres";

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { id?: string };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await sql`
          SELECT * FROM users WHERE email = ${credentials.email}
        `;

        if (user.rows.length === 0) return null;

        const isValid = await compare(credentials.password, user.rows[0].password);

        if (!isValid) return null;

        return {
          id: user.rows[0].id,
          email: user.rows[0].email,
          name: user.rows[0].name,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await sql`
          SELECT * FROM users WHERE email = ${user.email}
        `;
        
        if (existingUser.rows.length === 0) {
          await sql`
            INSERT INTO users (email, name, provider)
            VALUES (${user.email}, ${user.name}, 'google')
          `;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };