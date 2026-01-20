import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Atleta, AtletaCreateRequest } from '../interfaces/atleta.model';
import { DeporteUsuario, DeporteUsuarioRequest } from '../interfaces/deporte-usuario';
import { Observable } from 'rxjs';
import { Avance, AvanceCreateRequest } from '../interfaces/avance.model';
import { Deporte } from '../interfaces/deporte.model';
import { DocumentoAtleta } from '../interfaces/documento-atleta.model'; 
import { throwError } from 'rxjs';
import { DeporteUsuarioService } from './deporte-usuario.service';
@Injectable({ providedIn: 'root' })
export class AtletasService {
  private http = inject(HttpClient); 
  private API_URL = 'http://localhost:8000';

  // =====================================================
  // ATLETA (INFORMACIÓN BÁSICA) CONEXION CON EL BACK
  // =====================================================

  //obtener informacion del deporte
  getInfoDeporteById(deporteId:number): Observable<Deporte>{
    return this.http.get<Deporte>(`${this.API_URL}/deportes/${deporteId}`);
  }

  getByDeporte(deporteId: number): Observable<Atleta[]> {
    return this.http.get<Atleta[]>(`${this.API_URL}/atletas/deporte/${deporteId}`);
  }

  getAll(): Observable<Atleta[]> {
    return this.http.get<Atleta[]>(`${this.API_URL}/atletas`);
  }

  getByAtleta(id: number): Observable<AtletaCreateRequest> {
    return this.http.get<Atleta>(`${this.API_URL}/atletas/${id}`);
  }
  
  create(data: AtletaCreateRequest): Observable<Atleta> {
    return this.http.post<Atleta>(`${this.API_URL}/atletas`, data);
  }
 
  getGraficaDeporte(deporteId: number): Observable<any> {
    // Quitamos el responseType: 'text' para recibir el objeto JSON
    return this.http.get<any>(`${this.API_URL}/analisis/deporte/${deporteId}`);
  }
  getGraficaRanking(deporteId: number):Observable<any>{
    return this.http.get<any>(`${this.API_URL}/analisis/ranking/deporte/${deporteId}`)
  }

  updateAtleta(id: number, data: Partial<Atleta>): Observable<Atleta> {
    return this.http.put<Atleta>(`${this.API_URL}/atletas/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/atletas/${id}`);
  }

  // =====================================================
  // DOCUMENTOS (MULTIPART & BASE64)
  // =====================================================

  /**
   * Obtiene documento individual en base64
   * GET /atletas/{atleta_id}/documentos/{documento_id}
   */
downloadDocumento(atletaId: number, documentoId: number): Observable<any> {
  return this.http.get<any>(
    `${this.API_URL}/atletas/${atletaId}/documentos/${documentoId}`
  );
}

  /**
   * Subir nuevo documento (POST multipart/form-data)
   */
  uploadDocumento(atletaId: number, tipo: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('permiso', file);

    return this.http.post(
      `${this.API_URL}/atletas/${atletaId}/documentos`,
      formData
    );
  }
  getDocumentosByAtleta(atletaId: number): Observable<DocumentoAtleta[]> {
    return this.http.get<DocumentoAtleta[]>(`${this.API_URL}/atletas/${atletaId}/documentos`);
  }

  /**
   * Actualizar documento existente (PUT multipart/form-data)
   * PUT /atletas/{atleta_id}/documentos/{documento_id}
   */
  updateDocumento(atletaId: number, documentoId: number, tipo: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('permiso', file);

    return this.http.put(
      `${this.API_URL}/atletas/${atletaId}/documentos/${documentoId}`,
      formData
    );
  }

  /**
   * Eliminar documento individual
   */
  deleteDocumento(atletaId: number, documentoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/atletas/${atletaId}/documentos/${documentoId}`
    );
  }

  /**
   * Helper para descargar el base64 como archivo real
   */
 descargarBase64(base64: string, nombre: string) {
  const link = document.createElement('a');
  
  // Usar octet-stream obliga al navegador a descargar el archivo en lugar de intentar abrirlo
  link.href = `data:application/octet-stream;base64,${base64}`;
  link.download = nombre;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  // =====================================================
  // AVANCES (SEGUIMIENTO FÍSICO)
  // =====================================================

  getAvancesByAtleta(atletaId: number): Observable<Avance[]> {
    return this.http.get<Avance[]>(
      `${this.API_URL}/avances/atleta/${atletaId}`
    );
  }

  createAvance(data: AvanceCreateRequest): Observable<Avance> {
    return this.http.post<Avance>(`${this.API_URL}/avances`, data);
  }

  updateAvance(avanceId: number, payload: Partial<AvanceCreateRequest>): Observable<Avance> {
    return this.http.put<Avance>(
      `${this.API_URL}/avances/${avanceId}`,
      payload
    );
  }

  deleteAvance(avanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/avances/${avanceId}`);
  }

  // =====================================================
  // ANÁLISIS Y GRÁFICAS (SVG)
  // =====================================================
 
  /**
   * Obtiene SVG del análisis individual del atleta
   * GET /analisis/atleta/{atleta_id}
   */
 
  getAnalisisSvg(atletaId: number): Observable<any> {
    // Quitamos el responseType: 'text' para recibir el objeto JSON
    return this.http.get<any>(`${this.API_URL}/analisis/atleta/${atletaId}`);
  }

  /**
   * Transforma el string SVG (en base64 o crudo) para el HTML
   */
  renderSvg(svgData: string): string {
    // Si el backend lo manda en base64, lo decodificamos
    // Si lo manda como string XML directo, lo retornamos tal cual
    try {
      return atob(svgData);
    } catch (e) {
      return svgData;
    }
  }

  // =====================================================
  // ASIGNACIÓN COACH / DEPORTE
  // =====================================================

   // 1. Obtener todos los usuarios asignados a un deporte


  // 2. Obtener la información de una asignación específica por su ID
getAsignacionPorId(id: number): Observable<DeporteUsuario> {
  if (id === undefined || id === null) {
    console.error("Se intentó llamar a getAsignacionPorId sin un ID válido");
    // Retornamos un error controlado para que no llegue al servidor
    return throwError(() => new Error('ID no proporcionado'));
  }
  return this.http.get<DeporteUsuario>(`${this.API_URL}/deporte_usuario/${id}`);
}
 getAsignacionesPorDeporte(deporteId: number): Observable<DeporteUsuario[]> {
    return this.http.get<DeporteUsuario[]>(`${this.API_URL}/deporte_usuario/deporte/${deporteId}`);
  }

  actualizarAsignacion(id: number, data: DeporteUsuarioRequest): Observable<DeporteUsuario> {
    return this.http.put<DeporteUsuario>(`${this.API_URL}/deporte_usuario/${id}`, data);
  }

  eliminarAsignacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/deporte_usuario/${id}`);
  }
}


  

