declare module 'checkstyle-formatter' {
  export default CheckstyleFormatter;
  function CheckstyleFormatter(input: FileEntry[]): string;

  export interface Message {
    line: number;
    column: number;
    severity: 'error' | 'warning',
    message: string
  }

  export interface FileEntry {
    filename: string;
    messages: Message[]
  }
}