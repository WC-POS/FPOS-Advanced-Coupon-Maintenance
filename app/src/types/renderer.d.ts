declare global {
  // Renderer Interfaces
  export interface SimpleItem {
    name: string;
    description: string;
    department: string;
  }

  export interface SimpleDepartment {
    name: string;
    items: SimpleItem[];
  }

  export interface ScheduleDay {
    active: boolean;
    start: number;
    end: number;
  }

  export interface ScheduleSet {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
    saturday: ScheduleDay;
    sunday: ScheduleDay;
  }
}

export {};
