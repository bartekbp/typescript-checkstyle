#!/usr/bin/env node

import yargs from 'yargs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hideBin } from 'yargs/helpers';
import getStdin from 'get-stdin';
import format from './format';

const main = async (): Promise<void> => {
  yargs(hideBin(process.argv))
    .usage('Usage: $0 < tscOutput.txt > checkstyle.xml')
    .argv;


  const stdIn = await getStdin();
  const output = format(stdIn);
  console.log(output);
};

main();
