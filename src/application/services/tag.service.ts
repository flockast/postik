import { NotFoundException } from '../commons'
import type { TypeTag, TypeTagCreate, TypeTagUpdate } from '../entities/tag.entity'
import type { ITagRepository } from '../repositories/tag.repository'

export class TagService {
  constructor(private readonly tagRepository: ITagRepository) {}

  findAll() {
    return this.tagRepository.findAll()
  }

  async findById(id: TypeTag['id']): Promise<TypeTag> {
    const category = await this.tagRepository.findById(id)
    this.handleNotFoundById(category, id)
    return category
  }

  async findBySlug(slug: TypeTag['slug']): Promise<TypeTag> {
    const category = await this.tagRepository.findBySlug(slug)
    this.handleNotFoundBySlug(category, slug)
    return category
  }

  create(category: TypeTagCreate): Promise<TypeTag> {
    return this.tagRepository.create(category)
  }

  async update(id: TypeTag['id'], category: TypeTagUpdate) {
    const updatedCategory = await this.tagRepository.update(id, category)
    this.handleNotFoundById(updatedCategory, id)
    return updatedCategory
  }

  async delete(id: TypeTag['id']): Promise<TypeTag> {
    const deletedCategory = await this.tagRepository.delete(id)
    this.handleNotFoundById(deletedCategory, id)
    return deletedCategory
  }

  private handleNotFoundById(category: TypeTag | undefined, id: TypeTag['id']): asserts category is TypeTag {
    if (!category) throw new NotFoundException(`Tag id ${id} not found`)
  }

  private handleNotFoundBySlug(category: TypeTag | undefined, slug: TypeTag['slug']): asserts category is TypeTag {
    if (!category) throw new NotFoundException(`Tag slug ${slug} not found`)
  }
}
