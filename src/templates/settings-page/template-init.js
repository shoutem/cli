import {instantiateExtensionTemplate} from "../../services/extension-template";

export async function after(context) {
  const { type } = context;
  if (type === 'react') {
    await instantiateExtensionTemplate('settings-page-react', context)
  } else if (type === 'html') {
    await instantiateExtensionTemplate('settings-page-html', context);
  } else if (type === 'blank') {
    await instantiateExtensionTemplate('settings-page-blank', context);
  } else {
    throw new Error(`Invalid page type ${type}`);
  }
}
