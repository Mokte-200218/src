export interface Documento {
  id: number;
  atleta_id: number;
  nombre: string;
  tipo: string;
  fecha_subida: string;
  url?: string;
}

export interface DocumentoCreateRequest {
  atleta_id: number;
  archivo: File;
}
