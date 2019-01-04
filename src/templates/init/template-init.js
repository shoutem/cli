import path from 'path';
import 'colors'

export function before(context) {
  const { devName, extJson, extensionPath } = context;
  context.extensionPath = path.join(extensionPath, `${devName}.${extJson.name}`);
}
