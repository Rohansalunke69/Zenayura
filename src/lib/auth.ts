import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            async profile(profile) {
                // Find existing user by Google ID or Email
                let user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { googleId: profile.sub },
                            { email: profile.email }
                        ]
                    }
                });

                if (!user) {
                    // Create new user explicitly holding fields from Google
                    user = await prisma.user.create({
                        data: {
                            email: profile.email,
                            name: profile.name,
                            googleId: profile.sub,
                            profilePicture: profile.picture,
                            authProvider: "google",
                        }
                    });
                } else if (!user.googleId) {
                    // Link Google to existing Email account
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            googleId: profile.sub,
                            profilePicture: user.profilePicture || profile.picture,
                        }
                    });
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.profilePicture,
                    role: user.role,
                };
            }
        }),
        CredentialsProvider({
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.profilePicture,
                    role: user.role,
                };
            }
        })
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
