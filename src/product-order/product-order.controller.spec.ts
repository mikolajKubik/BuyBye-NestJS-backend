import { Test, TestingModule } from '@nestjs/testing';
import { ProductOrderController } from './product-order.controller';
import { ProductOrderService } from './product-order.service';

describe('ProductOrderController', () => {
  let controller: ProductOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOrderController],
      providers: [ProductOrderService],
    }).compile();

    controller = module.get<ProductOrderController>(ProductOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
