import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: string;
        googleId?: string | null;
        passwordHash?: string | null;
        profilePicture?: string | null;
    }

    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}
