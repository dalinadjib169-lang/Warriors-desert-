export type Stage = "ابتدائي" | "متوسط" | "ثانوي";

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  wilaya: string;
  stage: Stage;
  level: string;
  institution: string;
  classRoom: string;
  stream?: string; // For High School
  avatarLevel: number; // 1 to 5 (weak to strong)
  coins: number;
  points: number;
  cityLevel: number; // 1: house, 2: village, 3: army, 4: defenses, 5: fort, 6: castle
}

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}
