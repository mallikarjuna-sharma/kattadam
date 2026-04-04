// lib/auth.ts — NextAuth configuration with OTP-based mobile auth

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;

        const phone = credentials.phone.trim();
        const otp = credentials.otp.trim();

        // Verify OTP
        const otpRecord = await db.otpCode.findFirst({
          where: {
            phone,
            code: otp,
            used: false,
            expiresAt: { gt: new Date() },
          },
        });

        if (!otpRecord) return null;

        // Mark OTP as used
        await db.otpCode.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });

        // Upsert user
        const user = await db.user.upsert({
          where: { phone },
          create: { phone, role: "CUSTOMER" },
          update: { updatedAt: new Date() },
        });

        return {
          id: user.id,
          phone: user.phone,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
