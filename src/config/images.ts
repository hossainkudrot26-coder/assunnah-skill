/**
 * Centralized image URLs — replace Unsplash URLs with real photos later.
 * Simply swap the `src` values; no other code changes needed.
 */

export const images = {
  /* ──────── HERO ──────── */
  hero: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80&fit=crop",

  /* ──────── GALLERY ──────── */
  gallery: {
    computerLab: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80&fit=crop",
    certificate: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80&fit=crop",
    tailoring: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80&fit=crop",
    orientation: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop",
    chefTraining: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80&fit=crop",
    campus: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80&fit=crop",
    discussion: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fit=crop",
    driving: "https://images.unsplash.com/photo-1449965408869-ebd13bc0e2d3?w=800&q=80&fit=crop",
    annual: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&fit=crop",
  },

  /* ──────── COURSES ──────── */
  courses: {
    business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&fit=crop",
    chef: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fit=crop",
    sales: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&fit=crop",
    tailoring: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&q=80&fit=crop",
    shoe: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80&fit=crop",
    driving: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80&fit=crop",
  },

  /* ──────── ABOUT ──────── */
  about: {
    campus: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80&fit=crop",
    students: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&fit=crop",
  },

  /* ──────── BLOG ──────── */
  blog: {
    admission: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&fit=crop",
    nsda: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&fit=crop",
    success: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
    scholarship: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80&fit=crop",
    newBranch: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&fit=crop",
    webdev: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&fit=crop",
  },
} as const;

/** Slug → course image mapping */
export const courseImageMap: Record<string, string> = {
  "small-business-management": images.courses.business,
  "chef-training": images.courses.chef,
  "sales-and-marketing": images.courses.sales,
  "smart-tailoring": images.courses.tailoring,
  "shoe-entrepreneurship": images.courses.shoe,
  "driving-training": images.courses.driving,
};
