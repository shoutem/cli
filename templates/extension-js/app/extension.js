// This file is managed by Shoutem CLI
// It exports screens and themes from extension.json
// You should not change it manually
{{#screensImports}}

// screens imports
{{{screensImports}}}
{{/screensImports}}
{{#themesImports}}

// themes imports
{{{themesImports}}}
{{/themesImports}}
{{#screensNames}}

export const screens = {
{{screensNames}}
};
{{/screensNames}}
{{#themesNames}}

export const themes = {
{{themesNames}}
};
{{/themesNames}}