// Tunteiden tunnistamiseen tekstistä harjoitettu modeli.
// Tunteet, jotka malli on opetettu tunnistamaan
const emotions = [
    "admiration",
    "amusement",
    "anger",
    "annoyance",
    "approval",
    "caring",
    "confusion",
    "curiosity",
    "desire",
    "disappointment",
    "disapproval",
    "disgust",
    "embarrassment",
    "excitement",
    "fear",
    "gratitude",
    "grief",
    "joy",
    "love",
    "nervousness",
    "optimism",
    "pride",
    "realization",
    "relief",
    "remorse",
    "sadness",
    "surprise",
    "neutral"
];

// Statuksen tekstikentän muuttamis funktio
function setText(text) {
    document.getElementById("status").innerText = text;
}

// Randomisoi listan järjestyksen. Hyödyllinen harjoittaessa, koska se estää
// modelia oppimasta datapisteiden syöttöjärjestystä.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

(async () => {
    /* DATAN ESIKÄSITTELY 
    * Ladataan goemotions data (https://github.com/google-research/google-research/tree/master/goemotions)
    * Sisältää tuhansia redditistä kerättyjä kommentteja, niihin kuuluvien tunteiden kanssa.
    */
    let data = await fetch("web/emotions.tsv").then(r => r.text());
    let lines = data.split("\n").filter(x => !!x); // filtteroi pois tyhjät rivit

    // randomisoidaan listan lauseiden järjestys.
    shuffleArray(lines);

    // Inputit ovat tässä mallissa redditistä kerättyjä kommentteja. Outputit ovat niiden tunteet
    // Otetaan dokumentista 500 eri datapistettä. Tunteita on 27 erilaista, joten tarvitaan runsaasti dataa, 
    // jotta malli oppii kaikkien tunteiden tunnistamisen
    const numSamples = 500;
    // Tekee jokaisesta rivistä/lauseesta oman pisteen taulukkoon.
    let sentences = lines.slice(0, numSamples).map(line => {
        let sentence = line.split("\t")[0];
        return sentence;
    });
    let outputs = lines.slice(0, numSamples).map(line => {
        let categories = line.split("\t")[1].split(",").map(x => parseInt(x));
        let output = [];
        for (let i = 0; i < emotions.length; i++) {
            output.push(categories.includes(i) ? 1 : 0);
        }
        return output;
    });

    // Ladataan universal sentence encoder. 
    setText("Loading USE...");
    let encoder = await use.load();
    setText("Loaded!");
    // console.log(sentences);
    let embeddings = await encoder.embed(sentences);// Normalisoi ja muuttaa inputit eli lauseet tensoreiksi

    // MODELIN LUOMINEN
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 100, activation: "relu", inputShape: [512] }));
    model.add(tf.layers.dense({ units: 50, activation: "relu" }));
    model.add(tf.layers.dense({ units: 25, activation: "relu" }));
    model.add(tf.layers.dense({
        units: emotions.length,
        activation: "softmax"
    }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
    });

    // MODELIN HARJOITTAMINEN
    const xs = embeddings;
    const ys = tf.stack(outputs.map(x => tf.tensor1d(x))); // outputit eli tunteet tensoreiksi
    await model.fit(xs, ys, {
        epochs: 80,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                setText(`Training... Epoch #${epoch} (${logs.acc})`);
                console.log("Epoch #", epoch, logs);
            }
        }
    });
    setText('training complete'); //Tulostetaan sivulle, kun harjoitus on valmis, ja ohjelmaa voi käyttää.

    // MODELIN KÄYTTÖ
    // Lukee kirjoitetun tekstin ja luo sen perusteella prediction
    document
        .getElementById('submit')
        .addEventListener('click', async function (event) {
            let sentence = document.getElementById("question").value;

            let vector = await encoder.embed([sentence]);
            let prediction = await model.predict(vector).data();
            // Get the index of the highest value in the prediction
            let id = prediction.indexOf(Math.max(...prediction));
            setText(`Result: ${emotions[id]}`);
        });
})();