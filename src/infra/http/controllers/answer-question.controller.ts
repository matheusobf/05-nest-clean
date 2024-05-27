import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayLoad } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayLoad,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body
    const userId = user.sub
    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentsIds: attachments,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
