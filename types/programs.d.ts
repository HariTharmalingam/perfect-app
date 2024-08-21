// Nouveaux types pour les programmes
export type Exercise = {
  name: string;
  instructions: string[];
  sets?: number;
  reps?: string[];
  rest?: string[];
  duration?: string;
  distance?: string[];
  image?: {
    public_id: string;
    url: string;
  };
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
};

// Vous pouvez ajouter d'autres types si nécessaire
