export type TypePost = {
  id: number
  slug: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type TypePostCreate = Pick<TypePost, 'title' | 'content' | 'slug'>

export type TypePostUpdate = Partial<TypePostCreate>
