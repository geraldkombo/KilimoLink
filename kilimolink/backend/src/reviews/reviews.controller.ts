import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateReviewDto, @Req() req: { user: { userId: string } }) {
    return this.reviewsService.create(req.user.userId, dto);
  }

  @Get('products/:id/reviews')
  getProductReviews(@Param('id') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }
}
