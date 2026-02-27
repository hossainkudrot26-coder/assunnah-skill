// @ts-nocheck
/**
 * Seed initial team members into the database.
 * Run with: npx tsx prisma/seed-team.ts
 */
import prisma from "../src/lib/db";

const teamMembers = [
    {
        name: "Shaykh Ahmadullah",
        nameBn: "শায়খ আহমাদুল্লাহ",
        role: "প্রতিষ্ঠাতা ও চেয়ারম্যান",
        initials: "শআ",
        bio: "আস-সুন্নাহ ফাউন্ডেশনের প্রতিষ্ঠাতা, দূরদর্শী নেতৃত্ব",
        sortOrder: 0,
    },
    {
        name: "Muhammad Rashedul Islam",
        nameBn: "মুহাম্মদ রাশেদুল ইসলাম",
        role: "পরিচালক — প্রশিক্ষণ বিভাগ",
        initials: "মরই",
        bio: "১০+ বছরের শিক্ষা ও প্রশিক্ষণ অভিজ্ঞতা",
        sortOrder: 1,
    },
    {
        name: "Chef Abdur Rahman",
        nameBn: "শেফ আব্দুর রহমান",
        role: "প্রধান প্রশিক্ষক — রন্ধনশিল্প",
        initials: "আর",
        bio: "৫-তারকা হোটেলে ১৫+ বছরের অভিজ্ঞতা",
        sortOrder: 2,
    },
    {
        name: "Tanvir Ahmed",
        nameBn: "তানভীর আহমেদ",
        role: "প্রধান প্রশিক্ষক — সেলস ও মার্কেটিং",
        initials: "তআ",
        bio: "কর্পোরেট সেলস ম্যানেজার, ১২+ বছরের অভিজ্ঞতা",
        sortOrder: 3,
    },
    {
        name: "Ahmad Faisal",
        nameBn: "আহমদ ফয়সাল",
        role: "প্রশিক্ষক — অ্যাকাউন্টিং",
        initials: "আফ",
        bio: "চার্টার্ড অ্যাকাউন্ট্যান্ট, কর্পোরেট ট্রেইনার",
        sortOrder: 4,
    },
    {
        name: "Nadim Hasan",
        nameBn: "নাদিম হাসান",
        role: "প্রশিক্ষক — ভিডিও ও AI",
        initials: "নহ",
        bio: "ইউটিউব কনটেন্ট ক্রিয়েটর, AI বিশেষজ্ঞ",
        sortOrder: 5,
    },
];

async function main() {
    console.log("🌱 Seeding team members...");

    for (const member of teamMembers) {
        await prisma.teamMember.upsert({
            where: { id: member.name.toLowerCase().replace(/\s/g, "-") },
            update: member,
            create: {
                ...member,
                isVisible: true,
            },
        });
    }

    const count = await prisma.teamMember.count();
    console.log(`✅ Done! ${count} team members in database.`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
