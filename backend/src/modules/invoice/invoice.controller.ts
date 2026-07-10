import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { QueryProductDto } from '../product/dto/query-product.dto';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/guards/roles/roles.decorator';
import { userRoleEnum } from '../user/user.schema';

@Controller({
  path: 'invoice',
  version: '1',
})
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Req() req: Request,
    @Body() createInvoiceDto: CreateInvoiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/i }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    console.log(createInvoiceDto, req.body);
    console.log('Headers:', req.headers);
    return this.invoiceService.create(createInvoiceDto, file);
  }

  @UseGuards(RolesGuard)
  @Roles(...Object.values(userRoleEnum.enumValues))
  @Get()
  findAll(@Query() query: QueryProductDto, @Req() req: Request) {
    console.log(req.user);
    return this.invoiceService.findAll(query, req.user.storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
