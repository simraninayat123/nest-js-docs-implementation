export class User {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  provider!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}
