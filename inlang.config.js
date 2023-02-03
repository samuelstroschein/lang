// https://inlang.com/documentation
export async function defineConfig(env) {
    const plugin = await env.$import("https://cdn.jsdelivr.net/gh/samuelstroschein/inlang-plugin-json@1/dist/index.js");

    const pluginConfig = {
        pathPattern: "./locales/{language}/json.json",
    };

    return {
        referenceLanguage: "en",
        languages: await getLanguages(env),
        readResources: (args) => plugin.readResources({ ...args, ...env, pluginConfig }),
        writeResources: (args) => plugin.writeResources({ ...args, ...env, pluginConfig }),
    };
}

/**
 * Automatically derives the languages in this repository.
 *
 * Scans the `locales` directory for directories and returns their names.
 * The names of those directories are the language codes used by Laravel.
 */
async function getLanguages(env) {
    const localeDirectory = "./locales";
    const contents = await env.$fs.readdir(localeDirectory);
    const directories = await Promise.all(
        contents.map(async (content) => {
            const stat = await env.$fs.stat(`${localeDirectory}/${content}`);
            if (stat.isDirectory()) return content;
        })
    );
    return directories;
}
