import { ReactNode } from "react"
import { classMerge } from "@/utils/helpers"
import styles from "./style.module.css"

export interface FlexboxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  direction?: "initial" | "row" | "row-reverse" | "column" | "column-reverse"
  justify?: "initial" | "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
  align?: "initial" | "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
  gap?: string
  className?: string
  grow?: number
}

export const Flexbox = ({
  children,
  direction = "initial",
  justify = "initial",
  align = "initial",
  gap = "0",
  className,
  grow = 0,
  style,
  ...rest
}: FlexboxProps) => {
  if (!children) return null

  const classes = classMerge([styles.flexbox, className])

  const mappedStyle = {
    "--flexbox-grow": grow,
    "--flexbox-direction": direction,
    "--flexbox-justify": justify,
    "--flexbox-align": align,
    "--flexbox-gap": gap,
    ...style,
  }

  return (
    <div className={classes} style={mappedStyle} {...rest}>
      {children}
    </div>
  )
}
