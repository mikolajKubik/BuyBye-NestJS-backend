import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService implements OnModuleInit{
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }
  
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  async seedCategories() {
    const predefinedCategories = [
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Clothing' },
      { name: 'Toys' },
    ];
  
    for (const categoryData of predefinedCategories) {
      const categoryDto = plainToInstance(CreateCategoryDto, categoryData);
  
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryDto.name },
      });
  
      if (!existingCategory) {
        await this.create(categoryDto); 
      }
    }
  }
}
