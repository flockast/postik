import { NotFoundException } from '../commons'
import type { TypeCategory, TypeCategoryCreate, TypeCategoryUpdate } from '../entities/category.entity'
import type { ICategoryRepository } from '../repositories/category.repository'

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  findAll() {
    return this.categoryRepository.findAll()
  }

  async findById(id: TypeCategory['id']): Promise<TypeCategory> {
    const category = await this.categoryRepository.findById(id)
    this.handleNotFoundById(category, id)
    return category
  }

  async findBySlug(slug: TypeCategory['slug']): Promise<TypeCategory> {
    const category = await this.categoryRepository.findBySlug(slug)
    this.handleNotFoundBySlug(category, slug)
    return category
  }

  create(category: TypeCategoryCreate): Promise<TypeCategory> {
    return this.categoryRepository.create(category)
  }

  async update(id: TypeCategory['id'], category: TypeCategoryUpdate) {
    const updatedCategory = await this.categoryRepository.update(id, category)
    this.handleNotFoundById(updatedCategory, id)
    return updatedCategory
  }

  async delete(id: TypeCategory['id']): Promise<TypeCategory> {
    const deletedCategory = await this.categoryRepository.delete(id)
    this.handleNotFoundById(deletedCategory, id)
    return deletedCategory
  }

  private handleNotFoundById(category: TypeCategory | undefined, id: TypeCategory['id']): asserts category is TypeCategory {
    if (!category) throw new NotFoundException(`Category id ${id} not found`)
  }

  private handleNotFoundBySlug(category: TypeCategory | undefined, slug: TypeCategory['slug']): asserts category is TypeCategory {
    if (!category) throw new NotFoundException(`Category slug ${slug} not found`)
  }
}
