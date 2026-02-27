import { AfterLoad, BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import dayjs from "dayjs";

export abstract class CommonEntity extends BaseEntity {
  /**
   * 主键id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 创建时间
   */
  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      to(value: Date): Date {
        // 存储时转换为 UTC
        return value
      },
      from(value: Date): string {
        // 查询时转换为本地时区（例如东八区）
        return dayjs(value).format('YYYY-MM-DD hh:mm:ss')
      }
    }
  })
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({
    name: 'updated_at',
    transformer: {
      to(value: Date): Date {
        // 存储时转换为 UTC
        return value
      },
      from(value: Date): string {
        // 查询时转换为本地时区（例如东八区）
        return dayjs(value).format('YYYY-MM-DD hh:mm:ss')
      }
    }
  })
  updatedAt: Date;

}

export abstract class CompleteEntity extends CommonEntity {
  /**
   * 创建者
   */
  @Column({ name: 'create_by', update: false, comment: '创建者', nullable: true })
  createBy: number

  /**
   * 更新者
   */
  @Column({ name: 'update_by', comment: '更新者', nullable: true })
  updateBy: number

}