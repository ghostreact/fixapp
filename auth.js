import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    // maxAge: 5 * 60, // 5 minutes in seconds
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (user && compare(credentials.password, user.password)) {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            name: user.name,
            // You can also return refresh token or any additional fields
          };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
   
  },
  callbacks: {
    
    async jwt({ token, user }) {
      
      if (user) {
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );
        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
        await prisma.$transaction([
          
          prisma.session.upsert({
            where: {
              sessionToken: accessToken, // ใช้ sessionToken หรือฟิลด์ที่มีความเป็นเอกลักษณ์อื่น
            },
            update: {
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // ขยายเวลา expiration ไปอีก 30 วัน
              updatedAt: new Date(),
            },
            create: {
              sessionToken: accessToken, // ใช้ sessionToken เดียวกันที่นี่
              // ใช้ user.id สำหรับการเชื่อมต่อ (ถ้าใช้ userID ต้องเปลี่ยนเป็น user.userID)
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              createdAt: new Date(),
              updatedAt: new Date(),
              jwt_token: accessToken,
              user: {
                connect: { id: parseInt(user.id) }, // แปลงเป็น Int หาก user.id เป็น String
              },
            },
          }),
        ]);

        token.id = user.id;
        token.role = user.role;
        token.username = user.username,
       
        token.accessToken = accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username,
      
        session.accessToken = token.accessToken;
      }
      return session;
    },
    // async redirect({ baseUrl }) {
    //   return `${baseUrl}/Dashboard`;
    // },
  },
});
