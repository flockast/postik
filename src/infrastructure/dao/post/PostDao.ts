import { sql, type Kysely, type SelectExpression } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { TypePaginatedResult, TypePagination, TypeSortBy } from '../../../application/commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from '../../../application/entities/post.entity'
import type { IPostRepository, TypePostWithCategory, TypePostWithRelations } from '../../../application/repositories/post.repository'
import { buildSortBy } from '../utils'
import type { TypeCategory } from '../../../application/entities/category.entity'
import type { TypeTag } from '../../../application/entities/tag.entity'

export class PostDao implements IPostRepository {
  protected readonly POSTS_FIELDS = [
    'posts.id as id',
    'posts.slug as slug',
    'posts.title as title',
    'posts.content as content',
    'posts.category_id as categoryId',
    'posts.created_at as createdAt',
    'posts.updated_at as updatedAt',
  ] satisfies ReadonlyArray<SelectExpression<DB, 'posts'>>

  protected readonly CATEGORIES_AGGREGATION = sql<TypeCategory>`
    CASE
      WHEN categories.id IS NOT NULL THEN
        json_build_object(
          'id', ${sql.ref('categories.id')},
          'slug', ${sql.ref('categories.slug')},
          'title', ${sql.ref('categories.title')},
          'description', ${sql.ref('categories.description')},
          'parentId', ${sql.ref('categories.parent_id')},
          'createdAt', ${sql.ref('categories.created_at')},
          'updatedAt', ${sql.ref('categories.updated_at')}
        )
      ELSE NULL
    END
  `.as('category')

  protected readonly TAGS_AGGREGATION = sql<TypeTag[]>`
    json_agg(
      json_build_object(
        'id', ${sql.ref('tags.id')},
        'slug', ${sql.ref('tags.slug')},
        'title', ${sql.ref('tags.title')},
        'description', ${sql.ref('tags.description')}
      )
    ) FILTER (WHERE tags.id IS NOT NULL)
  `.as('tags')

  constructor(protected readonly db: Kysely<DB>) {}

  private buildPostQuery(trx?: Kysely<DB>) {
    const queryBuilder = trx || this.db

    return queryBuilder
      .selectFrom('posts')
      .leftJoin('categories', 'categories.id', 'category_id')
      .leftJoin('post_tags', 'post_tags.post_id', 'posts.id')
      .leftJoin('tags', 'tags.id', 'post_tags.tag_id')
      .select([
        ...this.POSTS_FIELDS,
        this.CATEGORIES_AGGREGATION,
        this.TAGS_AGGREGATION
      ])
      .groupBy(['posts.id', 'categories.id'])
  }

  async findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePostWithCategory>> {
    const countQuery = this.db
      .selectFrom('posts')
      .select(({ fn }) => (
        [fn.count<number>('posts.id').as('count')]
      ))
      .executeTakeFirst()

    const postsQuery = this.buildPostQuery()
      .orderBy(buildSortBy<'posts', TypePost>(sortBy, 'posts'))
      .offset(pagination.offset)
      .limit(pagination.limit)
      .execute()

    const [countResult, postsResult] = await Promise.all([countQuery, postsQuery])

    return {
      total: countResult?.count ?? 0,
      data: postsResult
    }
  }

async findById(id: TypePost['id']): Promise<TypePostWithRelations | undefined> {
  const postResult = await this.buildPostQuery()
    .where('posts.id', '=', id)
    .executeTakeFirst()

  if (!postResult) {
    return undefined
  }

  return postResult
}

  async findBySlug(slug: TypePost['slug']): Promise<TypePostWithRelations | undefined> {
    const postResult = await this.buildPostQuery()
      .where('posts.slug', '=', slug)
      .executeTakeFirst()

    if (!postResult) {
      return undefined
    }

    return postResult
  }

  async create(post: TypePostCreate): Promise<TypePostWithRelations> {
    return this.db.transaction().execute(async (trx) => {
      const newPost = await trx
        .insertInto('posts')
        .values({
          title: post.title,
          slug: post.slug,
          content: post.content,
          category_id: post.categoryId
        })
        .returning(this.POSTS_FIELDS)
        .executeTakeFirstOrThrow()

      if (post.tagIds && post.tagIds.length) {
        await trx
          .insertInto('post_tags')
          .values(
            post.tagIds.map((tagId) => ({
              post_id: newPost.id,
              tag_id: tagId
            }))
          )
          .execute()
      }

      return this.buildPostQuery(trx)
        .where('posts.id', '=', newPost.id)
        .executeTakeFirstOrThrow()
    })
  }

  async update(id: TypePost['id'], post: TypePostUpdate): Promise<TypePostWithRelations | undefined> {
    return this.db.transaction().execute(async (trx) => {
      const updatedPost = await trx
        .updateTable('posts')
        .set({
          title: post.title,
          slug: post.slug,
          content: post.content,
          category_id: post.categoryId,
          updated_at: sql`CURRENT_TIMESTAMP`
        })
        .where('id', '=', id)
        .returning(this.POSTS_FIELDS)
        .executeTakeFirst()

      if (!updatedPost) {
        return undefined
      }

      if (post.tagIds !== undefined) {
        await trx
          .deleteFrom('post_tags')
          .where('post_id', '=', id)
          .execute()
      }

      if (post.tagIds && post.tagIds.length) {
        await trx
          .insertInto('post_tags')
          .values(post.tagIds.map((tagId) => ({
            post_id: id,
            tag_id: tagId
          })))
          .execute()
      }

      return this.buildPostQuery(trx)
        .where('posts.id', '=', id)
        .executeTakeFirstOrThrow()
    })
  }

  async delete(id: TypePost['id']): Promise<TypePostWithRelations | undefined> {
    return this.db.transaction().execute(async (trx) => {
      const postResult = await this.buildPostQuery(trx)
        .where('posts.id', '=', id)
        .executeTakeFirst()

      if (!postResult) {
        return undefined
      }

      await trx
        .deleteFrom('posts')
        .where('id', '=', id)
        .execute()

      return postResult
    })
  }
}
