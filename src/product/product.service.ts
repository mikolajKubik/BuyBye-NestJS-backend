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

  async update(productId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Step 0: Check if `id` is present in `updateProductDto` and throw an error if it is
    if (updateProductDto.id) {
      throw new BadRequestException('Updating the primary key "id" is not allowed');
    }
  
    // Step 1: Find the existing product by ID
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['category'] });
    
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }
  
    // Step 2: Check if `categoryName` is provided and find the new category if necessary
    if (updateProductDto.categoryName !== undefined) {
      const category = await this.categoryRepository.findOne({ where: { name: updateProductDto.categoryName } });
  
      if (!category) {
        throw new NotFoundException(`Category with name "${updateProductDto.categoryName}" not found`);
      }
  
      // Update the product's category
      product.category = category;
    }
  
    // Step 3: Update the product with the new values from `updateProductDto`
    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }
  
    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }
  
    if (updateProductDto.stock !== undefined) {
      product.stock = updateProductDto.stock;
    }
  
    // Step 4: Save the updated product
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
