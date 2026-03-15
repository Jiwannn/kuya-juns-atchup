import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from 'bcryptjs';
import sql from "@/lib/db/neon";

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

        try {
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;

          if (users.length === 0) return null;

          const user = users[0];
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) return null;

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role || 'customer'
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;
          
          if (existingUser.length === 0) {
            await sql`
              INSERT INTO users (email, name, provider, role, created_at, updated_at)
              VALUES (${user.email}, ${user.name}, 'google', 'customer', NOW(), NOW())
            `;
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Force the NEXTAUTH_URL
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith('https://') ?? true,
});

export { handler as GET, handler as POST };