import type {
  NotionPage,
  NotionDateProperty,
  NotionMultiSelectProperty,
  NotionRichTextProperty,
  NotionSelectProperty,
  NotionTitleProperty,
} from "@/lib/notion"

export type PostPage = NotionPage<{
  status: NotionSelectProperty<PostPageStatusOpt>
  tags: NotionMultiSelectProperty<string>
  publishedAt: NotionDateProperty
  description: NotionRichTextProperty
  title: NotionTitleProperty
}>

type PostPageStatusOpt = "published" | "draft" | "private"
