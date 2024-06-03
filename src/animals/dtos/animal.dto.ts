export class AnimalDto {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  weight: number;
  species: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    login: string;
  };
}
