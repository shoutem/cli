import path from 'path';
import 'colors'

export async function before(context) {
  const { devName, extJson, extensionPath } = context;
  context.extensionPath = path.join(extensionPath, `${devName}.${extJson.name}`);
}
