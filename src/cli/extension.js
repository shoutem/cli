export const description = 'Manage extensions within the current app';
export const command = 'extension <command>';
export const builder = page => {
    return page
        .commandDir('extension')
        .usage(`shoutem ${command}\n\n${description}`)
        .strict();
};
