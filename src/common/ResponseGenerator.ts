import { Response } from "./models";
import { CommonError } from "./error";

export function generateSuccessResponse(result: any, res: Response, msg?: string) {
  let executionTimeInMS: number;
  if (res.locals.requestTime) {
    executionTimeInMS = new Date().getTime() - res.locals.requestTime;
  }
  res.status(200).json({ success: true, message: msg ? msg : null, result, executionTimeInMS });
}

export function generateErrorResponse(error: CommonError, res: Response) {
  let executionTimeInMS: number;
  if (res.locals.requestTime) {
    executionTimeInMS = new Date().getTime() - res.locals.requestTime;
  }
  if (error instanceof Error && typeof error.code === "number") {
    res.status(error.code).json({
      success: false,
      result: null,
      message: error.message,
      executionTimeInMS
    });
  } else {
    res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      executionTimeInMS
    });
  }
}
