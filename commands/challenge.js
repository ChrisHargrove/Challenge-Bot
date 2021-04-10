const genres = [
    "sci-fi",
    "fantasy",
    "horror",
    "realism",
];

const assetTypes = [
    "weapons",
    "vehicles",
    "foliage",
    "clutter",
    "buildings",
    "creature",
];

const weaponTypes = [
    "close-combat",
    "ranged",
    "exposive",
    "trap",
];

const vehicleTypes = [
    "ground",
    "water",
    "flying",
];

const foliageTypes = [
    "tree",
    "bush",
    "flowers",
];

const creatureTypes = [
    "biped",
    "quadraped",
    "insect",
    "sea",
    "flying"
];

function pickSubAssetType(assetType) {
    switch (assetType) {
        case "weapons":
            return weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        case "vehicles":
            return vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        case "foliage":
            return foliageTypes[Math.floor(Math.random() * foliageTypes.length)];
        case "clutter":
            return "clutter";
        case "buildings":
            return "building";
        case "creature":
            return creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
    }
}

module.exports = {
    name: 'challenge',
    description: 'Start a challenge!',
    execute(message, args) {
        if (args.length == 0) {
            //First choose genre
            var genre = genres[Math.floor(Math.random() * genres.length)];
            //Second choose asset type
            var assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
            var assetSubType = pickSubAssetType(assetType);

            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "This weeks challenge!",
                    fields: [
                        { name: "Genre", value: genre, inline: true },
                        { name: "Asset Type", value: assetType, inline: true },
                        { name: "Sub Type", value: assetSubType, inline = true }
                    ]
                }
            });
        }
        else {
            message.channel.send("Challenge with arguments not implemented");
        }
    },
};