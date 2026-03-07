import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'doctor@zenayura.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'doctor',
            passwordHash: hashedPassword,
        },
        create: {
            email,
            name: 'Dr. Test User',
            passwordHash: hashedPassword,
            authProvider: 'email',
            role: 'doctor',
        },
    })

    console.log('Doctor account created or updated:', user)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
