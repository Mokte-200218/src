export interface Atleta {
  id: number;
  nombre: string;
  correo: string;
  fecha_nacimiento: string;
  peso: number;
  altura: number;
  deporte_id: number;
  matricula: string;
  fecha_creacion: string;
  tiene_documentos: boolean;
  activo: boolean;
}

 
export interface AtletaCreateRequest {
  nombre: string;
  correo: string;
  fecha_nacimiento: string;
  peso: number;
  altura: number;
  deporte_id: number;
  matricula: string;
  activo: boolean
}


export interface DocumentoResponse {
  id: number;
  atleta_id: number;
  tipo: 'permiso_tutor' | 'permiso_medico';
  permiso_nombre: string;
  permiso_tipo: string;
  fecha_creacion: string;
}

export interface Avance {
  id?: number;
  atleta_id: number;
  descripcion_avance: string;
  fecha_avance: string;
  distancia_salto_largo: number;
  distancia_salto_vertical: number;
  fuerza_sentadilla_max: number;
  fuerza_press_pecho_max: number;
  fuerza_peso_muerto_max: number;
  repeticiones_dominadas_max: number;
  repeticiones_lagartijas_max: number;
  repeticiones_abdominales_1min: number;
  potencia_salto_vertical_cmj: number;
  potencia_salto_horizontal: number;
  potencia_sprint_10m: number;
  potencia_sprint_20m: number;
  fecha_creacion?: string;
}
