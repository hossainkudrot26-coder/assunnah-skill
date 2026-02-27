"use client";

import { useEffect, useState, useCallback } from "react";
import { getSettings, setSettings } from "@/lib/actions/data";
import styles from "./settings.module.css";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface Partner {
  name: string;
  abbr: string;
  color: string;
  desc: string;
}

interface SectionState {
  institutionInfo: boolean;
  homepageStats: boolean;
  impactCounters: boolean;
  partners: boolean;
  seo: boolean;
}

/* ═══════════════════════════════════════════
   SETTING KEYS
   ═══════════════════════════════════════════ */

const ALL_KEYS = [
  "phone", "email", "address", "foundedYear",
  "trainedStudents", "activeCourses", "computerLabs", "onlineStudents", "campusArea", "scholarshipPercent",
  "trainedStudentsCount", "completedBatches", "employmentRate", "campusAreaSqft",
  "partners",
  "seo_title", "seo_description", "seo_keywords", "seo_ogImage",
];

/* ═══════════════════════════════════════════
   DEFAULTS
   ═══════════════════════════════════════════ */

const defaultPartners: Partner[] = [
  { name: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ", abbr: "NSDA", color: "#1B6B3A", desc: "সরকারি নিবন্ধন" },
  { name: "আস-সুন্নাহ ফাউন্ডেশন", abbr: "ASF", color: "#1B8A50", desc: "প্রতিষ্ঠাতা সংস্থা" },
  { name: "বাংলাদেশ কারিগরি শিক্ষা বোর্ড", abbr: "BTEB", color: "#1565C0", desc: "কারিগরি সনদ" },
  { name: "তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ", abbr: "ICT", color: "#7B1FA2", desc: "ডিজিটাল প্রশিক্ষণ" },
  { name: "যুব ও ক্রীড়া মন্ত্রণালয়", abbr: "MoYS", color: "#E65100", desc: "যুব উন্নয়ন" },
  { name: "সমাজসেবা অধিদপ্তর", abbr: "DSS", color: "#2E7D32", desc: "সামাজিক কল্যাণ" },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Section open/close
  const [sections, setSections] = useState<SectionState>({
    institutionInfo: true,
    homepageStats: false,
    impactCounters: false,
    partners: false,
    seo: false,
  });

  // Form data
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [foundedYear, setFoundedYear] = useState("");

  const [trainedStudents, setTrainedStudents] = useState("");
  const [activeCourses, setActiveCourses] = useState("");
  const [computerLabs, setComputerLabs] = useState("");
  const [onlineStudents, setOnlineStudents] = useState("");
  const [campusArea, setCampusArea] = useState("");
  const [scholarshipPercent, setScholarshipPercent] = useState("");

  const [trainedStudentsCount, setTrainedStudentsCount] = useState("");
  const [completedBatches, setCompletedBatches] = useState("");
  const [employmentRate, setEmploymentRate] = useState("");
  const [campusAreaSqft, setCampusAreaSqft] = useState("");

  const [partners, setPartners] = useState<Partner[]>(defaultPartners);

  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // Load settings
  useEffect(() => {
    (async () => {
      try {
        const data = await getSettings(ALL_KEYS);

        setPhone(data.phone ?? "");
        setEmail(data.email ?? "");
        setAddress(data.address ?? "");
        setFoundedYear(data.foundedYear ?? "");

        setTrainedStudents(data.trainedStudents ?? "");
        setActiveCourses(data.activeCourses ?? "");
        setComputerLabs(data.computerLabs ?? "");
        setOnlineStudents(data.onlineStudents ?? "");
        setCampusArea(data.campusArea ?? "");
        setScholarshipPercent(data.scholarshipPercent ?? "");

        setTrainedStudentsCount(data.trainedStudentsCount ?? "");
        setCompletedBatches(data.completedBatches ?? "");
        setEmploymentRate(data.employmentRate ?? "");
        setCampusAreaSqft(data.campusAreaSqft ?? "");

        if (data.partners && Array.isArray(data.partners)) {
          setPartners(data.partners);
        }

        setSeoTitle(data.seo_title ?? "");
        setSeoDescription(data.seo_description ?? "");
        setSeoKeywords(data.seo_keywords ?? "");
        setSeoOgImage(data.seo_ogImage ?? "");
      } catch {
        // Use defaults
      }
      setLoading(false);
    })();
  }, []);

  const toggleSection = (key: keyof SectionState) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Save functions per section
  const saveInstitutionInfo = async () => {
    setSaving((p) => ({ ...p, institutionInfo: true }));
    const result = await setSettings([
      { key: "phone", value: phone, type: "string" },
      { key: "email", value: email, type: "string" },
      { key: "address", value: address, type: "string" },
      { key: "foundedYear", value: foundedYear, type: "string" },
    ]);
    setSaving((p) => ({ ...p, institutionInfo: false }));
    if (result.success) {
      setSaved((p) => ({ ...p, institutionInfo: true }));
      setTimeout(() => setSaved((p) => ({ ...p, institutionInfo: false })), 2000);
      showToast("success", "প্রতিষ্ঠানের তথ্য সংরক্ষিত হয়েছে");
    } else {
      showToast("error", result.error || "সমস্যা হয়েছে");
    }
  };

  const saveHomepageStats = async () => {
    setSaving((p) => ({ ...p, homepageStats: true }));
    const result = await setSettings([
      { key: "trainedStudents", value: trainedStudents, type: "string" },
      { key: "activeCourses", value: activeCourses, type: "string" },
      { key: "computerLabs", value: computerLabs, type: "string" },
      { key: "onlineStudents", value: onlineStudents, type: "string" },
      { key: "campusArea", value: campusArea, type: "string" },
      { key: "scholarshipPercent", value: scholarshipPercent, type: "string" },
    ]);
    setSaving((p) => ({ ...p, homepageStats: false }));
    if (result.success) {
      setSaved((p) => ({ ...p, homepageStats: true }));
      setTimeout(() => setSaved((p) => ({ ...p, homepageStats: false })), 2000);
      showToast("success", "হোমপেজ পরিসংখ্যান সংরক্ষিত হয়েছে");
    } else {
      showToast("error", result.error || "সমস্যা হয়েছে");
    }
  };

  const saveImpactCounters = async () => {
    setSaving((p) => ({ ...p, impactCounters: true }));
    const result = await setSettings([
      { key: "trainedStudentsCount", value: trainedStudentsCount, type: "string" },
      { key: "completedBatches", value: completedBatches, type: "string" },
      { key: "employmentRate", value: employmentRate, type: "string" },
      { key: "campusAreaSqft", value: campusAreaSqft, type: "string" },
    ]);
    setSaving((p) => ({ ...p, impactCounters: false }));
    if (result.success) {
      setSaved((p) => ({ ...p, impactCounters: true }));
      setTimeout(() => setSaved((p) => ({ ...p, impactCounters: false })), 2000);
      showToast("success", "প্রভাব কাউন্টার সংরক্ষিত হয়েছে");
    } else {
      showToast("error", result.error || "সমস্যা হয়েছে");
    }
  };

  const savePartners = async () => {
    setSaving((p) => ({ ...p, partners: true }));
    const result = await setSettings([
      { key: "partners", value: partners, type: "json" },
    ]);
    setSaving((p) => ({ ...p, partners: false }));
    if (result.success) {
      setSaved((p) => ({ ...p, partners: true }));
      setTimeout(() => setSaved((p) => ({ ...p, partners: false })), 2000);
      showToast("success", "পার্টনার সংস্থা সংরক্ষিত হয়েছে");
    } else {
      showToast("error", result.error || "সমস্যা হয়েছে");
    }
  };

  // Partner helpers
  const updatePartner = (index: number, field: keyof Partner, value: string) => {
    setPartners((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addPartner = () => {
    setPartners((prev) => [...prev, { name: "", abbr: "", color: "#2E7D32", desc: "" }]);
  };

  const removePartner = (index: number) => {
    setPartners((prev) => prev.filter((_, i) => i !== index));
  };

  // SEO save
  const saveSeo = async () => {
    setSaving((p) => ({ ...p, seo: true }));
    const result = await setSettings([
      { key: "seo_title", value: seoTitle, type: "string" },
      { key: "seo_description", value: seoDescription, type: "string" },
      { key: "seo_keywords", value: seoKeywords, type: "string" },
      { key: "seo_ogImage", value: seoOgImage, type: "string" },
    ]);
    setSaving((p) => ({ ...p, seo: false }));
    if (result.success) {
      setSaved((p) => ({ ...p, seo: true }));
      setTimeout(() => setSaved((p) => ({ ...p, seo: false })), 2000);
      showToast("success", "SEO তথ্য সংরক্ষিত হয়েছে");
    } else {
      showToast("error", result.error || "সমস্যা হয়েছে");
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <span>সেটিংস লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Toast */}
      {message && (
        <div className={`${styles.toast} ${message.type === "error" ? styles.toastError : styles.toastSuccess}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>সাইট সেটিংস</h2>
          <span className={styles.headerDesc}>ওয়েবসাইটের সকল কনফিগারেশন এখান থেকে পরিবর্তন করুন</span>
        </div>
      </div>

      {/* ─── Section 1: Institution Info ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("institutionInfo")}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <div>
              <div className={styles.sectionTitle}>প্রতিষ্ঠানের তথ্য</div>
              <div className={styles.sectionCount}>ফোন, ইমেইল, ঠিকানা, প্রতিষ্ঠার বছর</div>
            </div>
          </div>
          <svg className={`${styles.sectionChevron} ${sections.institutionInfo ? styles.sectionChevronOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
        </div>
        <div className={`${styles.sectionBody} ${!sections.institutionInfo ? styles.sectionBodyHidden : ""}`}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ফোন নম্বর</label>
              <input className={styles.formInput} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ইমেইল</label>
              <input className={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@example.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>প্রতিষ্ঠার বছর</label>
              <input className={styles.formInput} value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="২০২২" />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>ঠিকানা</label>
              <textarea className={styles.formTextarea} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="প্রতিষ্ঠানের পূর্ণ ঠিকানা" rows={2} />
            </div>
          </div>
        </div>
        {sections.institutionInfo && (
          <div className={styles.sectionFooter}>
            {saved.institutionInfo && (
              <span className={styles.savedBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                সংরক্ষিত
              </span>
            )}
            <button className={styles.saveBtn} onClick={saveInstitutionInfo} disabled={saving.institutionInfo}>
              {saving.institutionInfo ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        )}
      </div>

      {/* ─── Section 2: Homepage Stats ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("homepageStats")}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="1.8">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <div className={styles.sectionTitle}>হোমপেজ পরিসংখ্যান</div>
              <div className={styles.sectionCount}>মার্কি ব্যানারের সংখ্যাগুলো (বাংলায় লিখুন)</div>
            </div>
          </div>
          <svg className={`${styles.sectionChevron} ${sections.homepageStats ? styles.sectionChevronOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
        </div>
        <div className={`${styles.sectionBody} ${!sections.homepageStats ? styles.sectionBodyHidden : ""}`}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>প্রশিক্ষিত শিক্ষার্থী</label>
              <input className={styles.formInput} value={trainedStudents} onChange={(e) => setTrainedStudents(e.target.value)} placeholder="২,৫০০+" />
              <span className={styles.formHint}>বাংলায় লিখুন, যেমন: ২,৫০০+</span>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>চালু কোর্স</label>
              <input className={styles.formInput} value={activeCourses} onChange={(e) => setActiveCourses(e.target.value)} placeholder="২০+" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>কম্পিউটার ল্যাব</label>
              <input className={styles.formInput} value={computerLabs} onChange={(e) => setComputerLabs(e.target.value)} placeholder="৭টি" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>অনলাইন শিক্ষার্থী</label>
              <input className={styles.formInput} value={onlineStudents} onChange={(e) => setOnlineStudents(e.target.value)} placeholder="১০,৯৬২+" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ক্যাম্পাস এলাকা</label>
              <input className={styles.formInput} value={campusArea} onChange={(e) => setCampusArea(e.target.value)} placeholder="২৪,০০০" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>স্কলারশিপ শতাংশ</label>
              <input className={styles.formInput} value={scholarshipPercent} onChange={(e) => setScholarshipPercent(e.target.value)} placeholder="১০০%" />
            </div>
          </div>
        </div>
        {sections.homepageStats && (
          <div className={styles.sectionFooter}>
            {saved.homepageStats && (
              <span className={styles.savedBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                সংরক্ষিত
              </span>
            )}
            <button className={styles.saveBtn} onClick={saveHomepageStats} disabled={saving.homepageStats}>
              {saving.homepageStats ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        )}
      </div>

      {/* ─── Section 3: Impact Counters ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("impactCounters")}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="1.8">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
              </svg>
            </div>
            <div>
              <div className={styles.sectionTitle}>প্রভাব কাউন্টার</div>
              <div className={styles.sectionCount}>অ্যানিমেটেড সংখ্যা (ইংরেজি সংখ্যায় লিখুন)</div>
            </div>
          </div>
          <svg className={`${styles.sectionChevron} ${sections.impactCounters ? styles.sectionChevronOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
        </div>
        <div className={`${styles.sectionBody} ${!sections.impactCounters ? styles.sectionBodyHidden : ""}`}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>প্রশিক্ষিত শিক্ষার্থী সংখ্যা</label>
              <input className={styles.formInput} type="number" value={trainedStudentsCount} onChange={(e) => setTrainedStudentsCount(e.target.value)} placeholder="2500" />
              <span className={styles.formHint}>ইংরেজি সংখ্যায়, যেমন: 2500</span>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>সম্পন্ন ব্যাচ</label>
              <input className={styles.formInput} type="number" value={completedBatches} onChange={(e) => setCompletedBatches(e.target.value)} placeholder="15" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>কর্মসংস্থান হার (%)</label>
              <input className={styles.formInput} type="number" value={employmentRate} onChange={(e) => setEmploymentRate(e.target.value)} placeholder="95" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ক্যাম্পাস এলাকা (sqft)</label>
              <input className={styles.formInput} type="number" value={campusAreaSqft} onChange={(e) => setCampusAreaSqft(e.target.value)} placeholder="24000" />
            </div>
          </div>
        </div>
        {sections.impactCounters && (
          <div className={styles.sectionFooter}>
            {saved.impactCounters && (
              <span className={styles.savedBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                সংরক্ষিত
              </span>
            )}
            <button className={styles.saveBtn} onClick={saveImpactCounters} disabled={saving.impactCounters}>
              {saving.impactCounters ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        )}
      </div>

      {/* ─── Section 4: Partners ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("partners")}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <div className={styles.sectionTitle}>পার্টনার সংস্থা</div>
              <div className={styles.sectionCount}>{partners.length} টি সংস্থা</div>
            </div>
          </div>
          <svg className={`${styles.sectionChevron} ${sections.partners ? styles.sectionChevronOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
        </div>
        <div className={`${styles.sectionBody} ${!sections.partners ? styles.sectionBodyHidden : ""}`}>
          <div className={styles.partnersList}>
            {partners.map((partner, i) => (
              <div key={i} className={styles.partnerItem}>
                <input
                  className={styles.partnerInput}
                  value={partner.name}
                  onChange={(e) => updatePartner(i, "name", e.target.value)}
                  placeholder="সংস্থার নাম"
                />
                <input
                  className={styles.partnerInput}
                  value={partner.abbr}
                  onChange={(e) => updatePartner(i, "abbr", e.target.value)}
                  placeholder="সংক্ষেপ"
                />
                <input
                  type="color"
                  className={styles.partnerColorInput}
                  value={partner.color}
                  onChange={(e) => updatePartner(i, "color", e.target.value)}
                  title="রঙ নির্বাচন"
                />
                <input
                  className={styles.partnerInput}
                  value={partner.desc}
                  onChange={(e) => updatePartner(i, "desc", e.target.value)}
                  placeholder="বিবরণ"
                />
                <button className={styles.removePartnerBtn} onClick={() => removePartner(i)} title="মুছে ফেলুন">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button className={styles.addPartnerBtn} onClick={addPartner}>
            + নতুন সংস্থা যোগ করুন
          </button>
        </div>
        {sections.partners && (
          <div className={styles.sectionFooter}>
            {saved.partners && (
              <span className={styles.savedBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                সংরক্ষিত
              </span>
            )}
            <button className={styles.saveBtn} onClick={savePartners} disabled={saving.partners}>
              {saving.partners ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        )}
      </div>

      {/* ─── Section 5: SEO ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection("seo")}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <div className={styles.sectionTitle}>SEO ও মেটা তথ্য</div>
              <div className={styles.sectionCount}>সার্চ ইঞ্জিনে সাইটের তথ্য</div>
            </div>
          </div>
          <svg className={`${styles.sectionChevron} ${sections.seo ? styles.sectionChevronOpen : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
        </div>
        <div className={`${styles.sectionBody} ${!sections.seo ? styles.sectionBodyHidden : ""}`}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>সাইট টাইটেল</label>
              <input className={styles.formInput} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট" />
              <span className={styles.formHint}>Google-এ সাইটের নামের জায়গায় দেখাবে</span>
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>মেটা ডেসক্রিপশন</label>
              <textarea className={styles.formTextarea} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="সার্চ রেজাল্টে সাইটের বিবরণ..." rows={3} />
              <span className={styles.formHint}>{seoDescription.length}/160 অক্ষর (আদর্শ: ১২০-১৬০)</span>
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>কীওয়ার্ডস</label>
              <textarea className={styles.formTextarea} value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="আস-সুন্নাহ, স্কিল ডেভেলপমেন্ট, প্রশিক্ষণ, কর্মসংস্থান" rows={2} />
              <span className={styles.formHint}>কমা দিয়ে আলাদা করুন</span>
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.formLabel}>OG ইমেজ URL (সোশ্যাল শেয়ার প্রিভিউ)</label>
              <input className={styles.formInput} value={seoOgImage} onChange={(e) => setSeoOgImage(e.target.value)} placeholder="https://example.com/og-image.png" />
              <span className={styles.formHint}>ফেসবুক/টুইটারে শেয়ার করলে এই ছবি দেখাবে (১২০০×৬৩০ আদর্শ)</span>
            </div>
          </div>
        </div>
        {sections.seo && (
          <div className={styles.sectionFooter}>
            {saved.seo && (
              <span className={styles.savedBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                সংরক্ষিত
              </span>
            )}
            <button className={styles.saveBtn} onClick={saveSeo} disabled={saving.seo}>
              {saving.seo ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
