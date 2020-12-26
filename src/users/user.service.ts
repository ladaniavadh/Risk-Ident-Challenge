import { FraudDetectRequestModel } from "./transaction";

import transactionsInputJson from '../common/inputs/transaction.json';

interface Transaction {
  id: string,
  age: number,
  name: string,
  email: string,
  phone: string,
  geoInfo: {
    latitude: number,
    longitude: number
  },
  children: Transaction[],
  connectionInfo?: {
    type: string,
    confidence: number
  }
  combinedConnectionInfo?: {
    types: string[],
    confidence: number
  }
}

interface Context {
  types: string[],
  confidence: number
}

export class UserService {
  constructor(
  ) {
  }

  public async detectFraud(reqModel: FraudDetectRequestModel) {
    const transactionId = reqModel.transactionId;
    const confidenceLevel = reqModel.confidenceLevel;

    const inputJson: Transaction[] = transactionsInputJson as Array<Transaction>;
    return this.flatter(inputJson, null, [], transactionId, confidenceLevel, false)
  }

  private async flatter(currentObject: Array<Transaction>, parentContext: Context, outputArray: Array<object>,
      transactionId: string, confidenceLevel: number, parentFound: boolean) {
    
    let context: Context
    if (parentContext) {
      context = parentContext
    } else {
      context = { types: [], confidence: 1 }
    }

    for (let obj of currentObject) {
      if (obj.id === transactionId) {

        this.processForParent(obj, context, outputArray, transactionId, confidenceLevel)
        break;

      } else if (parentFound === true && obj.connectionInfo?.confidence * 100 >= confidenceLevel) {

        this.processForChild(obj, context, outputArray, transactionId, confidenceLevel)
        
      } else {
        if (obj.children?.length > 0) {
          this.flatter(obj.children, context, outputArray, transactionId, confidenceLevel, false)
        }
      }
    }

    return outputArray;    
  }

  private processForParent (obj: Transaction, context: Context, outputArray: Array<object>, transactionId: string, confidenceLevel: number) {
    const newContext = JSON.parse(JSON.stringify(context))
    if (obj.connectionInfo) {
      newContext.types = (newContext.types).concat(obj.connectionInfo.type)
      newContext.confidence = (newContext.confidence * obj.connectionInfo.confidence).toFixed(3)
    }

    const newObj = JSON.parse(JSON.stringify(obj))
    delete newObj.children
    outputArray.push(newObj)

    if (obj.children?.length > 0) {
      this.flatter(obj.children, newContext, outputArray, transactionId, confidenceLevel, true)
    }
  }

  private processForChild (obj: Transaction, context: Context, outputArray: Array<object>, transactionId: string, confidenceLevel: number) {
    const newContext = JSON.parse(JSON.stringify(context))
    if (obj.connectionInfo) {
      newContext.types = (newContext.types).concat(obj.connectionInfo.type)
      newContext.confidence = (newContext.confidence * obj.connectionInfo.confidence).toFixed(3)
    }

    const newObj = JSON.parse(JSON.stringify(obj))
    newObj.combinedConnectionInfo = JSON.parse(JSON.stringify(newContext))
    delete newObj.children
    outputArray.push(newObj)

    if (obj.children?.length > 0) {
      this.flatter(obj.children, newContext, outputArray, transactionId, confidenceLevel, true)
    }
  }
}
