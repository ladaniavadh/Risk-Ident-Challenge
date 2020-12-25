import { Request } from "../../common";

export interface FraudDetectRequestModel {
  transactionId: string;
  confidenceLevel: number;
}

export function fraudDetectRequestAdaptor(req: Request): FraudDetectRequestModel {
  return {
    transactionId: req.query.transactionId ? (req.query.transactionId as string) : undefined,
    confidenceLevel: Number(req.query.confidenceLevel)
  };
}
