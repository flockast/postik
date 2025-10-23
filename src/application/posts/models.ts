export type TypePost = {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type TypePostCreate = Pick<TypePost, 'title' | 'content'>

export type TypePostUpdate = Partial<TypePostCreate>
