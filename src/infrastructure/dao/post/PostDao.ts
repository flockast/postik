import type { Kysely, SelectExpression } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { TypePaginatedResult, TypePagination, TypeSortBy } from '../../../application/commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from '../../../application/entities/post.entity'
import type { IPostRepository, TypePostWithCategory } from '../../../application/repositories/post.repository'
import { buildSortBy } from '../utils'
import { postMapper } from './post.mapper'

export class PostDao implements IPostRepository {
  protected readonly POSTS_FIELDS = [
    'posts.id',
    'posts.slug',
    'posts.title',
    'posts.content',
    'posts.category_id as categoryId',
    'posts.created_at as createdAt',
    'posts.updated_at as updatedAt',
  ] satisfies ReadonlyArray<SelectExpression<DB, 'posts'>>

  protected readonly CATEGORIES_FIELDS = [
    'categories.slug as categorySlug',
    'categories.title as categoryTitle',
    'categories.description as categoryDescription',
    'categories.parent_id as categoryParentId',
    'categories.created_at as categoryCreatedAt',
    'categories.updated_at as categoryUpdatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'categories'>>

  constructor(protected readonly db: Kysely<DB>) {}

  async findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePostWithCategory>> {
    const countQuery = this.db
      .selectFrom('posts')
      .select(({ fn }) => (
        [fn.count<number>('id').as('count')]
      ))
      .executeTakeFirst()

    const postsQuery = this.db
      .selectFrom('posts')
      .leftJoin('categories', 'categories.id', 'category_id')
      .orderBy(buildSortBy<'posts', TypePost>(sortBy))
      .offset(pagination.offset)
      .limit(pagination.limit)
      .select([
        ...this.POSTS_FIELDS,
        ...this.CATEGORIES_FIELDS
      ])
      .execute()

    const [countResult, postsResult] = await Promise.all([countQuery, postsQuery])

    return {
      total: countResult?.count ?? 0,
      data: postsResult.map(postMapper)
    }
  }

  async findById(id: TypePost['id']): Promise<TypePostWithCategory | undefined> {
    const result = await this.db
      .selectFrom('posts')
      .leftJoin('categories', 'categories.id', 'category_id')
      .select([
        ...this.POSTS_FIELDS,
        ...this.CATEGORIES_FIELDS
      ])
      .where('posts.id', '=', id)
      .executeTakeFirst()

    if (!result) {
      return undefined
    }

    return postMapper(result)
  }

  async findBySlug(slug: TypePost['slug']): Promise<TypePostWithCategory | undefined> {
    const result = await this.db
      .selectFrom('posts')
      .leftJoin('categories', 'categories.id', 'category_id')
      .where('posts.slug', '=', slug)
      .select([
        ...this.POSTS_FIELDS,
        ...this.CATEGORIES_FIELDS
      ])
      .executeTakeFirst()

    if (!result) {
      return undefined
    }

    return postMapper(result)
  }

  async create(post: TypePostCreate): Promise<TypePostWithCategory> {
    const newPost = await this.db
      .insertInto('posts')
      .values({
        title: post.title,
        slug: post.slug,
        content: post.content,
        category_id: post.categoryId
      })
      .returning(this.POSTS_FIELDS)
      .executeTakeFirstOrThrow()

    if (!newPost.categoryId) {
      return postMapper(newPost)
    }

    const category = await this.db
      .selectFrom('categories')
      .where('id', '=', newPost.categoryId)
      .select(this.CATEGORIES_FIELDS)
      .executeTakeFirst()

    return postMapper({
      ...newPost,
      ...category
    })
  }

  async update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePostWithCategory | undefined> {
    const updatedPost = await this.db
      .updateTable('posts')
      .set({
        title: post.title,
        slug: post.slug,
        content: post.content,
        category_id: post.categoryId
      })
      .where('id', '=', id)
      .returning(this.POSTS_FIELDS)
      .executeTakeFirst()

    if (!updatedPost) {
      return undefined
    }

    if (!updatedPost.categoryId) {
      return postMapper(updatedPost)
    }

    const category = await this.db
      .selectFrom('categories')
      .where('id', '=', updatedPost.categoryId)
      .select(this.CATEGORIES_FIELDS)
      .executeTakeFirst()

    return postMapper({
      ...updatedPost,
      ...category
    })
  }

  async delete(id: TypePost['id']): Promise<TypePostWithCategory | undefined> {
    const result = await this.findById(id)

    if (!result) {
      return undefined
    }

    await this.db
      .deleteFrom('posts')
      .where('id', '=', id)
      .execute()

    return result
  }
}
