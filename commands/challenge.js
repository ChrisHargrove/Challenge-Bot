const fs = require('fs');

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

let previousChallenge = null;

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
        //If previous Challenge is null, load from file
        if (previousChallenge === null) {
            previousChallenge = JSON.parse(fs.readFileSync('./previousChallenge.json'));
            console.log(previousChallenge);
        }

        if (args.length == 0) {
            var genre = null;
            var assetType = null;
            if (previousChallenge != null) {
                var count = 0;
                do {
                    genre = genres[Math.floor(Math.random() * genres.length)];
                    count++;
                } while (genre === previousChallenge.Genre && count < 5);
                count = 0;
                do {
                    assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
                    count++;
                } while (assetType === previousChallenge.AssetType && count < 5);
            }
            else {
                genre = genres[Math.floor(Math.random() * genres.length)];
                assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
            }
            var assetSubType = pickSubAssetType(assetType);

            previousChallenge = {
                Genre: genre,
                AssetType: assetType,
                AssetSubType: assetSubType,
            };
            fs.writeFileSync('./previousChallenge.json', JSON.stringify(previousChallenge));

            message.channel.send({
                embed: {
                    color: 3447003,
                    title: "This weeks challenge!",
                    fields: [
                        { name: "Genre", value: genre, inline: true },
                        { name: "Asset Type", value: assetType, inline: true },
                        { name: "Sub Type", value: assetSubType, inline: true }
                    ]
                }
            });
        }
        else {
            message.channel.send("Challenge with arguments not implemented");
        }
    },
};