import { SCEventLocationType, SCEventRecurrenceType } from '@selfcommunity/types';

export type Place = {
  description: string;
  id?: string;
};

export type Geolocation = {
  location: SCEventLocationType;
  geolocation?: string;
  lat?: number;
  lng?: number;
  link?: string;
};

export type InitialFieldState = Geolocation & {
  imageOriginal: string | ArrayBuffer;
  imageOriginalFile: Blob;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  recurring: SCEventRecurrenceType;
  name: string;
  description: string;
  isPublic: boolean;
  isSubmitting: boolean;
  showEndDateTime: boolean;
};

export type FieldStateKeys = keyof InitialFieldState;

export type FieldStateValues = InitialFieldState[FieldStateKeys];
