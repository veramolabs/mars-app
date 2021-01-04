import React, { forwardRef } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { NavLink, NavLinkProps } from 'react-router-dom'
import { useMobile } from './MobileProvider'

export interface Props {
  className?: string
  to?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  selected?: boolean
  disabled?: boolean
}

const ListItemLink: React.FC<Props> = (props) => {
  const { className, onClick, to, children, selected, disabled } = props
  const { mobileOpen, setMobileOpen } = useMobile()

  const closeMobileAndClick = (e: React.MouseEvent<HTMLElement>) => {
    if (mobileOpen) setMobileOpen(false)
    if ( onClick ) onClick(e)
  }

  // If link is not set return the orinary ListItem
  if (!to || typeof to !== 'string') {
    return <ListItem button className={className} children={children} onClick={closeMobileAndClick} selected={selected} />
  }

  // Return a LitItem with a link component
  return (
    <ListItem
      button
      className={className}
      children={children}
      onClick={closeMobileAndClick}
      component={forwardRef((props: NavLinkProps, ref: any) => (
        <NavLink exact {...props} innerRef={ref} />
      ))}
      selected={selected}
      disabled={disabled}
      to={to}
    />
  )
}

export default ListItemLink
