export interface Atleta {
  id: number;
  nombre: string;
  fecha_nacimiento: string;
  peso: number;
  altura: number;
  deporte_id: number;
  matricula: string;
  fecha_creacion: string;
  tiene_documentos?: boolean;
}

export interface AtletaCreateRequest {
  nombre: string;
  fecha_nacimiento: string;
  peso: number;
  altura: number;
  deporte_id: number;
  matricula: string;
}
