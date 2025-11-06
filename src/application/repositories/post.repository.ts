import type { TypePaginatedResult, TypePagination, TypeSortBy } from '../commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from '../entities/post.entity'
import type { TypeCategory } from '../entities/category.entity'

export type TypePostWithCategory = TypePost & {
    category: TypeCategory | null
}

export interface IPostRepository {
  findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePostWithCategory>>
  findById(id: TypePost['id']): Promise<TypePostWithCategory | undefined>
  findBySlug(slug: TypePost['slug']): Promise<TypePostWithCategory | undefined>
  create(post: TypePostCreate): Promise<TypePostWithCategory>
  update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePostWithCategory | undefined>
  delete(id: TypePost['id']): Promise<TypePostWithCategory | undefined>
}
