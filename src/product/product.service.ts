import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.id) {
      throw new BadRequestException('Predefining the primary key "id" is not allowed');
    }

    const category = await this.categoryRepository.findOne({
      where: { name: createProductDto.categoryName },
    });

    if (!category) {
      throw new NotFoundException(`Category with name "${createProductDto.categoryName}" not found`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category, 
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find( { relations: ['category'] });
  }

  async update(productId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    if (updateProductDto.id) {
      throw new BadRequestException('Updating the primary key "id" is not allowed');
    }
  
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['category'] });
    
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }
  
    if (updateProductDto.categoryName !== undefined) {
      const category = await this.categoryRepository.findOne({ where: { name: updateProductDto.categoryName } });
  
      if (!category) {
        throw new NotFoundException(`Category with name "${updateProductDto.categoryName}" not found`);
      }
  
      product.category = category;
    }
  
    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }
  
    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }
  
    if (updateProductDto.stock !== undefined) {
      product.stock = updateProductDto.stock;
    }
  
    return await this.productRepository.save(product);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  
    return product;
  }

  
}
