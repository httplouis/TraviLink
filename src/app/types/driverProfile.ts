export type DriverProfile = {
  firstName: string;
  lastName: string;
  email?: string;
  campus: string;
  dept?: string;
  phone?: string;
  license: string;
  canDrive: string[];
  badges?: string[];
  avatar?: string;        // data URL for now
  notifyEmail: boolean;
  notifyPush: boolean;
};
