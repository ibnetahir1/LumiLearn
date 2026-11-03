export type Module = {
  id: number;
  courseId: string;
  title: string;
  description: string;
  displayOrder: number;
}

export type CreateModuleRequest = {
  title: string;
  description: string;
}