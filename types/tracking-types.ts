export interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export interface DropdownOption {
  id: string | number;
  label: string;
  count?: number;
  name: string;
}

export interface TrackingHeaderProps {
  selectedView: string;
  selectedDate: string | null;
  selectedStatus: string | null;
  dateOptions: DropdownOption[];
  viewOptions: DropdownOption[];
  statusOptions: DropdownOption[];
  onViewChange: (option: DropdownOption) => void;
  onDateChange: (option: DropdownOption) => void;
  onStatusChange: (option: DropdownOption) => void;
  onSearch: (text: string) => void;
  searchValue: string;
  style?: object;
}

export interface TrackingState {
  region: Location | null;
  markers: Marker[];
  selectedDevice: Marker | null;
  selectedView: string;
  selectedDate: string | null;
  selectedStatus: string | null;
}
