import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
