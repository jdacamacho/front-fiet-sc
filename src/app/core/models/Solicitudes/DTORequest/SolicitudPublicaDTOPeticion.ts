import { AnexoDTOPeticion } from "./AnexoDTOPeticion";
import { InformacionSolicitanteDTOPeticion } from "./InformacionSolicitanteDTOPeticion";

export class SolicitudPublicaDTOPeticion {
    nombre!: string ;
    descripcion!: string ;
    uuidTipoSolicitud!: string ;
    anexos!: AnexoDTOPeticion[] ;
    uuidOrdenDelDia!: string ;
    informacionSolicitante!: InformacionSolicitanteDTOPeticion ;
}