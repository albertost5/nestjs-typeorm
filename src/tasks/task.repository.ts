import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@Injectable()
export class TaskRepository extends Repository<Task> {

    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async findDone(): Promise<Task[]> {
        return await this.find({
            where: {
                status: TaskStatus.DONE
            }
        })
    }

    async firstWhere(column: string, value: string | number ): Promise<Task | undefined>
    {   
        return await this.createQueryBuilder()
                         .where(`Task.${column} = :value`, {value: value})
                         .getOne();
    }
}