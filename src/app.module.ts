import { Module } from '@nestjs/common';
import { MessagesModule } from './features/messages';

@Module({
  imports: [MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
