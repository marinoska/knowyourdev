export const CATEGORY = ['Lang', 'DB', 'Framework', 'Tool', 'Other-FW', 'Cloud'] as const;
// CPM -cross-platform mobile,
// CV - computer vision,
// DA - desktop apps
export const TREND = ['SD', 'D', 'S', 'T', 'HT'] as const;  //string decline, decline, steady, trending, highly trending
export const SCOPE = ["BE", "FE", "FS", "MD", "DO", "SYS", "ANDR", "IOS", "CPM", "CMS", "CV", "AI", "ML", "DA"] as const;
export const SCOPE_NAMES: Record<ScopeType, string> = {
    BE: "Backend",
    FE: "Frontend",
    FS: "Fullstack",
    MD: "Mobile",
    DO: "DevOps",
    SYS: "System programming",
    ANDR: "Android",
    IOS: "iOS",
    CPM: "Cross-platform mobile",
    CMS: "Content Management System",
    CV: "Computer Vision",
    AI: "Artificial Intelligence",
    ML: "Machine Learning",
    DA: "Data Analytics",
};

export type TechCode = string;
export type TrendType = typeof TREND[number];
export type CategoryType = typeof CATEGORY[number];
export type ScopeType = typeof SCOPE[number];
export type ProficiencyType = typeof PROFICIENCY[ number];

export const TREND_MAP: Record<TrendType, number> = {
    SD: -2,
    D: -1,
    S: 0,
    T: 1,
    HT: 2,
} as const;

export const PROFICIENCY = ['skilled', 'expert', 'familiar'] as const;

export const SECTIONS = [
    "Contacts",
    "Summary",
    "Education",
    "Skills",
    "Professional experience/work history",
    "Certifications",
    "Publications",
    "Languages",
] as const;
