import type { TypeCategory, TypeCategoryCreate, TypeCategoryUpdate } from '../entities/category.entity'

export interface ICategoryRepository {
  findAll(): Promise<TypeCategory[]>
  findById(id: TypeCategory['id']): Promise<TypeCategory | undefined>
  findBySlug(id: TypeCategory['slug']): Promise<TypeCategory | undefined>
  create(category: TypeCategoryCreate): Promise<TypeCategory>
  update(id: TypeCategory['id'], category: TypeCategoryUpdate): Promise<TypeCategory | undefined>
  delete(id: TypeCategory['id']): Promise<TypeCategory | undefined>
}
