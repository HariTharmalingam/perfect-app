// Nouveaux types pour les programmes
export type Exercise = {
  name: string;
  instructions: string[];
  images?: string[];
  sets?: number;
  reps?: string[];
  rest?: string[];
  duration?: string;
  distance?: string[];
  charge?: string[];
  intensity?: string[];
  speed?: string[];
  tempo?: string[];
};

export type Session = {
  warmup: {
    name: string;
    exercise: Exercise[];
  };
  instructions: string;
  exercises: Exercise[];
};

export type Week = {
  weekNumber: number;
  isCurrent: boolean;
  sessions: Session[];
};

export type Program = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  restructuredWeeks: Week[];
  isActive: boolean;
};
