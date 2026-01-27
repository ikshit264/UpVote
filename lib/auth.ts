import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const company = await prisma.company.findUnique({
          where: { email: credentials.email }
        });

        if (!company || !company.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, company.passwordHash);

        if (!isValid) return null;

        return {
          id: company.id,
          email: company.email,
          name: company.name,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (604,800 seconds)
    updateAge: 24 * 60 * 60, // Extend session if user is active (check every 24 hours)
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // JWT token expires in 7 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;
        const googleId = account.providerAccountId;

        if (!email) return false;

        // Check if company exists
        const existingCompany = await prisma.company.findUnique({
          where: { email }
        });

        if (existingCompany) {
          // Update with Google ID if not set
          if (!existingCompany.googleId) {
            await prisma.company.update({
              where: { email },
              data: { googleId }
            });
          }
        } else {
          // Create new company with default FREE subscription
          const newCompany = await prisma.company.create({
            data: {
              email,
              googleId,
              name: user.name || email.split('@')[0],
              passwordHash: null,
              subscription: {
                create: {
                  plan: 'FREE',
                  status: 'ACTIVE',
                }
              }
            }
          });
          console.log(`Created new company with FREE subscription: ${email}`);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Always fetch the company ID from database using email
      // This ensures we use our internal company ID, not the OAuth provider's ID
      if (token.email) {
        const company = await prisma.company.findUnique({
          where: { email: token.email }
        });
        if (company) {
          token.id = company.id; // Use our company ID, not OAuth provider ID
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCompanySession() {
  return await getServerSession(authOptions);
}
