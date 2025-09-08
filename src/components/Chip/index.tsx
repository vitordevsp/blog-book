import Link from "next/link"
import style from "./style.module.css"

export interface ChipProps {
  children: React.ReactNode
  href?: string
}

export function Chip({
  children,
  href,
}: ChipProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={style.chip}
      >
        {children}
      </Link>
    )
  }
  else {
    return (
      <div className={style.chip}>
        {children}
      </div>
    )
  }
}
