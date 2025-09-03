import style from "./style.module.css"
import { PageRenderer, getAllBlockChildren } from "@/lib/notion"

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const blocks = await getAllBlockChildren(id, { deep: true })
  console.log("blocks:", blocks)

  return (
    <main className={`${style.page} notion`}>
      <PageRenderer blocks={blocks} />
    </main>
  )
}
