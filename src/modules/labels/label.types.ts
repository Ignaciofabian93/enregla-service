export type Label = {
  id: number;
  work_order: string;
  label_id: number;
  operator_id: number;
  date: string;
  branch_id: number;
  label_quantity: number;
  wrong_labels: number;
  coordinates: string;
  vehicle_brand: string;
  vehicle_id: number;
  show_vin: boolean;
  vehicle_vin: string;
  show_plate: boolean;
  vehicle_plate: string;
  show_logo: boolean;
  description: string;
};
