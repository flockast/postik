import type { TypePaginatedResult, TypePagination, TypeSortBy } from '../commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from './models'

export interface IPostRepository {
  findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePost>>
  findById(id: TypePost['id']): Promise<TypePost | undefined>
  findBySlug(slug: TypePost['slug']): Promise<TypePost | undefined>
  create(post: TypePostCreate): Promise<TypePost>
  update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePost | undefined>
  delete(id: TypePost['id']): Promise<TypePost | undefined>
}
