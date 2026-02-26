"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getCourseBySlug, getRelatedCourses, type Course } from "@/config/courses";
import { courseImageMap } from "@/config/images";
import { getBlurPlaceholder } from "@/lib/image-utils";
import { PageHeader } from "@/shared/components/PageHeader";
import { Accordion, AccordionItem } from "@/shared/components/Accordion";
import {
  BriefcaseIcon, ChefHatIcon, ChartIcon, ScissorsIcon,
  ShoeIcon, CarIcon, ClockIcon, ArrowRightIcon, UsersIcon,
  CheckCircleIcon, BookIcon, AwardIcon, CalendarIcon,
  TargetIcon, GraduationIcon, ShieldCheckIcon, TrophyIcon,
  UserIcon, PlayIcon, ArrowLeftIcon, MailIcon,
} from "@/shared/components/Icons";
import styles from "./course-detail.module.css";

const iconMap: Record<string, (s: number, c: string) => React.ReactNode> = {
  BriefcaseIcon: (s, c) => <BriefcaseIcon size={s} color={c} />,
  ChefHatIcon: (s, c) => <ChefHatIcon size={s} color={c} />,
  ChartIcon: (s, c) => <ChartIcon size={s} color={c} />,
  ScissorsIcon: (s, c) => <ScissorsIcon size={s} color={c} />,
  ShoeIcon: (s, c) => <ShoeIcon size={s} color={c} />,
  CarIcon: (s, c) => <CarIcon size={s} color={c} />,
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = getCourseBySlug(slug);

  if (!course) {
    return (
      <div className={styles.notFound}>
        <h1>কোর্স পাওয়া যায়নি</h1>
        <p>দুঃখিত, আপনি যে কোর্সটি খুঁজছেন সেটি পাওয়া যায়নি।</p>
        <Link href="/courses" className="btn btn-primary">সকল কোর্স দেখুন</Link>
      </div>
    );
  }

  const relatedCourses = getRelatedCourses(slug, 3);
  const renderIcon = iconMap[course.iconName];

  return (
    <>
      <PageHeader
        badge={course.type}
        badgeIcon={renderIcon ? renderIcon(14, "var(--color-secondary-400)") : <BookIcon size={14} color="var(--color-secondary-400)" />}
        title={course.title}
        subtitle={course.fullDesc}
        breadcrumbs={[
          { label: "কোর্সসমূহ", href: "/courses" },
          { label: course.title },
        ]}
      />

      {/* Course Hero Image */}
      {courseImageMap[course.slug] && (
        <section className={styles.courseImageSection}>
          <div className="container">
            <motion.div
              className={styles.courseImageWrap}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={courseImageMap[course.slug]}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className={styles.courseImage}
                priority
                placeholder="blur"
                blurDataURL={getBlurPlaceholder(1200, 460)}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Video Preview (when available) */}
      {course.videoPreviewUrl && (
        <section className={styles.videoSection}>
          <div className="container">
            <motion.div
              className={styles.videoWrap}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <iframe
                src={course.videoPreviewUrl}
                title={`${course.title} প্রিভিউ`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                className={styles.videoIframe}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Row */}
      <section className={styles.statsSection}>
        <div className="container">
          <motion.div
            className={styles.statsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.statCard} variants={fadeUp}>
              <ClockIcon size={24} color="var(--color-primary-500)" />
              <div>
                <strong>{course.duration}</strong>
                <span>সময়কাল</span>
              </div>
            </motion.div>
            <motion.div className={styles.statCard} variants={fadeUp}>
              <CalendarIcon size={24} color="var(--color-primary-500)" />
              <div>
                <strong>{course.type}</strong>
                <span>ধরন</span>
              </div>
            </motion.div>
            <motion.div className={styles.statCard} variants={fadeUp}>
              <UsersIcon size={24} color="var(--color-primary-500)" />
              <div>
                <strong>সীমিত</strong>
                <span>আসন সংখ্যা</span>
              </div>
            </motion.div>
            <motion.div className={styles.statCard} variants={fadeUp}>
              <AwardIcon size={24} color="var(--color-accent-500)" />
              <div>
                <strong>{course.fee.scholarship}</strong>
                <span>স্কলারশিপ</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Success Rate Banner */}
      <section className={styles.successBanner}>
        <div className="container">
          <div className={styles.successInner}>
            <div className={styles.successStat}>
              <TrophyIcon size={28} color="var(--color-accent-400)" />
              <div>
                <strong>৮৫%+</strong>
                <span>গ্র্যাজুয়েটদের কর্মসংস্থান হয়েছে</span>
              </div>
            </div>
            <div className={styles.successDivider} />
            <div className={styles.successStat}>
              <GraduationIcon size={28} color="var(--color-secondary-400)" />
              <div>
                <strong>NSDA</strong>
                <span>স্বীকৃত সার্টিফিকেট প্রদান করা হয়</span>
              </div>
            </div>
            <div className={styles.successDivider} />
            <div className={styles.successStat}>
              <ShieldCheckIcon size={28} color="var(--color-primary-400)" />
              <div>
                <strong>২৪/৭</strong>
                <span>মেন্টর সাপোর্ট পাবেন</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Profiles */}
      {course.instructors && course.instructors.length > 0 && (
        <section className={`section ${styles.instructorsSection}`}>
          <div className="container">
            <div className="section-header">
              <span className="section-badge">
                <UserIcon size={14} color="var(--color-primary-600)" />
                প্রশিক্ষকবৃন্দ
              </span>
              <h2 className="heading-md">অভিজ্ঞ <span className="gradient-text">প্রশিক্ষকদের</span> তত্ত্বাবধানে</h2>
            </div>
            <motion.div
              className={styles.instructorsGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {course.instructors.map((inst, i) => (
                <motion.div key={i} className={styles.instructorCard} variants={fadeUp}>
                  <div className={styles.instructorAvatar} style={{ borderColor: `${course.color}40` }}>
                    <span style={{ color: course.color }}>{inst.initials}</span>
                  </div>
                  <div className={styles.instructorInfo}>
                    <h3>{inst.name}</h3>
                    <p className={styles.instructorRole}>{inst.role}</p>
                    <p className={styles.instructorBio}>{inst.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Batch Schedule Table */}
      {course.batchSchedule && course.batchSchedule.length > 0 && (
        <section className={`section ${styles.batchSection}`}>
          <div className="container">
            <div className="section-header">
              <span className="section-badge">
                <CalendarIcon size={14} color="var(--color-primary-600)" />
                ব্যাচ সিডিউল
              </span>
              <h2 className="heading-md">আসন্ন <span className="gradient-text">ব্যাচসমূহ</span></h2>
            </div>
            <motion.div
              className={styles.scheduleTableWrap}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>ব্যাচ</th>
                    <th>শুরু</th>
                    <th>সমাপ্তি</th>
                    <th>আসন</th>
                    <th>অবস্থা</th>
                  </tr>
                </thead>
                <tbody>
                  {course.batchSchedule.map((bs, i) => (
                    <tr key={i} className={bs.status === "ভর্তি চলছে" ? styles.batchHighlight : ""}>
                      <td><strong>{bs.batch}</strong></td>
                      <td>{bs.startDate}</td>
                      <td>{bs.endDate}</td>
                      <td>{bs.seats} জন</td>
                      <td>
                        <span className={`${styles.batchStatus} ${styles[`status_${bs.status === "চলমান" ? "active" : bs.status === "ভর্তি চলছে" ? "open" : bs.status === "আসন্ন" ? "upcoming" : "done"}`]}`}>
                          {bs.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>
      )}

      {/* Syllabus + Download */}
      <section className={`section ${styles.syllabusSection}`}>
        <div className="container">
          <div className={styles.twoCol}>
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div className={styles.sectionLabel} variants={fadeUp}>
                  <BookIcon size={15} color="var(--color-primary-600)" />
                  <span>সিলেবাস</span>
                </motion.div>
                <motion.h2 className="heading-md" variants={fadeUp}>
                  কী কী <span className="gradient-text">শিখবেন</span>
                </motion.h2>
                <motion.p className={styles.sectionSubtext} variants={fadeUp}>
                  এই কোর্সের বিস্তারিত পাঠ্যক্রম ও বিষয়সমূহ
                </motion.p>
              </motion.div>

              {/* Download Syllabus Button */}
              <motion.div
                className={styles.downloadBtnWrap}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <button className={styles.downloadBtn} onClick={() => window.print()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  সিলেবাস ডাউনলোড (PDF)
                </button>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                style={{ marginTop: "var(--space-6)" }}
              >
                <Accordion>
                  {course.syllabus.map((module, i) => (
                    <AccordionItem
                      key={i}
                      title={`${i + 1}. ${module.title}`}
                      defaultOpen={i === 0}
                      icon={<BookIcon size={15} color="var(--color-primary-500)" />}
                    >
                      <ul className={styles.topicList}>
                        {module.topics.map((topic, j) => (
                          <li key={j}>
                            <CheckCircleIcon size={14} color="var(--color-primary-500)" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>

            {/* Side Panel */}
            <div className={styles.sidePanel}>
              {/* Requirements */}
              <motion.div
                className={styles.sideCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3>
                  <TargetIcon size={18} color="var(--color-primary-500)" />
                  প্রয়োজনীয়তা
                </h3>
                <ul>
                  {course.requirements.map((r, i) => (
                    <li key={i}>
                      <CheckCircleIcon size={14} color="var(--color-primary-400)" />
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Outcomes */}
              <motion.div
                className={styles.sideCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3>
                  <GraduationIcon size={18} color="var(--color-primary-500)" />
                  ফলাফল ও সুবিধা
                </h3>
                <ul>
                  {course.outcomes.map((o, i) => (
                    <li key={i}>
                      <CheckCircleIcon size={14} color="var(--color-secondary-600)" />
                      {o}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Fee Info */}
              <motion.div
                className={styles.sideCardAccent}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h3>
                  <AwardIcon size={18} color="var(--color-accent-500)" />
                  ফি ও স্কলারশিপ
                </h3>
                <div className={styles.feeInfo}>
                  <div>
                    <span>ভর্তি ফি</span>
                    <strong>{course.fee.admission}</strong>
                  </div>
                  <div>
                    <span>মোট খরচ</span>
                    <strong>{course.fee.total}</strong>
                  </div>
                  <div>
                    <span>স্কলারশিপ</span>
                    <strong>{course.fee.scholarship}</strong>
                  </div>
                </div>
              </motion.div>

              {/* Batch Info */}
              <motion.div
                className={styles.sideCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <h3>
                  <CalendarIcon size={18} color="var(--color-primary-500)" />
                  ব্যাচ তথ্য
                </h3>
                <p className={styles.batchText}>{course.batchInfo}</p>
                <div className={styles.admissionBadge}>
                  <ShieldCheckIcon size={14} color="var(--color-secondary-500)" />
                  ভর্তি চলছে
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Course-Specific FAQ */}
      {course.faqs && course.faqs.length > 0 && (
        <section className={`section ${styles.faqSection}`}>
          <div className="container">
            <div className="section-header">
              <span className="section-badge">
                <BookIcon size={14} color="var(--color-primary-600)" />
                সাধারণ জিজ্ঞাসা
              </span>
              <h2 className="heading-md">এই কোর্স সম্পর্কে <span className="gradient-text">প্রশ্নোত্তর</span></h2>
            </div>
            <motion.div
              className={styles.faqGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <Accordion>
                {course.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    title={faq.question}
                    defaultOpen={i === 0}
                    icon={<CheckCircleIcon size={15} color="var(--color-primary-500)" />}
                  >
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`section section-dark ${styles.ctaSection}`}>
        <div className="container" style={{ textAlign: "center" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 className="heading-md" style={{ color: "white", marginBottom: "var(--space-4)" }} variants={fadeUp}>
              <span className="gradient-text">{course.title}</span>-এ ভর্তি হন
            </motion.h2>
            <motion.p
              style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "0 auto var(--space-8)" }}
              variants={fadeUp}
            >
              আজই ভর্তি হয়ে আপনার দক্ষতার যাত্রা শুরু করুন
            </motion.p>
            <motion.div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }} variants={fadeUp}>
              <Link href="/admission" className="btn btn-accent btn-lg">
                <ArrowRightIcon size={16} color="var(--color-dark-bg)" />
                এখনই ভর্তি হন
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: "white", color: "white" }}>
                যোগাযোগ করুন
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className={`section ${styles.relatedSection}`}>
          <div className="container">
            <h2 className="heading-md" style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
              সম্পর্কিত <span className="gradient-text">কোর্সসমূহ</span>
            </h2>
            <div className={styles.relatedGrid}>
              {relatedCourses.map((rc) => {
                const rcIcon = iconMap[rc.iconName];
                return (
                  <Link key={rc.slug} href={`/courses/${rc.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedCardIcon} style={{ background: `${rc.color}10`, borderColor: `${rc.color}22` }}>
                      {rcIcon ? rcIcon(24, rc.color) : null}
                    </div>
                    <h3>{rc.title}</h3>
                    <p>{rc.shortDesc}</p>
                    <span className={styles.relatedCardMeta}>
                      <ClockIcon size={13} color="var(--color-neutral-400)" />
                      {rc.duration}
                      <ArrowRightIcon size={13} color="var(--color-primary-500)" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
