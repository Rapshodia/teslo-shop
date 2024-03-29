import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}


  async create(createProductDto: CreateProductDto) {

    try{
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)
      return product

    }catch(e){
      this.handleDbExceptions(e)
      
    }
  

}

findAll(paginationDto: PaginationDto){

  const {limit = 10, offset = 1} = paginationDto

  return this.productRepository.find({

    take: limit,
    skip: offset

  })
  
  
}

async findOne(term: string) {

  let product: Product 

  if(isUUID(term)){
    
     product =  await this.productRepository.findOneBy({id: term})
  }else{
    
    //product = await this.productRepository.findOneBy({slug:term})
    const queryBuilder = this.productRepository.createQueryBuilder()
    product = await queryBuilder
      .where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug:term.toLocaleLowerCase()
      }).getOne()
  
  }

  if(!product) throw new NotFoundException(`Product ${term} not found`)

  return product
}

async update(id: string, updateProductDto: UpdateProductDto) {
  
  const product = await this.productRepository.preload({
    id,
    ...updateProductDto
  })
  if(!product) throw new NotFoundException(`Product ${id} not found`)
  
  return this.productRepository.save(product)
}

async remove(id: string) {
  const product = await this.findOne(id)
  await this.productRepository.remove(product)
}

  private handleDbExceptions(e: any){
    if(e)
    this.logger.error(e);
    throw new InternalServerErrorException(e + e.detail)
  }
}
