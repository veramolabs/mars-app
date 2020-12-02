import React, { forwardRef } from 'react'
import Button from '@material-ui/core/Button'
import { NavLink, NavLinkProps } from 'react-router-dom'

export interface Props {
  className?: string
  color?: string
  to?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const ButtonLink: React.FC<Props> = props => {
  const { className, onClick, to, children, color } = props

  // If link is not set return the orinary Button
  if (!to || typeof to !== 'string') {
    return (
      <Button
        className={className}
        children={children}
        onClick={onClick}
      />
    )
  }

  // Return a LitItem with a link component
  return (
    <Button
      className={className}
      children={children}
      component={forwardRef((props: NavLinkProps, ref: any) => <NavLink exact {...props} innerRef={ref} />)}
      to={to}
    />
  )
}

export default ButtonLink
