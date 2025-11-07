import type { TypeTag, TypeTagCreate, TypeTagUpdate } from '../entities/tag.entity'

export interface ITagRepository {
  findAll(): Promise<TypeTag[]>
  findById(id: TypeTag['id']): Promise<TypeTag | undefined>
  findBySlug(id: TypeTag['slug']): Promise<TypeTag | undefined>
  create(category: TypeTagCreate): Promise<TypeTag>
  update(id: TypeTag['id'], category: TypeTagUpdate): Promise<TypeTag | undefined>
  delete(id: TypeTag['id']): Promise<TypeTag | undefined>
}
