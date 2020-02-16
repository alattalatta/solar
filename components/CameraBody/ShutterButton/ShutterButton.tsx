import clsx from 'clsx'
import React from 'react'

import styles from './styles.module.css'

type ShutterButtonProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const ShutterButton: React.FC<ShutterButtonProps> = ({
  className,
  ...props
}) => <button className={clsx(styles.button, className)} {...props} />

export default ShutterButton
