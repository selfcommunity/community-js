export type InitialFieldState = Geolocation & {
  title: string;
  description: string;
  slug?: string;
  settings?: Record<string, any>;
  cover?: string;
  isSubmitting: boolean;
};

export type FieldStateKeys = keyof InitialFieldState;

export type FieldStateValues = InitialFieldState[FieldStateKeys];
