import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StatusService implements OnModuleInit{
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  
  async onModuleInit() {
    await this.seedStatuses();
  }
  
  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const category = this.statusRepository.create(createStatusDto);
    return await this.statusRepository.save(category);
  }

  async findAll(): Promise<Status[]> {
    return await this.statusRepository.find({ relations: ['orders'] });
  }

  async seedStatuses() {
    const predefinedStatuses = [
      { name: 'UNCONFIRMED' },
      { name: 'CONFIRMED' },
      { name: 'CANCELLED' },
      { name: 'COMPLETED' },
    ];
  
    for (const statusData of predefinedStatuses) {
      const statusDto = plainToInstance(CreateStatusDto, statusData);
  
      const existingStatus = await this.statusRepository.findOne({
        where: { name: statusDto.name },
      });
  
      if (!existingStatus) {
        await this.create(statusDto); 
      }
    }
  }

  
}
