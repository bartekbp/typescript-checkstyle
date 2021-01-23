declare module '@aivenio/tsc-output-parser' {
  export const parse: (input: string) => ParseLineOutput[];

  export interface ParseLineOutput {
    type: string;
    value: ParseOutputValue;
  }

  export interface ParseOutputValue {
    path: Message;
    cursor: Cursor;
    tsError: TsError;
    message: Message;
  }

  export interface Cursor {
    type: string;
    value: CursorValue;
  }

  export interface CursorValue {
    line: number;
    col: number;
  }

  export interface Message {
    type: string;
    value: string;
  }

  export interface TsError {
    type: string;
    value: TsErrorValue;
  }

  export interface TsErrorValue {
    type: string;
    errorString: string;
  }
}