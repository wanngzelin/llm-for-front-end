import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export abstract class CommonEntity extends BaseEntity {
  /**
   * 主键id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 创建时间
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  /**
   * 更新时间
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
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