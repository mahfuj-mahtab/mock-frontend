import { PROFILE_ROUTES } from "@/features/profile/constants/routes";

const TAB = {
  about: "about",
  experience: "experience",
  education: "education",
  skills: "skills",
  files: "files",
};

function profileTabHref(tab) {
  return `${PROFILE_ROUTES.profile}?tab=${tab}`;
}

export function getProfileCompleteness({
  profile,
  experiences = [],
  educations = [],
  skills = [],
}) {
  const items = [
    {
      key: "headline_level",
      label: "Headline and engineer level",
      done: Boolean(profile?.headline?.trim() && profile?.level),
      href: profileTabHref(TAB.about),
    },
    {
      key: "bio",
      label: "Professional bio",
      done: Boolean(profile?.bio?.trim()),
      href: profileTabHref(TAB.about),
    },
    {
      key: "experience",
      label: "At least one work experience",
      done: experiences.length >= 1,
      href: profileTabHref(TAB.experience),
    },
    {
      key: "skills",
      label: "Three or more skills",
      done: skills.length >= 3,
      href: profileTabHref(TAB.skills),
    },
    {
      key: "cv",
      label: "CV uploaded",
      done: Boolean(profile?.has_cv),
      href: profileTabHref(TAB.files),
    },
    {
      key: "avatar",
      label: "Profile photo",
      done: Boolean(profile?.avatar),
      href: profileTabHref(TAB.files),
    },
  ];

  const weights = {
    headline_level: 20,
    bio: 10,
    experience: 20,
    skills: 20,
    cv: 15,
    avatar: 15,
  };

  let earned = 0;
  let total = 0;
  for (const item of items) {
    const w = weights[item.key] ?? 0;
    total += w;
    if (item.done) {
      earned += w;
    }
  }

  const percent = total > 0 ? Math.round((earned / total) * 100) : 0;

  return { percent, items };
}
