import { Entity, Column, PrimaryColumn, TableForeignKey, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IRequiredEntityAttrs } from './entity.interface';

@Entity({
  name: 'initial_access_tokens'
})
export class InitialAccessToken implements IRequiredEntityAttrs {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  data: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  expiresAt: Date;

  @Column({
    type: 'varchar',
    nullable: true
  })
  consumedAt: Date;

  constructor() {}
}
