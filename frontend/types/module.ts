export type Module = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  displayOrder: number;
}

export type CreateModuleRequest = {
  title: string;
  description: string;
}