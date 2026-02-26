"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/config/courses";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon, TargetIcon,
  GraduationIcon, BriefcaseIcon, ChefHatIcon, ChartIcon,
  ScissorsIcon, ShoeIcon, CarIcon, BookIcon, SparkleIcon,
} from "@/shared/components/Icons";
import styles from "./quiz.module.css";

interface QuizOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface QuizStep {
  id: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const quizSteps: QuizStep[] = [
  {
    id: "gender",
    question: "আপনি কি?",
    subtitle: "আমাদের কিছু কোর্স লিঙ্গ-নির্দিষ্ট",
    options: [
      { label: "পুরুষ", value: "male" },
      { label: "নারী", value: "female" },
    ],
  },
  {
    id: "education",
    question: "আপনার শিক্ষাগত যোগ্যতা কী?",
    subtitle: "এটি আপনার জন্য উপযুক্ত কোর্স নির্ধারণ করতে সাহায্য করবে",
    options: [
      { label: "অষ্টম শ্রেণি বা তদূর্ধ্ব", value: "class8" },
      { label: "SSC / দাখিল", value: "ssc" },
      { label: "HSC / আলিম", value: "hsc" },
      { label: "স্নাতক বা তদূর্ধ্ব", value: "graduate" },
    ],
  },
  {
    id: "interest",
    question: "কোন ধরনের কাজে আপনার আগ্রহ?",
    subtitle: "আপনার আগ্রহের ক্ষেত্র বাছাই করুন",
    options: [
      { label: "কম্পিউটার ও ডিজিটাল", value: "digital", icon: <BriefcaseIcon size={20} color="var(--color-primary-500)" /> },
      { label: "রান্না ও খাদ্য", value: "cooking", icon: <ChefHatIcon size={20} color="#E65100" /> },
      { label: "ব্যবসা ও মার্কেটিং", value: "business", icon: <ChartIcon size={20} color="#1565C0" /> },
      { label: "হস্তশিল্প ও সেলাই", value: "craft", icon: <ScissorsIcon size={20} color="#AD1457" /> },
      { label: "টেকনিক্যাল / মেকানিক্যাল", value: "technical", icon: <CarIcon size={20} color="#2E7D32" /> },
      { label: "ভাষা ও নেতৃত্ব", value: "language", icon: <BookIcon size={20} color="#0277BD" /> },
    ],
  },
  {
    id: "goal",
    question: "আপনার প্রধান লক্ষ্য কী?",
    subtitle: "কোর্স শেষে আপনি কী করতে চান?",
    options: [
      { label: "চাকরি পেতে চাই", value: "job" },
      { label: "নিজের ব্যবসা শুরু করতে চাই", value: "business" },
      { label: "ফ্রিল্যান্সিং করতে চাই", value: "freelance" },
      { label: "দক্ষতা বাড়াতে চাই", value: "skill" },
    ],
  },
  {
    id: "budget",
    question: "আপনার বাজেট কেমন?",
    subtitle: "আমাদের অনেক কোর্স সম্পূর্ণ বিনামূল্যে",
    options: [
      { label: "সম্পূর্ণ ফ্রি চাই", value: "free" },
      { label: "স্কলারশিপ পেলে ভালো", value: "scholarship" },
      { label: "পেইড কোর্সেও সমস্যা নেই", value: "paid" },
    ],
  },
];

// Scoring logic: each answer adds weight to relevant courses
function getRecommendations(answers: Record<string, string>) {
  const scores: Record<string, number> = {};
  courses.forEach((c) => { scores[c.slug] = 0; });

  // Gender filter
  if (answers.gender === "female") {
    courses.forEach((c) => {
      if (c.category === "শুধুমাত্র পুরুষ") scores[c.slug] -= 100;
      if (c.category === "শুধুমাত্র নারী") scores[c.slug] += 20;
    });
  } else if (answers.gender === "male") {
    courses.forEach((c) => {
      if (c.category === "শুধুমাত্র নারী") scores[c.slug] -= 100;
    });
  }

  // Interest mapping
  const interestMap: Record<string, string[]> = {
    digital: ["small-business-management", "web-development", "art-of-creation"],
    cooking: ["chef-training"],
    business: ["sales-and-marketing", "small-business-management"],
    craft: ["smart-tailoring", "shoe-entrepreneurship"],
    technical: ["automotive-technology", "driving-training"],
    language: ["language-leadership"],
  };
  if (answers.interest && interestMap[answers.interest]) {
    interestMap[answers.interest].forEach((slug) => { scores[slug] = (scores[slug] || 0) + 30; });
  }

  // Budget
  if (answers.budget === "free") {
    courses.forEach((c) => {
      if (c.fee.total.includes("বিনামূল্যে") || c.fee.total.includes("ফ্রি")) scores[c.slug] += 15;
    });
  }

  // Goal
  if (answers.goal === "freelance") {
    ["web-development", "small-business-management", "art-of-creation"].forEach((s) => { scores[s] = (scores[s] || 0) + 10; });
  } else if (answers.goal === "business") {
    ["small-business-management", "sales-and-marketing", "smart-tailoring", "shoe-entrepreneurship"].forEach((s) => { scores[s] = (scores[s] || 0) + 10; });
  }

  // Education filter (soft)
  if (answers.education === "class8") {
    ["smart-tailoring", "shoe-entrepreneurship", "automotive-technology", "driving-training", "chef-training"].forEach((s) => { scores[s] = (scores[s] || 0) + 5; });
  } else if (answers.education === "graduate") {
    ["sales-and-marketing", "language-leadership", "web-development"].forEach((s) => { scores[s] = (scores[s] || 0) + 5; });
  }

  // Sort and filter out negative scores
  return courses
    .filter((c) => (scores[c.slug] || 0) > -50)
    .sort((a, b) => (scores[b.slug] || 0) - (scores[a.slug] || 0))
    .slice(0, 3);
}

const iconMap: Record<string, (s: number, c: string) => React.ReactNode> = {
  BriefcaseIcon: (s, c) => <BriefcaseIcon size={s} color={c} />,
  ChefHatIcon: (s, c) => <ChefHatIcon size={s} color={c} />,
  ChartIcon: (s, c) => <ChartIcon size={s} color={c} />,
  ScissorsIcon: (s, c) => <ScissorsIcon size={s} color={c} />,
  ShoeIcon: (s, c) => <ShoeIcon size={s} color={c} />,
  CarIcon: (s, c) => <CarIcon size={s} color={c} />,
};

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  const handleSelect = (value: string) => {
    const step = quizSteps[currentStep];
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => setCurrentStep((p) => p + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  const recommendations = useMemo(() => {
    if (!showResults) return [];
    return getRecommendations(answers);
  }, [showResults, answers]);

  return (
    <>
      <PageHeader
        title="কোর্স ফাইন্ডার"
        subtitle="কয়েকটি সহজ প্রশ্নের উত্তর দিন — আমরা আপনার জন্য সেরা কোর্স খুঁজে দেবো"
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "কোর্স ফাইন্ডার" },
        ]}
        badge={{ icon: <SparkleIcon size={14} color="var(--color-secondary-300)" />, text: "কোর্স ফাইন্ডার" }}
      />

      <section className={`section ${styles.quizSection}`}>
        <div className="container">
          <div className={styles.quizContainer}>
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className={styles.quizCard}
                >
                  {/* Progress */}
                  <div className={styles.progressWrap}>
                    <div className={styles.progressBar}>
                      <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span className={styles.progressText}>
                      {currentStep + 1} / {quizSteps.length}
                    </span>
                  </div>

                  {/* Question */}
                  <h2 className={styles.question}>{quizSteps[currentStep].question}</h2>
                  <p className={styles.subtitle}>{quizSteps[currentStep].subtitle}</p>

                  {/* Options */}
                  <div className={styles.optionsGrid}>
                    {quizSteps[currentStep].options.map((opt) => (
                      <button
                        key={opt.value}
                        className={`${styles.optionBtn} ${answers[quizSteps[currentStep].id] === opt.value ? styles.optionSelected : ""}`}
                        onClick={() => handleSelect(opt.value)}
                      >
                        {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                        <span>{opt.label}</span>
                        {answers[quizSteps[currentStep].id] === opt.value && (
                          <CheckCircleIcon size={18} color="var(--color-primary-500)" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Nav */}
                  {currentStep > 0 && (
                    <button className={styles.backBtn} onClick={handleBack}>
                      <ArrowLeftIcon size={16} color="var(--color-neutral-500)" />
                      পেছনে যান
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={styles.resultsCard}
                >
                  <div className={styles.resultsHeader}>
                    <div className={styles.resultsIconBig}>
                      <TargetIcon size={32} color="var(--color-primary-500)" />
                    </div>
                    <h2>আপনার জন্য সেরা কোর্সসমূহ</h2>
                    <p>আপনার উত্তরের ভিত্তিতে আমরা এই কোর্সগুলো সুপারিশ করছি</p>
                  </div>

                  <div className={styles.resultsGrid}>
                    {recommendations.map((course, i) => {
                      const renderIcon = iconMap[course.iconName];
                      return (
                        <motion.div
                          key={course.slug}
                          className={styles.resultCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                        >
                          {i === 0 && <span className={styles.bestMatch}>সবচেয়ে উপযুক্ত</span>}
                          <div className={styles.resultCardIcon} style={{ background: `${course.color}12`, borderColor: `${course.color}25` }}>
                            {renderIcon ? renderIcon(28, course.color) : <GraduationIcon size={28} color={course.color} />}
                          </div>
                          <h3>{course.title}</h3>
                          <p className={styles.resultDesc}>{course.shortDesc}</p>
                          <div className={styles.resultMeta}>
                            <span>{course.duration}</span>
                            <span>{course.type}</span>
                            <span>{course.fee.scholarship}</span>
                          </div>
                          <Link href={`/courses/${course.slug}`} className={styles.resultBtn}>
                            বিস্তারিত দেখুন
                            <ArrowRightIcon size={14} color="white" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className={styles.resultsActions}>
                    <button className={styles.resetBtn} onClick={handleReset}>
                      <ArrowLeftIcon size={14} color="var(--color-primary-500)" />
                      আবার শুরু করুন
                    </button>
                    <Link href="/courses" className="btn btn-primary">
                      সকল কোর্স দেখুন
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
