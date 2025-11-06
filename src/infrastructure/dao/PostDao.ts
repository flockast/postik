import type { Kysely, SelectExpression } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { TypePaginatedResult, TypePagination, TypeSortBy } from '../../application/commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from '../../application/entities/post.entity'
import type { IPostRepository, TypePostWithCategory } from '../../application/repositories/post.repository'

import { buildSortBy } from './utils'

export class PostDao implements IPostRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'posts.id',
    'posts.slug',
    'posts.title',
    'posts.content',
    'posts.category_id as categoryId',
    'posts.created_at as createdAt',
    'posts.updated_at as updatedAt'
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
      total: countResult?.count ?? 0,
      data: postsResult,
    }
  }

  async findById(id: TypePost['id']): Promise<TypePostWithCategory | undefined> {
    const result = await this.db
      .selectFrom('posts')
      .leftJoin('categories', 'categories.id', 'category_id')
      .select([
        ...this.DEFAULT_SELECT_FIELDS,
        'categories.slug as categorySlug',
        'categories.title as categoryTitle',
        'categories.description as categoryDescription',
        'categories.parent_id as categoryParentId',
        'categories.created_at as categoryCreatedAt',
        'categories.updated_at as categoryUpdatedAt'
      ])
      .where('posts.id', '=', id)
      .executeTakeFirst()

    if (!result) {
      return undefined
    }

    return {
      id: result.id,
      title: result.title,
      slug: result.slug,
      content: result.content,
      categoryId: result.categoryId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      category: result.categoryId && result.categorySlug && result.categoryTitle
        ? {
          id: result.categoryId,
          slug: result.categorySlug,
          title: result.categoryTitle,
          description: result.categoryDescription || '',
          parentId: result.categoryParentId,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
        }
        : null
    }
  }

  findBySlug(slug: TypePost['slug']): Promise<TypePost | undefined> {
    return this.db
      .selectFrom('posts')
      .where('slug', '=', slug)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(post: TypePostCreate): Promise<TypePost> {
    return this.db
      .insertInto('posts')
      .values({
        title: post.title,
        slug: post.slug,
        content: post.content,
        category_id: post.categoryId
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePost | undefined> {
    return this.db
      .updateTable('posts')
      .set({
        title: post.title,
        slug: post.slug,
        content: post.content,
        category_id: post.categoryId
      })
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
