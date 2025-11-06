import { type Kysely, type SelectExpression, sql } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { TypeCategory, TypeCategoryCreate, TypeCategoryUpdate } from '../../../application/entities/category.entity'
import type { ICategoryRepository } from '../../../application/repositories/category.repository'

export class CategoryDao implements ICategoryRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'slug',
    'title',
    'description',
    'parent_id as parentId',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'categories'>>

  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Promise<TypeCategory[]> {
    return this.db
      .selectFrom('categories')
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()
  }

  findById(id: TypeCategory['id']): Promise<TypeCategory | undefined> {
    return this.db
      .selectFrom('categories')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  findBySlug(slug: TypeCategory['slug']): Promise<TypeCategory | undefined> {
    return this.db
      .selectFrom('categories')
      .where('slug', '=', slug)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(category: TypeCategoryCreate): Promise<TypeCategory> {
    return this.db
      .insertInto('categories')
      .values({
        title: category.title,
        slug: category.slug,
        description: category.description,
        parent_id: category.parentId
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: TypeCategory['id'], category: TypeCategoryUpdate): Promise<TypeCategory | undefined> {
    return this.db
      .updateTable('categories')
      .set({
        title: category.title,
        slug: category.slug,
        description: category.description,
        parent_id: category.parentId,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  delete(id: TypeCategory['id']): Promise<TypeCategory | undefined> {
    return this.db
      .deleteFrom('categories')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }
}
