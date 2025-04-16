export interface TrainingMenuItem {
  id: string;
  name: string;
  description: string;
  durationInSeconds: number;
}

export interface TrainingMenu {
  id: string;
  title: string;
  description: string;
  items: TrainingMenuItem[];
} 