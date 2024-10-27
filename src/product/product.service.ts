import { Injectable, NotFoundException } from '@nestjs/common';
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

  // async create(product: Partial<Product>): Promise<Product> {
  //   return this.productRepository.save(product);
  // }
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Find the category by its name from the DTO
    const category = await this.categoryRepository.findOne({
      where: { name: createProductDto.categoryName },
    });

    if (!category) {
      throw new NotFoundException(`Category with name "${createProductDto.categoryName}" not found`);
    }

    // Create the product and associate the found category
    const product = this.productRepository.create({
      ...createProductDto,
      category, // Assign the found category to the product
    });

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find( { relations: ['category'] });
  }

}
