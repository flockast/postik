import type { TypePaginatedResult, TypePagination, TypeSortBy } from '../commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from '../entities/post.entity'
import type { TypeCategory } from '../entities/category.entity'
import type { TypeTag } from '../entities/tag.entity'

export type TypePostWithCategory = TypePost & {
  category: TypeCategory | null
}

export type TypePostWithRelations = TypePost & {
  category: TypeCategory | null
  tags: TypeTag[]
}

export interface IPostRepository {
  findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePostWithCategory>>
  findById(id: TypePost['id']): Promise<TypePostWithRelations | undefined>
  findBySlug(slug: TypePost['slug']): Promise<TypePostWithRelations | undefined>
  create(post: TypePostCreate): Promise<TypePostWithRelations>
  update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePostWithRelations | undefined>
  delete(id: TypePost['id']): Promise<TypePostWithRelations | undefined>
}
