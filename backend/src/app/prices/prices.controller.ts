import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FindAllPricesUseCase } from './use-cases/find-all-prices.use-case';
import { FindOnePriceUseCase } from './use-cases/find-one-price.use-case';
import { CreatePriceUseCase } from './use-cases/create-price.use-case';
import { UpdatePriceUseCase } from './use-cases/update-price.use-case';
import { RemovePriceUseCase } from './use-cases/remove-price.use-case';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';

@Controller('prices')
export class PricesController {
  constructor(
    private readonly findAllPrices: FindAllPricesUseCase,
    private readonly findOnePrice: FindOnePriceUseCase,
    private readonly createPrice: CreatePriceUseCase,
    private readonly updatePrice: UpdatePriceUseCase,
    private readonly removePrice: RemovePriceUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreatePriceDto) {
    return this.createPrice.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllPrices.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOnePrice.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePriceDto) {
    return this.updatePrice.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removePrice.execute(id);
  }
}
