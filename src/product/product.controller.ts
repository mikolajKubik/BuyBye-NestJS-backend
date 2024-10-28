import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Put, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post()
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto
  ): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string, // Validates that `id` is a UUID
    @Body(ValidationPipe) updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string // Validates that `id` is a UUID
  ): Promise<Product> {
    return this.productService.findById(id);
  }
  
}
