import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // 1. Basic Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields (name, email, password)' },
                { status: 400 }
            );
        }
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // 3. Hash Password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Create User in Database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                authProvider: 'email'
            }
        });

        // 5. Successful Response
        return NextResponse.json(
            {
                message: 'Account created successfully',
                user: { id: newUser.id, name: newUser.name, email: newUser.email }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { message: 'Internal server error during registration' },
            { status: 500 }
        );
    }
}