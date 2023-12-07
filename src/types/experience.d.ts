interface ExperienceCardData {
  startDate: string;
  endDate: string;
  title: string;
  company: {
    name: string;
    website: string;
  };
  description: string;
  skills: string[];
  contract: string;
  location: string;
  locationType: string;
  imageName: string;
}

interface ExperienceSection {
  title: string;
  cards: ExperienceCardData[];
}

export interface ExperienceProps {
  dictionary: ExperienceSection;
}