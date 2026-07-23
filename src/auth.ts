import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

class CustomError extends CredentialsSignin {
  constructor(msg: string) {
    super();
    this.code = msg;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new CustomError("Missing email");
        }

        const email = (credentials.email as string).toLowerCase().trim();

        await connectToDatabase();

        if (credentials.otp) {
          const otpInput = (credentials.otp as string).trim();
          const validOtp = await Otp.findOne({
            email: email,
            otp: otpInput,
          });

          if (!validOtp) {
            throw new CustomError("Invalid or expired OTP");
          }

          await Otp.deleteOne({ _id: validOtp._id });

          let user = await User.findOne({ email: email });

          if (!user) {
            // Auto-create account for new users logging in via OTP
            const defaultName = email.split('@')[0];
            user = await User.create({
              name: credentials.name || defaultName,
              email: email,
            });
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        // 2. Password Verification Flow
        if (credentials.password) {
          const user = await User.findOne({ email: email }).select("+password");

          if (!user) {
            throw new CustomError("No user found with this email");
          }
          
          if (!user.password) {
            throw new CustomError("This account uses Magic Link OTP. Please login with OTP.");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isPasswordValid) {
            throw new CustomError("Invalid password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        throw new CustomError("Please provide a password or OTP");
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
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
