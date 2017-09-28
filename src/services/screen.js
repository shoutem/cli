import {isVariableName} from "./cli-parsing";
import * as inquirer from "inquirer";

export function createScreenQuestions() {
  return [{
    type: 'input',
    name: 'name',
    message: 'Screen name:',
    validate: name => isVariableName(name) || 'Screen name must be a valid js variable name',
    default: 'MyScreen',
  }];
}

export async function askScreenCreationQuestions() {
  return await inquirer.prompt(createScreenQuestions());
}
