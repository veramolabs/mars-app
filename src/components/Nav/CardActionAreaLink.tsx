import React, { forwardRef } from 'react'
import CardActionArea from '@material-ui/core/CardActionArea'
import { NavLink, NavLinkProps } from 'react-router-dom'

export interface Props {
  className?: string
  to?: string | null // because the InferProps props allows alows null value
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const CardActionAreaLink: React.FC<Props> = props => {
  const { className, onClick, to, children } = props

  if (!to || typeof to !== 'string') {
    return (
      <CardActionArea
        className={className}
        children={children}
        onClick={onClick}
      />
    )
  }

  return (
    <CardActionArea
      className={className}
      children={children}
      component={forwardRef((props: NavLinkProps, ref: any) => <NavLink exact {...props} innerRef={ref} />)}
      to={to}
    />
  )
}

export default CardActionAreaLink
