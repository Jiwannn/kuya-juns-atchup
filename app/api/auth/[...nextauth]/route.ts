import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from 'bcryptjs';
import { sql } from "@/lib/db/neon";

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
          // Get user from database
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `;

          if (users.length === 0) {
            console.log('User not found:', credentials.email);
            return null;
          }

          const user = users[0];
          
          // Compare password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('Invalid password for:', credentials.email);
            return null;
          }

          // Ensure role is set (default to 'customer' if not)
          const role = user.role || 'customer';
          
          console.log('User authenticated:', { 
            email: user.email, 
            role: role,
            id: user.id 
          });

          // Return user object with role
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: role
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
          // Check if user exists
          const existingUser = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `;
          
          if (existingUser.length === 0) {
            // New Google user - create with customer role
            await sql`
              INSERT INTO users (email, name, provider, role, created_at, updated_at)
              VALUES (${user.email}, ${user.name}, 'google', 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            console.log('New Google user created:', user.email);
          } else {
            // Update existing user's name if needed
            await sql`
              UPDATE users 
              SET name = ${user.name}, updated_at = CURRENT_TIMESTAMP 
              WHERE email = ${user.email}
            `;
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        console.log('JWT created with role:', user.role);
      }
      
      // Handle session updates
      if (trigger === "update" && session?.role) {
        token.role = session.role;
        console.log('JWT updated with role:', session.role);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        console.log('Session created with role:', token.role);
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
});

export { handler as GET, handler as POST };