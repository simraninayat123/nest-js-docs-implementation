import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthorEntity } from '../../../../../authors/infrastructure/persistence/relational/entities/author.entity';

@Entity({ name: 'book' })
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn!: string;

  @Column({ type: 'int', nullable: true })
  publishedYear!: number | null;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    nullable: false,
  })
  author!: AuthorEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
