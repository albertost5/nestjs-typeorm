import { Injectable } from '@nestjs/common';
// import { dataSource } from '../../src/database/data-source';
import { DatabaseService } from '../../src/database/database.service';

@Injectable()
export class TestUtils {
  private databaseService: DatabaseService;

  constructor(dbService: DatabaseService) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('ERROR-TEST-UTILS-ONLY-FOR-TESTS');
    }

    this.databaseService = dbService;
  }

  async cleanAll(entity: any) {
    try {
      // console.log({dataSource});
      // const repository = dataSource.getRepository(entity);

      const repository = this.databaseService.getRepository(entity);
      await repository.clear();
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }
}
