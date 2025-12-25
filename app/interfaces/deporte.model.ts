export interface Deporte {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_nombre?: string;
  imagen?: string; // base64
}

export interface DeporteCreateRequest {
  nombre: string;
  descripcion?: string;
  imagen?: File;
}

export interface DeporteUpdateRequest {
  nombre: string;
  descripcion?: string;
  imagen?: File;
}