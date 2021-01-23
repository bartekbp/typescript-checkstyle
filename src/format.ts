import { parse, ParseLineOutput } from '@aivenio/tsc-output-parser';
import checkstyleFormatter, {FileEntry, Message} from 'checkstyle-formatter';
import { groupBy, sortBy } from 'lodash/fp';

interface ErrorDetails {
  message: string;
  tsErrorCode: string;
  cursor: {
    line: number;
    column: number;
  }
}

export default (input: string): string => {
  // parsing library doesnt support windows, so let's workaround it
  // by replacing windows line endings with linux
  const sanitizedInput = input.replace(/\r\n/g, '\n')
  const lines: ParseLineOutput[] = parse(sanitizedInput);

  const errors: { file: string, details: ErrorDetails }[] = lines.map(line => {
    const details = line.value;
    const file = details.path.value;
    const position = details.cursor.value;
    const message = details.message.value;
    const errorCode = details.tsError.value.errorString;

    return {
      file,
      details: {
        cursor: {
          line: position.line,
          column: position.col,
        },
        message,
        tsErrorCode: errorCode,
      }
    }
  });

  const errorsPerFile = groupBy(line => line.file, errors);
  const sortedFiles = Object.keys(errorsPerFile);
  const fileEntries: FileEntry[] = sortedFiles.map(filename => {
    const errorDetails = errorsPerFile[filename]
      .map(error => error.details);
    const sortedDetails = sortBy(['cursor.line', 'cursor.column'], errorDetails);
    const messages: Message[] = sortedDetails.map(details => ({
      line: details.cursor.line,
      column: details.cursor.column,
      severity: 'error',
      message: details.message.trim(),
      source: details.tsErrorCode
    }));

    return {
      filename,
      messages
    }
  })

  return checkstyleFormatter(fileEntries);
}