export interface DocumentoAtleta {
  id: number;
  atleta_id: number;
  tipo: 'permiso_tutor' | 'permiso_medico';
  permiso_nombre: string;
  permiso_tipo: string;
  fecha_creacion: string;
}


export interface DocumentoCreateRequest {
  atleta_id: number;
  archivo: File;
}
