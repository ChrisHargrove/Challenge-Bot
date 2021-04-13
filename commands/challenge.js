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
    execute(Context, message, args) {

        if (args.length == 0) {
            var genre = null;
            var assetType = null;
            if (Context.previousChallenge != null) {
                var count = 0;
                do {
                    genre = genres[Math.floor(Math.random() * genres.length)];
                    count++;
                } while (genre === previousChallenge.Genre && count < 5);
                count = 0;
                do {
                    assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
                    count++;
                } while (assetType === Context.previousChallenge.AssetType && count < 5);
            }
            else {
                genre = genres[Math.floor(Math.random() * genres.length)];
                assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
            }
            var assetSubType = pickSubAssetType(assetType);

            Context.previousChallenge = {
                Genre: genre,
                AssetType: assetType,
                AssetSubType: assetSubType,
            };
            fs.writeFileSync('./previousChallenge.json', JSON.stringify(Context.previousChallenge));
            console.log(JSON.stringify(Context.previousChallenge));

            var challengeMessage = {
                embed: {
                    color: 3447003,
                    title: "This weeks challenge!",
                    fields: [
                        { name: "Genre", value: genre, inline: true },
                        { name: "Asset Type", value: assetType, inline: true },
                        { name: "Sub Type", value: assetSubType, inline: true }
                    ]
                }
            };

            message.channel.send(challengeMessage)
                .then(msg => {
                    msg.react('✅')
                        .catch(console.error);
                    msg.react('❎')
                        .catch(console.error);
                })
                .catch(console.error);

            DatabaseChannel.send(challengeMessage)
                .catch(console.error);
        }
        else {
            message.channel.send("Challenge with arguments not implemented");
        }
    },
};