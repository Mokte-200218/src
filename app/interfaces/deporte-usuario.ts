export interface DeporteUsuario {
  id: number;
  usuario_id: number;
  deporte_id: number;
  fecha_asignacion: string;
}

export interface DeporteUsuarioRequest {
  usuario_id: number;
  deporte_id: number;
}
