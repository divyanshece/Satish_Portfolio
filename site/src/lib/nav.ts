/**
 * The site's navigation, in one place, so the header and the footer can
 * never disagree about what the site contains.
 */
export interface NavItem {
  href: string;
  label: string;
}

/** The primary sections, in the order they appear in the header. */
export const NAV: NavItem[] = [
  /* Research and publications are one page. The label keeps the word
     "publications" because that is the word academics scan a header for. */
  { href: "/research/",     label: "Research & Publications" },
  { href: "/products/",     label: "Products" },
  /* Courses and the people he supervises are one page; the label keeps the
     word "students" because that is what a prospective applicant searches. */
  { href: "/students/",     label: "Teaching & Students" },
  { href: "/group/",        label: "RAFT" },
  { href: "/about/",        label: "About" },
];

/** Pages that live below the fold of the site: linked from the footer only. */
export const MORE: NavItem[] = [
  { href: "/join/", label: "Join the group" },
];

/**
 * Things that used to be pages of their own. The September 2026 merges put
 * them inside longer pages — publications into /research/, courses into
 * /students/, funded projects and contact into /about/ — so the footer is
 * where they stay one click away.
 */
export const SECTIONS: NavItem[] = [
  { href: "/research/#publications", label: "Publications" },
  { href: "/students/#courses",      label: "Courses" },
  { href: "/about/#h-projects",      label: "Funded projects" },
  { href: "/about/#h-contact",       label: "Contact" },
];

export const isCurrent = (pathname: string, href: string) =>
  pathname === href || (href !== "/" && pathname.startsWith(href));
