import { NotionRenderer } from "@/app/lib/notion/components"
import style from "./style.module.css"

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
    <main className={style.page}>
      <NotionRenderer pageId={id} />
    </main>
  )
}
