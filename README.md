# Typescript-checkstyle
Typescript-checkstyle is a tool for reporting `typescript compiler` output in `checkstyle` format. It was created to improve pull request decoration with compiler errors.

## Prerequisites
Project requires:
- nodejs 10
- npm

## Installation
All arifacts are published to npm. To use the latest version, you can install it using:
```
npm i --save-dev @bartekbp/typescript-checkstyle
```

## Usage
Typescript-checkstyle can be used from command line and javascript.

### Command line
Library reads `tsc` output from standard input. You may want to run both of them together. The following command typechecks your project and shows compilation errors in `checkstyle` format:
```
> npx tsc --noEmit | npx @bartekbp/typescript-checkstyle
```

If you already have `npm scripts` configured and want to use output from one of them to  typescript-checkstyle, you need to invoke `npm` with **--silent** to suppress npm prologue:
```
> npm --silent run lint:tsc | npx @bartekbp/typescript-checkstyle
```

### Pull request decoration with typescript errors
If you want to automate adding comments to your pull request based on complier output, typescript-checkstyle will help you achieve it. To configure it, I will use `jenkins`, but the solution applies to other continuous integration systems as well.

#### Jenkins pipleline

You need to setup a `jenkins pipeline` that will be triggered with [bitbucket branch source plugin](https://plugins.jenkins.io/cloudbees-bitbucket-branch-source/) or [github branch source plugin](https://github.com/jenkinsci/github-branch-source-plugin). In the pipeline you need to run typescript-checkstyle with `tsc` and redirect output to a file:
```
stage('tsc') {
  steps {
    sh  'npx tsc --noEmit | npx @bartekbp/typescript-checkstyle > tsc-checkstyle.xml'
  }
}
```
Depending on your code review system, **tomasbjerre** created different plugins for pull request decoration. You can find the full list of them at the bottom of [violations-lib readme](https://github.com/tomasbjerre/violations-lib). I'll focus on the configuration for `bitbucket cloud`.

You need to update pipeline with additional stage for pr decoration:
<pre>
stage('Decorate pr') {
  steps {
    withCredentials([usernamePassword(credentialsId: <strong>'jenkins-pr-writes'</strong>, passwordVariable: 'JENKINS_VIOLATION_PASSWORD', usernameVariable: 'JENKINS_VIOLATION_USER')]) {
      sh 'npx violation-comments-to-bitbucket-cloud-command-line -u "$JENKINS_VIOLATION_USER" -p "$JENKINS_VIOLATION_PASSWORD" -ws <strong>workspace</strong> -rs <strong>repoName</strong> -prid "$CHANGE_ID" -v "CHECKSTYLE" "." ".*tsc-checkstyle.xml$" "tsc" || true'
    }
  }
}
</pre>
The bold parts in the stage needs to updated to reflect your project:
- **jenkins-pr-writes** with credentials to bitbucket user
- **workspace** with bitbucket workspace
- **repoName** with repository that has an opened pull request


### Javascript
Typescript-checkstyle exposes one function `format`:
```
/**
 * Converts tsc errors to checkstyle format
 *
 * @param {string} input - errors from tsc
 * @return {string} errors in checkstyle format
 function format(input) {}
 */
```
You can use it as follows:
```
import format from '@bartekbp/typescript-checkstyle';

const input = `src/test.component.ts(3, 12): error TS2564: Property 'name' has no initializer`;
const errorsInCheckstyleFormat = format(input);
console.log(errorsInCheckstyleFormat);
```

This code prints out errors from `input` in checkstyle format.

## License

Distributed under the MIT License. See LICENSE for more information.

## Acknowledgements
Great thanks to:
- [tomasbjerre](https://github.com/tomasbjerre) for his tools enabling pull request decoration
- [aivenkimmob](https://github.com/aivenkimmob) for tsc output parser
- [jimf](https://github.com/jimf) for tool to convert json to xml checkstyle format
