import { HTMLAttributes, memo } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  color: string
}

export const IconCard = memo(function IconComp ({
  children,
  color,
  className,
  ...other
}: Props) {
  const rootStyle = {
    padding: '12px'
  }

  const contentStyle = {
    padding: '16px',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    clipPath: 'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)',
    boxShadow: 'inset 0px -4px 6px rgba(0, 0, 0, 0.48)',
    backgroundColor: color
  }

  const borderStyle = {
    top: '0px',
    left: '0px',
    width: '18px',
    height: '18px',
    position: 'absolute',
    transform: 'rotate(90deg)',
    backgroundColor: color,
    borderRadius: '0 4px 0 0',
    filter: 'brightness(1.5)'
  }

  const shadowStyle = {
    top: '8px',
    left: '-10px',
    width: '18px',
    height: '18px',
    opacity: '0.24',
    position: 'absolute',
    transform: 'rotate(45deg)',
    backgroundColor: 'black'
  }

  return (
    <article className={className} {...other}>
      <div style={rootStyle as any}>
        <span
          className='absolute top-0 left-0 rounded-md'
          style={{
            backgroundColor: color,
            height: '100%',
            width: '100%',
            opacity: '0.24'
          }}
        ></span>
        <span style={contentStyle as any}>
          <p style={shadowStyle as any}></p>
          <p style={borderStyle as any}></p>
          {children}
        </span>
      </div>
    </article>
  )
})
