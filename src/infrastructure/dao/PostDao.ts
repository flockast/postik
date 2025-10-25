import type { Kysely, SelectExpression } from 'kysely'
import type { DB } from 'kysely-codegen'
import type {
  IPostRepository, TypePost, TypePostCreate, TypePostUpdate,
  TypePaginatedResult, TypePagination, TypeSortBy
} from '../../application'
import { buildSortBy } from './utils'

export class PostDao implements IPostRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'slug',
    'title',
    'content',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'posts'>>

  constructor(protected readonly db: Kysely<DB>) {}

  async findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePost>> {
    const countQuery = this.db
      .selectFrom('posts')
      .select(({ fn }) => (
        [fn.count<number>('id').as('count')]
      ))
      .executeTakeFirst()

    const postsQuery = this.db
      .selectFrom('posts')
      .orderBy(buildSortBy<'posts', TypePost>(sortBy))
      .offset(pagination.offset)
      .limit(pagination.limit)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()

    const [countResult, postsResult] = await Promise.all([countQuery, postsQuery])

    return {
      count: countResult?.count ?? 0,
      data: postsResult,
    }
  }

  findById(id: TypePost['id']): Promise<TypePost | undefined> {
    return this.db
      .selectFrom('posts')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  findBySlug(slug: TypePost['slug']): Promise<TypePost | undefined> {
    return this.db
      .selectFrom('posts')
      .where('slug', '=', slug)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(newPost: TypePostCreate): Promise<TypePost> {
    return this.db
      .insertInto('posts')
      .values(newPost)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePost | undefined> {
    return this.db
      .updateTable('posts')
      .set(post)
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  delete(id: TypePost['id']) {
    return this.db
      .deleteFrom('posts')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }
}
