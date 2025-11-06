import { NotFoundException } from '../commons'
import type { TypePagination, TypeSortBy, TypePaginatedResult } from '../commons'
import type { TypePost, TypePostCreate, TypePostUpdate } from '../entities/post.entity'
import type { IPostRepository, TypePostWithCategory } from '../repositories/post.repository'

export class PostsService {
  constructor(protected readonly postRepository: IPostRepository) {}

  findAll(pagination: TypePagination, sortBy: TypeSortBy<TypePost>): Promise<TypePaginatedResult<TypePost>> {
    return this.postRepository.findAll(pagination, sortBy)
  }

  async findById(id: TypePost['id']): Promise<TypePostWithCategory> {
    const post = await this.postRepository.findById(id)
    this.handleNotFound(post, id)
    return post
  }

  async findBySlug(slug: TypePost['slug']): Promise<TypePost> {
    const post = await this.postRepository.findBySlug(slug)
    this.handleNotFoundBySlug(post, slug)
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

  private handleNotFound(post: TypePost | TypePostWithCategory | undefined, id: TypePost['id']): asserts post is TypePost {
    if (!post) throw new NotFoundException(`Post with id ${id} not found`)
  }

  private handleNotFoundBySlug(post: TypePost | TypePostWithCategory | undefined, slug: TypePost['slug']): asserts post is TypePost {
    if (!post) throw new NotFoundException(`Post with slug ${slug} not found`)
  }
}
