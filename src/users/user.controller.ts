import {
  Request,
  Response,
  NextFunction,
  generateSuccessResponse,
  generateErrorResponse,
} from "./../common";
import { UserService } from "./user.service";
import { FraudDetectRequestModel, fraudDetectRequestAdaptor } from "./transaction";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async detectFraud(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const reqModel: FraudDetectRequestModel = fraudDetectRequestAdaptor(
        req
      );
      const output = await this.userService.detectFraud(reqModel);
      return generateSuccessResponse(output, res);
    } catch (error) {
      return generateErrorResponse(error, res);
    }
  }
}
