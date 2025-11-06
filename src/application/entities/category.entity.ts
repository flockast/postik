export type TypeCategory = {
  id: number
  slug: string
  title: string
  description: string | null
  parentId: number | null
  createdAt: Date
  updatedAt: Date
}

export type TypeCategoryCreate = {
  slug: TypeCategory['slug']
  title: TypeCategory['title']
  description?: TypeCategory['description']
  parentId?: TypeCategory['parentId']
}

export type TypeCategoryUpdate = Partial<TypeCategoryCreate>
