export interface Avance {
  id: number;
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
  fecha_creacion: string;
}

export interface AvanceCreateRequest {
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
}
