Tein muutoksia ja parannuksia codeprojektin (https://www.codeproject.com/Articles/5282690/AI-Chatbots-With-TensorFlow-js-Improved-Emotion-De)
tekstistä tunteita tunnistavan chatbotin tutoriaaliin.

Tutoriaalissa modeli tuottaa vain satunnaisia lauseita harjoittamastaan datasta, ja antaa niille arvion tekstin tunteesta, ja kertoo sen kanssa oikean arvon.
Arvioin, että tutoriaalissa toteutettu malli toimisi tarpeeksi hyvin harjoitusdatan ulkopuolisellakin tekstillä, joten tein muutoksia sen teorian pohjalta.

Lisäsin html, puolen sivulle tekstinsyöttökentän ja muutin ohjelman koodin tunnistamaan tämän syötetyn tekstin ja arvioimaan sen tunteita.
Poistin samalla "expected/odotus" arvon, koska sitä ei oikein ole olemassa tässä, muualla kuin kirjoittajan mielessä.
Kirjoitettu teksti ei myöskään harjoita mallia enempään, niin siltäkään kannalta odotetulle arvolle ei ole tarvetta.

Muuten tein pieniä korjauksia ja muutoksia koodiin. Muunmuassa aluksi harjoituksesta jäi sivulle "epoch 49#...", kunnes käyttäjä kirjoitti jotakin.
Lisäsin myös epocheja hieman, loss jäi hieman turhan suureksi vain 50 jälkeen
Aluksi malli harjoitti vain 200 lauseella. Se tuntui hieman liian pieneltä määrältä, joten lisäsin sitä hieman.
