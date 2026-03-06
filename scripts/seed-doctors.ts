import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const doctors = [
    { name: "Dr. Anita Jawade", specialty: "Ananya Ayurveda Expert", experience: 28, rating: 4.8, location: "Laxmi Nagar, Nagpur", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Dr. Sandeep Wagh", specialty: "Alive-veda Ayurvedic Clinic", experience: 13, rating: 4.7, location: "Abhyankar Nagar, Nagpur", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Dr. Megha Jagtap", specialty: "Atharva Panchakarma", experience: 25, rating: 4.9, location: "Ranapratap Nagar, Nagpur", image: "https://i.pravatar.cc/150?img=9" },
    { name: "Dr. Pankaj Jogi", specialty: "Shree Vishwalilai Clinic", experience: 14, rating: 4.8, location: "Dharampeth, Nagpur", image: "https://i.pravatar.cc/150?img=15" },
    { name: "Dr. Nitesh Khonde", specialty: "Kerala Panchakarma", experience: 18, rating: 4.9, location: "Parijatak Ayurveda, Nagpur", image: "https://i.pravatar.cc/150?img=12" },
    { name: "Dr. Swanand Joshi", specialty: "Sanjeevan Chikitsalaya", experience: 8, rating: 4.6, location: "Wardha Road, Nagpur", image: "https://i.pravatar.cc/150?img=14" },
];

async function main() {
    console.log("Seeding doctors...");
    for (const doc of doctors) {
        await prisma.doctor.create({
            data: doc
        });
    }
    console.log("Database seeded successfully!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
