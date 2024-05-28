import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAutor: CommentWithAuthor) {
    return {
      id: commentWithAutor.commentId.toString(),
      authorId: commentWithAutor.authorId.toString(),
      authorName: commentWithAutor.author,
      content: commentWithAutor.content,
      createdAt: commentWithAutor.createdAt,
      updatedAt: commentWithAutor.updatedAt,
    }
  }
}
