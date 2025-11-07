export type TypeTag = {
  id: number
  slug: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type TypeTagCreate = {
  slug: TypeTag['slug']
  title: TypeTag['title']
  description?: TypeTag['description']
}

export type TypeTagUpdate = Partial<TypeTagCreate>
