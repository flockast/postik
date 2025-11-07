import { type Kysely, type SelectExpression, sql } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { TypeTag, TypeTagCreate, TypeTagUpdate } from '../../../application/entities/tag.entity'
import type { ITagRepository } from '../../../application/repositories/tag.repository'

export class TagDao implements ITagRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'slug',
    'title',
    'description',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'tags'>>

  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Promise<TypeTag[]> {
    return this.db
      .selectFrom('tags')
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()
  }

  findById(id: TypeTag['id']): Promise<TypeTag | undefined> {
    return this.db
      .selectFrom('tags')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  findBySlug(slug: TypeTag['slug']): Promise<TypeTag | undefined> {
    return this.db
      .selectFrom('tags')
      .where('slug', '=', slug)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(tag: TypeTagCreate): Promise<TypeTag> {
    return this.db
      .insertInto('tags')
      .values({
        title: tag.title,
        slug: tag.slug,
        description: tag.description
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: TypeTag['id'], tag: TypeTagUpdate): Promise<TypeTag | undefined> {
    return this.db
      .updateTable('tags')
      .set({
        title: tag.title,
        slug: tag.slug,
        description: tag.description,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  delete(id: TypeTag['id']): Promise<TypeTag | undefined> {
    return this.db
      .deleteFrom('tags')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }
}
