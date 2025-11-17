import { TipoAnexoDTOPeticion } from "./TipoAnexoDTOPeticion";

export class TipoSolicitudDTOPeticion {
    nombre!: string;
    descripcion!: string;
    seccion!: string;
    anexos!: TipoAnexoDTOPeticion[];
    uuidFuncionario!: string;
}