import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { NotFoundApplicationException } from 'src/excpetion/not-found-application.exception';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    
    const category = await this.categoryRepository.findOne({
      where: { name: createProductDto.categoryName },
    });

    if (!category) {
      throw new NotAcceptableException(
        `Category with name "${createProductDto.categoryName}" not found`,
        `/categories/${createProductDto.categoryName}`
      )
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
  
    const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['category'] });
    
    if (!product) {
      throw new NotFoundApplicationException(
        `Product with ID "${productId}" not found`,
        `/products/${productId}`
      )
    }
  
    if (updateProductDto.categoryName !== undefined) {
      const category = await this.categoryRepository.findOne({ where: { name: updateProductDto.categoryName } });
  
      if (!category) {
        throw new NotAcceptableException(
          `Category with name "${updateProductDto.categoryName}" not found`,
          `/categories/${updateProductDto.categoryName}`
        )
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

    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.weight !== undefined) {
      product.weight = updateProductDto.weight;
    }
  
    return await this.productRepository.save(product);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  
    if (!product) {
      throw new NotFoundApplicationException(
        `Product with ID "${id}" not found`,
        `/products/${id}`
      )
    }
  
    return product;
  }
}
