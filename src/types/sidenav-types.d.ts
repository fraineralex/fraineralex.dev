interface ConnectButton {
  label: string
  url: string
}

interface MessageButton {
  label: string
  url: string
}

interface ResumeButton {
  label: string
  url: string
}

interface LifterLink {
  url: string
  logo: string
}

interface ItlaLink {
  url: string
  logo: string
}

interface LinkedinCard {
  profileImage: string
  lifterLink: LifterLink
  itlaLink: ItlaLink
  fullname: string
  tagline: string
  location: string
  contactInfo: string
  connections: string
  connectButton: ConnectButton
  messageButton: MessageButton
  resumeButton: ResumeButton
}

interface Navigation {
  about: string
  experience: string
  projects: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  instagramUrl: string
  codepenUrl: string
}

interface Sidenav {
  navigation: Navigation
  linkedinCard: LinkedinCard
}

interface inViews {
  inViewAbout: boolean
  inViewExperience: boolean
  inViewProjects: boolean
  inViewWriting: boolean
}

export interface SidenavProps {
  dictionary: Sidenav
  inViews: inViews
}

export interface LinkedinCardProps {
  dictionary: LinkedinCard
  navigation: Navigation
}
