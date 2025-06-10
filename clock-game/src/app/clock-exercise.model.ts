export interface ClockExerciseTemplate {
  time: string;
  images: string[];
  expressions: ExpressionTemplate[];
}

export interface ExpressionTemplate {
  label: string;
  hours: number[];
  minutes: number[];
  hourAdjustment: number;
}

export interface ClockExercise {
  id: string;
  time: string;
  image: string;
  expression: string;
  hour: number;
  minute: number;
  correctHour: number;
  correctMinute: number;
}