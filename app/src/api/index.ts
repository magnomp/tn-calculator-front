import { useAuthTokenStore } from "@/stores/authToken";
import { AxiosResponse } from "axios";
import { client } from "../axios";

type ApiError = {
  error: string;
  message: string;
};

export enum OperationType {
  addition = "addition",
  subtraction = "subtraction",
  multiplication = "multiplication",
  division = "division",
  square_root = "square_root",
  random_string = "random_string",
}

export class NotEnoughBalanceException extends Error {}

export class BadRequestException extends Error {}

export interface TwoOperands {
  a: number;
  b: number;
}

export interface AuthResult {
  accessToken: string;
}

export interface RecordItem {
  recordId: string;
  operationId: string;
  operationType: OperationType;
  userBalance: number;
  amount: number;
  response: string;
  date: string;
}

export interface RecordsPaginationResultDto {
  total: number;
  items: RecordItem[];
}

export class UnauthorizedException extends Error {}

export class TnCalcApi {
  private readonly authTokenStore = useAuthTokenStore();

  async login(username: string, password: string): Promise<AuthResult> {
    const result = await client.post<AuthResult>("/auth/login", {
      username,
      password,
    });
    if (result.status == 200) return result.data;
    else throw new UnauthorizedException();
  }

  async logout() {
    await client.post("/auth/logout", {
      headers: {
        Authorization: `Bearer ${await this.authTokenStore.getAuthToken()}`,
      },
    });
  }

  async refreshLogin(): Promise<AuthResult> {
    const result = await client.post<AuthResult>("/auth/refresh");
    if (result.status == 200) return result.data;
    else throw new UnauthorizedException();
  }

  async myRecords(
    skip: number,
    take: number,
    operationType?: OperationType
  ): Promise<RecordsPaginationResultDto> {
    const params: any = { skip, take };
    if (operationType) params.operationType = operationType;
    const result = await client.get<RecordsPaginationResultDto>("/records", {
      params,
      headers: {
        Authorization: `Bearer ${await this.authTokenStore.getAuthToken()}`,
      },
    });
    if (result.status == 200) {
      return result.data;
    } else if (result.status == 401) {
      throw new UnauthorizedException();
    } else throw new Error(`/records returned ${result.data}`);
  }

  async deleteRecord(recordId: string): Promise<void> {
    await client.delete(`/records/${recordId}`, {
      headers: {
        Authorization: `Bearer ${await this.authTokenStore.getAuthToken()}`,
      },
    });
  }

  private async perform<Type>(operation: string, params: any): Promise<Type> {
    const result = await client.post<Type | ApiError>(
      `/operations/${operation}`,
      params,
      {
        headers: {
          Authorization: `Bearer ${await this.authTokenStore.getAuthToken()}`,
        },
      }
    );

    if (isSuccess(result)) return result.data;
    else if (isNotSuccess(result)) {
      if (result.data.error == "not-enough-balance")
        throw new NotEnoughBalanceException();
      else if (result.data.error == "Bad Request")
        throw new BadRequestException(result.data.message);
    }
    throw new Error();
  }

  async addition(operands: TwoOperands): Promise<number> {
    return await this.perform<number>("addition", operands);
  }

  async subtraction(operands: TwoOperands): Promise<number> {
    return await this.perform<number>("subtraction", operands);
  }

  async multiplication(operands: TwoOperands): Promise<number> {
    return await this.perform<number>("multiplication", operands);
  }

  async division(operands: TwoOperands): Promise<number> {
    return await this.perform<number>("division", operands);
  }

  async sqrt(radicand: number): Promise<number> {
    return await this.perform<number>("sqrt", { radicand });
  }

  async randomString(): Promise<string> {
    return await this.perform<string>("randomString", undefined);
  }
}

export function useApi() {
  return new TnCalcApi();
}

function isSuccess<T>(
  response: AxiosResponse<T | ApiError>
): response is AxiosResponse<T> {
  return response.status == 200;
}

function isNotSuccess<T>(
  response: AxiosResponse<T | ApiError>
): response is AxiosResponse<ApiError> {
  return response.status == 400;
}
