export class UserDto {
  id: number;
  login: string;
  firstName?: string;
  lastName?: string;
  role: {
    id: number;
    name: string;
  };
}
