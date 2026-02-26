export interface NavItem {
  label: string;
  labelEn: string;
  href: string;
  description?: string;
  iconName?: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "হোম",
    labelEn: "Home",
    href: "/",
  },
  {
    label: "প্রশিক্ষণ",
    labelEn: "Training",
    href: "/courses",
    children: [
      {
        label: "সকল কোর্স",
        labelEn: "All Courses",
        href: "/courses",
        description: "আমাদের সকল প্রশিক্ষণ কোর্স দেখুন",
        iconName: "book",
      },
      {
        label: "কোর্স ফাইন্ডার",
        labelEn: "Course Finder",
        href: "/quiz",
        description: "আপনার জন্য সেরা কোর্স খুঁজে নিন",
        iconName: "target",
      },
      {
        label: "কোর্স তুলনা",
        labelEn: "Compare Courses",
        href: "/compare",
        description: "পাশাপাশি কোর্স তুলনা করুন",
        iconName: "chart",
      },
      {
        label: "স্মল বিজনেস ম্যানেজমেন্ট",
        labelEn: "Small Business Management",
        href: "/courses/small-business-management",
        description: "MS Office, ডিজাইন, মার্কেটিং, AI",
        iconName: "briefcase",
      },
      {
        label: "শেফ ট্রেনিং",
        labelEn: "Chef Training",
        href: "/courses/chef-training",
        description: "শেফ ও কিচেন ম্যানেজমেন্ট প্রশিক্ষণ",
        iconName: "chef",
      },
      {
        label: "সেলস ও মার্কেটিং",
        labelEn: "Sales & Marketing",
        href: "/courses/sales-and-marketing",
        description: "সেলস স্ট্র্যাটেজি ও মার্কেটিং দক্ষতা",
        iconName: "chart",
      },
      {
        label: "স্মার্ট টেইলারিং",
        labelEn: "Smart Tailoring",
        href: "/courses/smart-tailoring",
        description: "নারীদের জন্য টেইলারিং ও ফ্যাশন ডিজাইন",
        iconName: "scissors",
      },
    ],
  },
  {
    label: "ভর্তি তথ্য",
    labelEn: "Admission",
    href: "/admission",
    children: [
      {
        label: "ভর্তি প্রক্রিয়া",
        labelEn: "Admission Process",
        href: "/admission",
        description: "ভর্তির ধাপসমূহ ও প্রয়োজনীয় কাগজপত্র",
        iconName: "clipboard",
      },
      {
        label: "স্কলারশিপ",
        labelEn: "Scholarship",
        href: "/scholarship",
        description: "স্কলারশিপ সুবিধা ও আবেদন প্রক্রিয়া",
        iconName: "award",
      },
      {
        label: "সাধারণ জিজ্ঞাসা",
        labelEn: "FAQ",
        href: "/faq",
        description: "প্রায়শই জিজ্ঞাসিত প্রশ্ন ও উত্তর",
        iconName: "chat",
      },
    ],
  },
  {
    label: "সম্পর্কে",
    labelEn: "About",
    href: "/about",
    children: [
      {
        label: "আমাদের সম্পর্কে",
        labelEn: "About Us",
        href: "/about",
        description: "প্রতিষ্ঠানের ইতিহাস ও মিশন",
        iconName: "building",
      },
      {
        label: "গ্যালারি",
        labelEn: "Gallery",
        href: "/gallery",
        description: "প্রশিক্ষণ ও ইভেন্টের ছবি",
        iconName: "camera",
      },
      {
        label: "সাফল্যের গল্প",
        labelEn: "Success Stories",
        href: "/stories",
        description: "সফল শিক্ষার্থীদের অভিজ্ঞতা",
        iconName: "message",
      },
      {
        label: "ব্লগ / সংবাদ",
        labelEn: "Blog / News",
        href: "/blog",
        description: "সাম্প্রতিক খবর ও আপডেট",
        iconName: "megaphone",
      },
      {
        label: "ইভেন্ট",
        labelEn: "Events",
        href: "/events",
        description: "সেমিনার, ওয়ার্কশপ ও কার্যক্রম",
        iconName: "calendar",
      },
      {
        label: "ডাউনলোড সেন্টার",
        labelEn: "Downloads",
        href: "/downloads",
        description: "সিলেবাস, ব্রোশিউর ও ফরম",
        iconName: "clipboard",
      },
      {
        label: "নোটিশ বোর্ড",
        labelEn: "Notice Board",
        href: "/notices",
        description: "ভর্তি বিজ্ঞপ্তি, ফলাফল ও ঘোষণা",
        iconName: "clipboard",
      },
    ],
  },
  {
    label: "যোগাযোগ",
    labelEn: "Contact",
    href: "/contact",
  },
];

export const hubNav = [
  { label: "ড্যাশবোর্ড", labelEn: "Dashboard", href: "/hub", icon: "home" },
  { label: "আমার কোর্স", labelEn: "My Courses", href: "/hub/courses", icon: "book" },
  { label: "আবেদনসমূহ", labelEn: "Applications", href: "/hub/applications", icon: "clipboard" },
  { label: "প্রোফাইল", labelEn: "Profile", href: "/hub/profile", icon: "users" },
];
