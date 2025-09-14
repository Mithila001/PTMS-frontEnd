export interface Bus {
  id: number;
  registrationNumber: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  fuelType: string;
  seatingCapacity: number;
  standingCapacity: number;
  ntcPermitNumber: number;
  comfortType: string;
  serviceType: string;
  active: boolean;
  isA_C: boolean;
}

export interface PaginatedBusResponse {
  status: number;
  message: string;
  data: {
    content: Bus[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
  errors: any;
  timestamp: string;
}
