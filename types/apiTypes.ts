// Session Type (For Authentication)
export type Session = {
  id: number;
  name: string;
  email: string;
  phone: string;
  readonly: boolean;
  administrator: boolean;
  map: string;
  latitude: number;
  longitude: number;
  zoom: number;
  password: string;
  coordinateFormat: string;
  disabled: boolean;
  expirationTime: string; // ISO date string
  deviceLimit: number;
  userLimit: number;
  deviceReadonly: boolean;
  limitCommands: boolean;
  fixedEmail: boolean;
  poiLayer: string;
  attributes: Record<string, any>;
};

// Device Type
export type Device = {
  id: number;
  name: string;
  uniqueId: string;
  status: string;
  disabled: boolean;
  lastUpdate: string; // ISO date string
  positionId: number;
  groupId: number;
  phone: string;
  model: string;
  contact: string;
  category: string;
  attributes: Record<string, any>;
};

// Geofence Type
export type Geofence = {
  id: number;
  name: string;
  description: string;
  area: string;
  calendarId: number;
  attributes: Record<string, any>;
};

// Notification Type
export type Notification = {
  id: number;
  type: string;
  always: boolean;
  web: boolean;
  mail: boolean;
  sms: boolean;
  calendarId: number;
  attributes: Record<string, any>;
};

export type Events = {
  id: number;
  type: string;
  eventTime: string;
  always: boolean;
  web: boolean;
  mail: boolean;
  sms: boolean;
  calendarId: number;
  deviceId: number;
  geofenceId: number;
  maintenanceId: number;
  positionId: number;
  attributes: Record<string, any>;
};

// User Type
export type User = {
  id?: number;
  email: string;
  password?: string;
  name?: string;
};

export type Position = {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  valid: boolean;
  fixTime: string;
  attributes: {
    priority: number;
    sat: number;
    event: number;
    distance: number;
    totalDistance: number;
    motion: boolean;
  };
  protocol: string;
  serverTime: string;
  deviceTime: string;
  outdated: boolean;
  address: string | null;
  accuracy: number;
  network: Record<string, any>;
  geofenceIds: any[];
};
