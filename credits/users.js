// some of the code was taken from PenguinMod
const shuffle = list => {
    for (let i = list.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        const tmp = list[i];
        list[i] = list[random];
        list[random] = tmp;
    }
    return list;
};

const fromHardcodedGithub = username => ({
    image: `https://github.com/${username}.png`,
    href: `https://github.com/${username}/`,
    text: username
});

const smDevelopers = [
    'GabsTheCuriousKid',
].map(fromHardcodedGithub);

const smSuggestors = [
    'supervoidcoder',
    'MellowTheDragon',
    'Civ3ro',
    'DLGrass',
    'ampelc',
    'LanwyWriteXU',
    'DDguan2010',
    'gradylink',
    'Mistium',
].map(fromHardcodedGithub);

const smDarkMode = [
    'KOSHINOawa',
].map(fromHardcodedGithub);

export {
    smDevelopers: shuffle(smDevelopers),
    smSuggestors: shuffle(smSuggestors),
    smDarkMode: shuffle(smDarkMode)
}