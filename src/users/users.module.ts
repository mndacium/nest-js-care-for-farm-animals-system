import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { FilesModule } from 'src/files';

@Module({
  imports: [FilesModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
