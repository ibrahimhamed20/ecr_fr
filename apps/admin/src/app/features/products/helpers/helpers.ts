import { FormGroup } from "@angular/forms";
import { ClassificationsData } from "../interfaces";

export namespace ProductHelper {
  export function buildQueryParams(params: { [key: string]: any }): string {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }

  export function getEnumOptions(enumType: any): { label: string; value: number }[] {
    return Object.keys(enumType)
      .filter((key) => !isNaN(Number(enumType[key])))
      .map((key) => ({
        label: key,
        value: enumType[key],
      }));
  }
}

