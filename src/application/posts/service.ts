import { NotFoundException } from '../commons'
import type { TypePagination, TypeSortBy, TypePaginatedResult } from '../commons'
import type { IPostRepository } from './repository'
import type { TypePost, TypePostCreate, TypePostUpdate } from './models'

export class PostService {
  constructor(protected readonly postRepository: IPostRepository) {}

  findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePost>> {
    return this.postRepository.findAll(pagination, sortBy)
  }

  async findById(id: TypePost['id']): Promise<TypePost> {
    const post = await this.postRepository.findById(id)
    this.handleNotFound(post, id)
    return post
  }

  create(post: TypePostCreate): Promise<TypePost> {
    return this.postRepository.create(post)
  }

  async update(id: TypePost['id'], post: TypePostUpdate) {
    const updatedPost = await this.postRepository.update(id, post)
    this.handleNotFound(updatedPost, id)
    return updatedPost
  }

  async delete(id: TypePost['id']) {
    const deletedPost = await this.postRepository.delete(id)
    this.handleNotFound(deletedPost, id)
    return deletedPost
  }

  private handleNotFound(post: TypePost | undefined, id: TypePost['id']): asserts post is TypePost {
    if (!post) throw new NotFoundException(`Post with id ${id} not found`)
  }
}
