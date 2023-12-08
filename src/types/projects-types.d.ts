export interface Project {
  projectName: string;
  description: string;
  technologies: string[];
  deployUrl: string;
  githubRepositoryUrl: string;
  imageSrc: string;
  starsOnGithub: number;
};

interface Link {
  ariaLabel: string;
  url: string;
  strong: string;
  span: string;
};

interface ProjectsSection {
  title: string;
  cards: Project[];
  link: Link;
};

export interface ProjectsProps {
  dictionary: ProjectsSection;
}
