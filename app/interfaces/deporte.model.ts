export interface Deporte {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_nombre?: string;
  num_atletas?: number;
  imagenBase64?: string;
}

export interface DeporteCreateRequest {
  nombre: string;
  descripcion?: string;
}

export interface DeporteUpdateRequest {
  nombre?: string;
  descripcion?: string;
}
