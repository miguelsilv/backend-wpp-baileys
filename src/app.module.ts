import { Module } from '@nestjs/common';
import { MessagesModule } from './presentation/messages';

@Module({
  imports: [MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
