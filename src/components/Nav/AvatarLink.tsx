import React, { forwardRef } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { NavLink, NavLinkProps } from 'react-router-dom'

export interface Props {
  className?: string
  src?: string
  color?: string
  to?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const AvatarLink: React.FC<Props> = props => {
  const { className, onClick, to, children, src } = props

  // If link is not set return the orinary Button
  if (!to || typeof to !== 'string') {
    return (
      <Avatar
        className={className}
        children={children}
        src={src}
        onClick={onClick}
      />
    )
  }

  // Return a LitItem with a link component
  return (
    <Avatar
      className={className}
      children={children}
      src={src}
      component={forwardRef((props: NavLinkProps, ref: any) => <NavLink exact {...props} innerRef={ref} />)}
      to={to}
    />
  )
}

export default AvatarLink
