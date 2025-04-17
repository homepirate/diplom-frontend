import { VisitServicesDetailsResponse } from "./VisitServicesDetailsResponse.inerface";

export interface PatientVisitDetailsResponse {
    doctorName: string;
    visitId: string;
    visitDate: string;
    isFinished: boolean;
    notes: string;
    totalPrice: number;
    services: VisitServicesDetailsResponse[];
    attachmentUrls: string[];
  }