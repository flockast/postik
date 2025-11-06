export type TypePost = {
  id: number
  slug: string
  title: string
  content: string
  categoryId: number | null
  createdAt: Date
  updatedAt: Date
}

export type TypePostCreate = {
  slug: TypePost['slug']
  title: TypePost['title']
  content: TypePost['content']
  categoryId?: TypePost['categoryId']
}

export type TypePostUpdate = Partial<TypePostCreate>
