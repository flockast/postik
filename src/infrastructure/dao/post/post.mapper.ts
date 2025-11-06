import type { TypePostWithCategory } from '../../../application/repositories/post.repository'

export const postMapper = (payload: Record<string, any>): TypePostWithCategory => {
  return {
      id: payload.id,
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      categoryId: payload.categoryId,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      category: payload.categoryId && payload.categorySlug && payload.categoryTitle
        ? {
          id: payload.categoryId,
          slug: payload.categorySlug,
          title: payload.categoryTitle,
          description: payload.categoryDescription || '',
          parentId: payload.categoryParentId,
          createdAt: payload.categoryCreatedAt,
          updatedAt: payload.categoryUpdatedAt
        }
        : null
    }
}
