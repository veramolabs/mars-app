import React, { forwardRef } from 'react'
import ListItem from '@material-ui/core/ListItem'
import { NavLink, NavLinkProps } from 'react-router-dom'

export interface Props {
  className?: string
  to?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  selected?: boolean
}

const ListItemLink: React.FC<Props> = props => {
  const { className, onClick, to, children, selected } = props

  // If link is not set return the orinary ListItem
  if (!to || typeof to !== 'string') {
    return (
      <ListItem
        button
        className={className}
        children={children}
        onClick={onClick}
        selected={selected}
      />
    )
  }

  // Return a LitItem with a link component
  return (
    <ListItem
      button
      className={className}
      children={children}
      component={forwardRef((props: NavLinkProps, ref: any) => <NavLink exact {...props} innerRef={ref} />)}
      selected={selected}
      to={to}
    />
  )
}

export default ListItemLink
