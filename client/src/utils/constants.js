export const LOCATIONS = {
  Dhaka: ['Mirpur', 'Uttara', 'Dhanmondi', 'Gulshan', 'Banani', 'Mohakhali', 'Bashundhara'],
  Chittagong: ['Agrabad', 'Nasirabad', 'Pahartali', 'Halishahar'],
  Sylhet: ['Zindabazar', 'Ambarkhana', 'Subid Bazar'],
  Khulna: ['Sonadanga', 'Khalishpur', 'Doulatpur']
};

export const CITIES = Object.keys(LOCATIONS);

export const STATUS_LABELS = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked: 'Picked Up',
  inTransit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const STATUS_BADGE_CLASS = {
  pending: 'badge-warning',
  assigned: 'badge-info',
  picked: 'badge-primary',
  inTransit: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-error'
};

export const STATUS_STEPS = ['pending', 'assigned', 'picked', 'inTransit', 'delivered'];

export const VEHICLE_TYPES = ['bike', 'cycle', 'van'];
