type ProgramType = {
  _id: any;
  id: number;
  name: string;
  session: SessionType[];
};

type SessionType = {
  sessionNumber: number;
  warmup?: string;
  comment: string;
  instructions: string;
  exercises: ExercisesType[];
  sessionType?: string
};

type ExercisesType = {
  exerciseNumber: number;
  exerciseName: string;
  exerciseDescription: string;
  image: string
  weeks: WeeksType[]
};

type WeeksType = {
  weekNumber: number
  sets: number
  reps?: string[]
  rest?: string[]
  duration?: string[]
};

