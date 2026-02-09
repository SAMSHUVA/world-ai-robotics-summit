import prisma from "@/lib/prisma";
import { CONFERENCE_CONFIG } from "./conference";

export async function getSiteSettings() {
    try {
        const settings = await prisma.globalSetting.findMany();
        const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return {
            // Basic Conference Info
            shortName: settingsMap.shortName ?? CONFERENCE_CONFIG.shortName,
            name: settingsMap.name ?? CONFERENCE_CONFIG.name,
            year: settingsMap.year ?? CONFERENCE_CONFIG.year,
            fullName: settingsMap.fullName ?? CONFERENCE_CONFIG.fullName,
            location: settingsMap.location ?? CONFERENCE_CONFIG.location,
            venue: settingsMap.venue ?? CONFERENCE_CONFIG.venue,

            // Hero Section
            heroTitleLine2: settingsMap.heroTitleLine2 ?? "Robotics Summit",
            tagline: settingsMap.tagline ?? CONFERENCE_CONFIG.tagline,
            heroTagline: settingsMap.heroTagline ?? "Practical AI, Real Results, No Hype",
            heroGatheringText: settingsMap.heroGatheringText ?? "7th Annual Global Gathering",
            heroFormTitle: settingsMap.heroFormTitle ?? "Get Conference Updates",
            heroCtaPrimary: settingsMap.heroCtaPrimary ?? "Explore Tickets",
            heroCtaSecondary: settingsMap.heroCtaSecondary ?? "Submit Abstract",

            // Form Placeholders
            formFullNamePlaceholder: settingsMap.formFullNamePlaceholder ?? "John Doe",
            formEmailPlaceholder: settingsMap.formEmailPlaceholder ?? "john@example.com",
            formWhatsappPlaceholder: settingsMap.formWhatsappPlaceholder ?? "+1 234 567 890",
            formCountryPlaceholder: settingsMap.formCountryPlaceholder ?? "Select or type country",
            formSubmitButtonText: settingsMap.formSubmitButtonText ?? "Inquire Now",

            // Important Dates Section
            datesLabel: settingsMap.datesLabel ?? "Conference Dates",
            datesValue: settingsMap.datesValue ?? "May 22-24",
            eventFormatLabel: settingsMap.eventFormatLabel ?? "Event Format",
            venueLabel: settingsMap.venueLabel ?? "Venue Location",

            // Theme Section
            theme: settingsMap.theme ?? CONFERENCE_CONFIG.theme,
            themeHeader: settingsMap.themeHeader ?? "Theme 2026",
            themeTitle: settingsMap.themeTitle ?? CONFERENCE_CONFIG.theme,
            themeDescription: settingsMap.themeDescription ?? "Exploring the intersection of quantum resilience and decentralized networks.",

            // About Section
            aboutSectionSubtitle: settingsMap.aboutSectionSubtitle ?? "Redefining Scientific Exchange",
            aboutSectionTitle: settingsMap.aboutSectionTitle ?? "The Nexus of Human & Machine",
            aboutMainTitle: settingsMap.aboutMainTitle ?? "The World AI & Robotics Summit 2026 aims to be a premier platform for presenting and discussing new developments in autonomous systems and cognitive computing.",
            aboutDescription: settingsMap.aboutDescription ?? `${CONFERENCE_CONFIG.shortName} is a premier summit bringing together global innovators.`,

            // Deadlines Section
            deadlinesTitle: settingsMap.deadlinesTitle ?? "Upcoming Deadlines",
            viewAllText: settingsMap.viewAllText ?? "VIEW ALL",
            abstractDeadlineLabel: settingsMap.abstractDeadlineLabel ?? "Abstract Submission",
            abstractDeadlineDate: settingsMap.abstractDeadlineDate ?? "APR 21",
            earlyBirdLabel: settingsMap.earlyBirdLabel ?? "Early Bird Deadline",
            earlyBirdDate: settingsMap.earlyBirdDate ?? "MAY 2",
            standardRegLabel: settingsMap.standardRegLabel ?? "Standard Registration",
            standardRegDate: settingsMap.standardRegDate ?? "MAY 5",
            lateRegLabel: settingsMap.lateRegLabel ?? "Late Registration",
            lateRegDate: settingsMap.lateRegDate ?? "MAY 25",
            conferenceDatesLabel: settingsMap.conferenceDatesLabel ?? "Conference Dates",
            conferenceDatesDate: settingsMap.conferenceDatesDate ?? "JUN 20",

            // AI Simulator Section
            aiSimulatorTitle: settingsMap.aiSimulatorTitle ?? "The Future of Summit Intelligence",
            aiSimulatorSubtitle: settingsMap.aiSimulatorSubtitle ?? `${CONFERENCE_CONFIG.shortName} leverages advanced cognitive systems to redefine the academic gathering. Experience our vision for the summit of tomorrow.`,
            aiTerminalVersion: settingsMap.aiTerminalVersion ?? "Summit Insight v4.5",
            aiTerminalSubtitle: settingsMap.aiTerminalSubtitle ?? "Future Vision",
            aiTerminalLiveLabel: settingsMap.aiTerminalLiveLabel ?? "Live Intelligence",
            aiActionSuggested: settingsMap.aiActionSuggested ?? "Action Suggested:",
            aiResourcesLabel: settingsMap.aiResourcesLabel ?? "Resources",
            aiLearnMoreText: settingsMap.aiLearnMoreText ?? "Learn More",
            aiDownloadText: settingsMap.aiDownloadText ?? "Download official",

            // Resources Section
            resourcesTitle: settingsMap.resourcesTitle ?? "Premium Experience",
            resourcesSubtitle: settingsMap.resourcesSubtitle ?? "Resources & Downloads",
            resourcesEmptyText: settingsMap.resourcesEmptyText ?? "No resources available in this category yet.",
            resourceCategoryAll: settingsMap.resourceCategoryAll ?? "All",
            resourceCategoryTemplate: settingsMap.resourceCategoryTemplate ?? "Template",
            resourceCategoryBrochure: settingsMap.resourceCategoryBrochure ?? "Brochure",
            resourceCategoryGuidelines: settingsMap.resourceCategoryGuidelines ?? "Guidelines",

            // IAISR Section
            iaisrOrganizedBy: settingsMap.iaisrOrganizedBy ?? "Organized by IAISR",
            iaisrFullName: settingsMap.iaisrFullName ?? "International Association for Innovation and Scientific Research",
            iaisrTagline: settingsMap.iaisrTagline ?? "Bridging global research and future innovation.",
            iaisrDescription: settingsMap.iaisrDescription ?? "IAISR is dedicated to fostering a world-class community of scholars and industry leaders to drive scientific progress and sustainable development.",
            iaisrCountriesLabel: settingsMap.iaisrCountriesLabel ?? "Countries",
            iaisrCountriesValue: settingsMap.iaisrCountriesValue ?? "50",
            iaisrMembersLabel: settingsMap.iaisrMembersLabel ?? "Members",
            iaisrMembersValue: settingsMap.iaisrMembersValue ?? "10k",
            iaisrEventsLabel: settingsMap.iaisrEventsLabel ?? "Events",
            iaisrEventsValue: settingsMap.iaisrEventsValue ?? "200",

            // Speakers Section
            speakersTitle: settingsMap.speakersTitle ?? "Keynote Speakers",
            speakersEmptyText: settingsMap.speakersEmptyText || "Speakers to be announced.",

            // Committee Section
            committeeTitle: settingsMap.committeeTitle ?? "Conference Committee",
            committeeEmptyText: settingsMap.committeeEmptyText || "Committee members to be announced.",

            // Other Sections
            sdgHeader: settingsMap.sdgHeader ?? "UN 2030 Agenda",
            sdgTitle: settingsMap.sdgTitle ?? "SDG Impact & Sustainability",
            sdgDescription: settingsMap.sdgDescription ?? "Harnessing Artificial Intelligence as a catalyst for the UN Sustainable Development Goals through rigorous research, ethical innovation, and net-zero event practices.",

            awardsTitle: settingsMap.awardsTitle ?? "Excellence Awards",
            awardsDescription: settingsMap.awardsDescription ?? "Nominations are now open for Best Paper, Young Researcher, and Innovation Excellence awards.",

            testimonialsTitle: settingsMap.testimonialsTitle ?? "What Attendees Say",
            testimonialsEmptyText: settingsMap.testimonialsEmptyText ?? "Testimonials to be added soon.",

            contactTitle: settingsMap.contactTitle ?? "Contact Us",
            contactSubtitle: settingsMap.contactSubtitle ?? "Have questions? Reach out to our support team.",

            newsletterTitle: settingsMap.newsletterTitle ?? "Stay Updated",
            newsletterSubtitle: settingsMap.newsletterSubtitle ?? "Subscribe to receive the latest updates.",

            partnersLabel: settingsMap.partnersLabel ?? "In Association With",

            // Social Links
            social: {
                whatsapp: settingsMap.whatsapp ?? CONFERENCE_CONFIG.social.whatsapp,
                email: settingsMap.email ?? CONFERENCE_CONFIG.social.email,
            },

            urls: CONFERENCE_CONFIG.urls
        };
    } catch (error) {
        console.error("getSiteSettings Error:", error);
        // Return default values on error
        return {
            shortName: CONFERENCE_CONFIG.shortName,
            name: CONFERENCE_CONFIG.name,
            year: CONFERENCE_CONFIG.year,
            fullName: CONFERENCE_CONFIG.fullName,
            location: CONFERENCE_CONFIG.location,
            venue: CONFERENCE_CONFIG.venue,
            heroTitleLine2: "Robotics Summit",
            tagline: CONFERENCE_CONFIG.tagline,
            heroTagline: "Practical AI, Real Results, No Hype",
            heroGatheringText: "7th Annual Global Gathering",
            heroFormTitle: "Get Conference Updates",
            heroCtaPrimary: "Explore Tickets",
            heroCtaSecondary: "Submit Abstract",
            formFullNamePlaceholder: "John Doe",
            formEmailPlaceholder: "john@example.com",
            formWhatsappPlaceholder: "+1 234 567 890",
            formCountryPlaceholder: "Select or type country",
            formSubmitButtonText: "Inquire Now",
            datesLabel: "Conference Dates",
            datesValue: "May 22-24",
            eventFormatLabel: "Event Format",
            venueLabel: "Venue Location",
            theme: CONFERENCE_CONFIG.theme,
            themeHeader: "Theme 2026",
            themeTitle: CONFERENCE_CONFIG.theme,
            themeDescription: "Exploring the intersection of quantum resilience and decentralized networks.",
            aboutSectionSubtitle: "Redefining Scientific Exchange",
            aboutSectionTitle: "The Nexus of Human & Machine",
            aboutMainTitle: "The World AI & Robotics Summit 2026 aims to be a premier platform for presenting and discussing new developments in autonomous systems and cognitive computing.",
            aboutDescription: `${CONFERENCE_CONFIG.shortName} is a premier summit bringing together global innovators.`,
            deadlinesTitle: "Upcoming Deadlines",
            viewAllText: "VIEW ALL",
            abstractDeadlineLabel: "Abstract Submission",
            abstractDeadlineDate: "APR 21",
            earlyBirdLabel: "Early Bird Deadline",
            earlyBirdDate: "MAY 2",
            standardRegLabel: "Standard Registration",
            standardRegDate: "MAY 5",
            lateRegLabel: "Late Registration",
            lateRegDate: "MAY 25",
            conferenceDatesLabel: "Conference Dates",
            conferenceDatesDate: "JUN 20",
            aiSimulatorTitle: "The Future of Summit Intelligence",
            aiSimulatorSubtitle: `${CONFERENCE_CONFIG.shortName} leverages advanced cognitive systems to redefine the academic gathering.`,
            aiTerminalVersion: "Summit Insight v4.5",
            aiTerminalSubtitle: "Future Vision",
            aiTerminalLiveLabel: "Live Intelligence",
            aiActionSuggested: "Action Suggested:",
            aiResourcesLabel: "Resources",
            aiLearnMoreText: "Learn More",
            aiDownloadText: "Download official",
            resourcesTitle: "Premium Experience",
            resourcesSubtitle: "Resources & Downloads",
            resourcesEmptyText: "No resources available in this category yet.",
            resourceCategoryAll: "All",
            resourceCategoryTemplate: "Template",
            resourceCategoryBrochure: "Brochure",
            resourceCategoryGuidelines: "Guidelines",
            iaisrOrganizedBy: "Organized by IAISR",
            iaisrFullName: "International Association for Innovation and Scientific Research",
            iaisrTagline: "Bridging global research and future innovation.",
            iaisrDescription: "IAISR is dedicated to fostering a world-class community of scholars and industry leaders.",
            iaisrCountriesLabel: "Countries",
            iaisrCountriesValue: "50",
            iaisrMembersLabel: "Members",
            iaisrMembersValue: "10k",
            iaisrEventsLabel: "Events",
            iaisrEventsValue: "200",
            speakersTitle: "Keynote Speakers",
            speakersEmptyText: "Speakers to be announced.",
            committeeTitle: "Conference Committee",
            committeeEmptyText: "Committee members to be announced.",
            sdgHeader: "UN 2030 Agenda",
            sdgTitle: "SDG Impact & Sustainability",
            sdgDescription: "Harnessing AI as a catalyst for the UN Sustainable Development Goals.",
            awardsTitle: "Excellence Awards",
            awardsDescription: "Nominations are now open for Best Paper, Young Researcher, and Innovation Excellence awards.",
            testimonialsTitle: "What Attendees Say",
            testimonialsEmptyText: "Testimonials to be added soon.",
            contactTitle: "Contact Us",
            contactSubtitle: "Have questions? Reach out to our support team.",
            newsletterTitle: "Stay Updated",
            newsletterSubtitle: "Subscribe to receive the latest updates.",
            partnersLabel: "In Association With",
            social: {
                whatsapp: CONFERENCE_CONFIG.social.whatsapp,
                email: CONFERENCE_CONFIG.social.email
            },
            urls: CONFERENCE_CONFIG.urls
        };
    }
}
