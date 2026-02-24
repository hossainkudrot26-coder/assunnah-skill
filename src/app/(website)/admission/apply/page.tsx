"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { submitApplication } from "@/lib/actions/application";
import { getPublishedCourses } from "@/lib/actions/data";
import { PageHeader } from "@/shared/components/PageHeader";
import {
  CheckCircleIcon, ArrowRightIcon, ClipboardIcon,
} from "@/shared/components/Icons";
import styles from "./apply.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  { label: "কোর্স নির্বাচন", step: 1 },
  { label: "ব্যক্তিগত তথ্য", step: 2 },
  { label: "শিক্ষাগত তথ্য", step: 3 },
  { label: "নিশ্চিতকরণ", step: 4 },
];

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    courseId: "",
    applicantName: "",
    applicantPhone: "",
    applicantEmail: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "" as "" | "MALE" | "FEMALE",
    nidNumber: "",
    address: "",
    education: "",
    experience: "",
    motivation: "",
  });

  useEffect(() => {
    getPublishedCourses().then(setCourses);
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (currentStep === 1 && !form.courseId) { setError("কোর্স নির্বাচন করুন"); return; }
    if (currentStep === 2 && (!form.applicantName || !form.applicantPhone)) { setError("নাম ও ফোন নম্বর আবশ্যক"); return; }
    setError("");
    setCurrentStep((s) => Math.min(s + 1, 4));
  }

  function prevStep() {
    setError("");
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const result = await submitApplication({
        courseId: form.courseId,
        applicantName: form.applicantName,
        applicantPhone: form.applicantPhone,
        applicantEmail: form.applicantEmail || undefined,
        fatherName: form.fatherName || undefined,
        motherName: form.motherName || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: (form.gender || undefined) as any,
        nidNumber: form.nidNumber || undefined,
        address: form.address || undefined,
        education: form.education || undefined,
        experience: form.experience || undefined,
        motivation: form.motivation || undefined,
      });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "সমস্যা হয়েছে");
      }
    } catch {
      setError("আবেদন জমা দিতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  const selectedCourse = courses.find((c) => c.id === form.courseId);

  if (success) {
    return (
      <>
        <PageHeader
          title="আবেদন সফল!"
          subtitle="আপনার আবেদন সফলভাবে জমা হয়েছে"
          breadcrumbs={[{ label: "হোম", href: "/" }, { label: "ভর্তি", href: "/admission" }, { label: "আবেদন" }]}
          badge={{ icon: <CheckCircleIcon size={14} color="var(--color-secondary-300)" />, text: "সফল" }}
        />
        <section className={styles.successSection}>
          <motion.div
            className={styles.successCard}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className={styles.successIcon}>
              <CheckCircleIcon size={56} color="var(--color-primary-500)" />
            </div>
            <h2>আলহামদুলিল্লাহ!</h2>
            <p>আপনার আবেদন সফলভাবে জমা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।</p>
            <div className={styles.successActions}>
              <Link href="/" className={styles.successBtn}>হোমপেজে যান</Link>
              <Link href="/courses" className={styles.successBtnOutline}>কোর্স দেখুন</Link>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="অনলাইন আবেদন"
        subtitle="ফর্মটি পূরণ করুন — আমরা শীঘ্রই যোগাযোগ করবো"
        breadcrumbs={[{ label: "হোম", href: "/" }, { label: "ভর্তি", href: "/admission" }, { label: "আবেদন" }]}
        badge={{ icon: <ClipboardIcon size={14} color="var(--color-secondary-300)" />, text: "আবেদন ফর্ম" }}
      />

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrapper}>
            {/* Step Indicator */}
            <div className={styles.stepIndicator}>
              {steps.map((s) => (
                <div key={s.step} className={`${styles.stepDot} ${currentStep >= s.step ? styles.stepActive : ""}`}>
                  <span className={styles.stepNum}>{s.step}</span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </div>
              ))}
              <div className={styles.stepLine}>
                <div className={styles.stepProgress} style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
              </div>
            </div>

            {error && (
              <div className={styles.errorMsg}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Course Selection */}
                {currentStep === 1 && (
                  <div className={styles.stepContent}>
                    <h3>কোন কোর্সে ভর্তি হতে চান?</h3>
                    <div className={styles.courseGrid}>
                      {courses.map((course) => (
                        <button
                          key={course.id}
                          className={`${styles.courseOption} ${form.courseId === course.id ? styles.courseSelected : ""}`}
                          onClick={() => update("courseId", course.id)}
                          type="button"
                        >
                          <div className={styles.courseDot} style={{ background: course.color }} />
                          <div>
                            <strong>{course.title}</strong>
                            <span>{course.duration} | {course.type}</span>
                          </div>
                          {form.courseId === course.id && (
                            <CheckCircleIcon size={20} color="var(--color-primary-500)" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Info */}
                {currentStep === 2 && (
                  <div className={styles.stepContent}>
                    <h3>ব্যক্তিগত তথ্য</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>পূর্ণ নাম *</label>
                        <input type="text" value={form.applicantName} onChange={(e) => update("applicantName", e.target.value)} placeholder="আপনার পূর্ণ নাম" required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>ফোন নম্বর *</label>
                        <input type="tel" value={form.applicantPhone} onChange={(e) => update("applicantPhone", e.target.value)} placeholder="০১XXXXXXXXX" required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>ইমেইল</label>
                        <input type="email" value={form.applicantEmail} onChange={(e) => update("applicantEmail", e.target.value)} placeholder="example@email.com" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>লিঙ্গ</label>
                        <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                          <option value="">নির্বাচন করুন</option>
                          <option value="MALE">পুরুষ</option>
                          <option value="FEMALE">মহিলা</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>জন্ম তারিখ</label>
                        <input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>NID / জন্ম নিবন্ধন নম্বর</label>
                        <input type="text" value={form.nidNumber} onChange={(e) => update("nidNumber", e.target.value)} placeholder="NID নম্বর" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>পিতার নাম</label>
                        <input type="text" value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} placeholder="পিতার পূর্ণ নাম" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>মাতার নাম</label>
                        <input type="text" value={form.motherName} onChange={(e) => update("motherName", e.target.value)} placeholder="মাতার পূর্ণ নাম" />
                      </div>
                      <div className={styles.formGroupFull}>
                        <label>ঠিকানা</label>
                        <textarea value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="বর্তমান ঠিকানা" rows={2} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Education */}
                {currentStep === 3 && (
                  <div className={styles.stepContent}>
                    <h3>শিক্ষাগত ও অভিজ্ঞতা</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroupFull}>
                        <label>সর্বশেষ শিক্ষাগত যোগ্যতা</label>
                        <select value={form.education} onChange={(e) => update("education", e.target.value)}>
                          <option value="">নির্বাচন করুন</option>
                          <option value="PSC">প্রাথমিক (PSC)</option>
                          <option value="JSC">JSC / JDC</option>
                          <option value="SSC">SSC / দাখিল</option>
                          <option value="HSC">HSC / আলিম</option>
                          <option value="Honours">অনার্স / ফাজিল</option>
                          <option value="Masters">মাস্টার্স / কামিল</option>
                          <option value="Other">অন্যান্য</option>
                        </select>
                      </div>
                      <div className={styles.formGroupFull}>
                        <label>পূর্ব অভিজ্ঞতা (যদি থাকে)</label>
                        <textarea value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="সংশ্লিষ্ট কোনো কাজের অভিজ্ঞতা থাকলে লিখুন" rows={3} />
                      </div>
                      <div className={styles.formGroupFull}>
                        <label>কেন এই কোর্সে ভর্তি হতে চান?</label>
                        <textarea value={form.motivation} onChange={(e) => update("motivation", e.target.value)} placeholder="আপনার আগ্রহ ও লক্ষ্য সম্পর্কে কিছু লিখুন" rows={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {currentStep === 4 && (
                  <div className={styles.stepContent}>
                    <h3>আবেদন পর্যালোচনা</h3>
                    <div className={styles.reviewCard}>
                      <div className={styles.reviewRow}>
                        <span>কোর্স</span>
                        <strong>{selectedCourse?.title || "—"}</strong>
                      </div>
                      <div className={styles.reviewRow}>
                        <span>নাম</span>
                        <strong>{form.applicantName || "—"}</strong>
                      </div>
                      <div className={styles.reviewRow}>
                        <span>ফোন</span>
                        <strong>{form.applicantPhone || "—"}</strong>
                      </div>
                      {form.applicantEmail && (
                        <div className={styles.reviewRow}>
                          <span>ইমেইল</span>
                          <strong>{form.applicantEmail}</strong>
                        </div>
                      )}
                      {form.education && (
                        <div className={styles.reviewRow}>
                          <span>শিক্ষা</span>
                          <strong>{form.education}</strong>
                        </div>
                      )}
                      {form.address && (
                        <div className={styles.reviewRow}>
                          <span>ঠিকানা</span>
                          <strong>{form.address}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={styles.formNav}>
              {currentStep > 1 && (
                <button type="button" className={styles.prevBtn} onClick={prevStep}>
                  পিছনে যান
                </button>
              )}
              <div style={{ flex: 1 }} />
              {currentStep < 4 ? (
                <button type="button" className={styles.nextBtn} onClick={nextStep}>
                  পরবর্তী
                  <ArrowRightIcon size={14} color="white" />
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
