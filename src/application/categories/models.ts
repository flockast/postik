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
  slug: string
  title: string
  description?: string
  parentId?: number
}

export type TypeCategoryUpdate = Partial<TypeCategoryCreate>
