import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class UsersModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: UsersModule,
      imports: [infrastructureModule],
    };
  }
}
