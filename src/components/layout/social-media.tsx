import { Navigation } from '@/types/sidenav-types'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon
} from '../common/SvgIcons'
import ItemLink from './item-link'

interface Props {
  className: string
  navigation: Navigation
}

export default function SocialMedia ({ className, navigation }: Props) {
  return (
    <ul className={className} aria-label='Social media'>
      <ItemLink title='Github' href={navigation.githubUrl}>
        <GitHubIcon />
      </ItemLink>

      <ItemLink title='Linkedin' href={navigation.linkedinUrl}>
        <LinkedinIcon />
      </ItemLink>

      <ItemLink title='Instagram' href={navigation.instagramUrl}>
        <InstagramIcon />
      </ItemLink>

      <ItemLink title='Twitter' href={navigation.twitterUrl}>
        <XIcon />
      </ItemLink>
    </ul>
  )
}
