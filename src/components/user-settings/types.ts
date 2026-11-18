export type EditableFieldKey =
  | "name"
  | "description"
  | "schedule"
  | "location"
  | "phone"
  | "instagram"
  | "facebook"
  | "tiktok";

export interface EditStates {
  name: boolean;
  description: boolean;
  schedule: boolean;
  location: boolean;
  phone: boolean;
  photo: boolean;
  cover: boolean;
  instagram: boolean;
  facebook: boolean;
  tiktok: boolean;
}

export const INITIAL_EDIT_STATES: EditStates = {
  name: false,
  description: false,
  schedule: false,
  location: false,
  phone: false,
  photo: false,
  cover: false,
  instagram: false,
  facebook: false,
  tiktok: false,
};
