import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(RegistrationStatus, {
  name: 'RegistrationStatus',
});

@ObjectType()
@Entity({ schema: 'public', name: 'registration_requests' })
export class RegistrationRequest {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  schoolName: string;

  @Field()
  @Column()
  executiveName: string;

  @Field()
  @Column()
  executiveEmail: string;

  @Field(() => RegistrationStatus)
  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
  })
  status: RegistrationStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
