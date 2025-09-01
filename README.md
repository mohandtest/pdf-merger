# PDF-sammenslåing
Et komplett verktøy for å slå sammen flere PDF-filer til ett dokument. All behandling skjer i nettleseren uten eksterne avhengigheter - ingen filer blir lagret på servere og ingen nettverksforespørsler gjøres etter at siden er lastet. [Test her.](https://mohandtest.github.io/pdf-merger/)

## Motivasjon
Ønsket ikke å bruke tilfeldige nettsider som mest sannsynlig samler data om deg og filene du laster opp.

## Funksjoner

- **100% offline**: Ingen eksterne CDN-avhengigheter - alle biblioteker er lagret lokalt
- **Klientside behandling**: All PDF-sammenslåing skjer i nettleseren din
- **Personvern først**: Ingen filer blir lastet opp til eller lagret på servere
- **Null nettverksforespørsler**: Etter sidens lasting gjøres ingen eksterne nettverkskall
- **Responsivt design**: Fungerer på desktop, nettbrett og mobil
- **Dra og slipp**: Bare dra PDF-filer til opplastingsområdet
- **Egendefinert dra-for-å-sortere**: Egendefinert implementering for å omorganisere filer før sammenslåing
- **Fremdriftssporing**: Se sanntids fremgang under sammenslåing
- **Rask**: Ingen serverrundt-turer, øyeblikkelig behandling

## Bruk

1. Åpne `index.html` i nettleseren din
2. Dra og slipp PDF-filer til opplastingsområdet, eller klikk "Velg filer"
3. Dra filer ved håndtaket (⋮⋮) for å omorganisere dem før sammenslåing
4. Klikk "Slå sammen PDF-er" for å kombinere dem
5. Den sammenlåtte PDF-en blir automatisk lastet ned

## Tekniske detaljer

- **PDF-lib**: JavaScript-bibliotek for PDF-manipulering (lagret lokalt) - [pdf-lib.js.org](https://pdf-lib.js.org/)
- **Egendefinert Sortable**: Lett dra-og-slipp-implementering (ingen eksterne avhengigheter)
- **Moderne Web API-er**: FileReader, Blob, URL.createObjectURL

## Filstruktur

```
pdf-merge/
├── index.html          # Hovedgrensesnittet
├── style.css           # Styling inspirert av NTNU
├── script.js           # Hovedapplikasjonslogikk
├── sortable.js         # Egendefinert dra-og-slipp-implementering
├── pdf-lib.min.js      # Lokalt PDF-behandlingsbibliotek
└── README.md           # Denne filen
```

## Personvern og sikkerhet

- **Ingen eksterne nettverksforespørsler** etter første sidesinnlasting
- **Ingen CDN-avhengigheter** - alle biblioteker er lagret lokalt
- **All behandling skjer i nettleserminne** - filer forlater aldri enheten din
- **Ingen midlertidige filer** opprettet på server eller disk
- **Ingen analyse- eller sporingskode**

## Nettleserstøtte

Burde fungere i alle moderne nettlesere:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Filstørrelsesgrenser og begrensninger

### 📏 **Grenser:**
- **Maksimal filstørrelse:** 50MB per PDF-fil
- **Maksimal total størrelse:** 200MB for alle filer samlet
- **Maksimalt antall filer:** 20 PDF-filer samtidig
- **Advarsel ved store filer:** Konfirmasjonsmelding ved >50MB total størrelse

### ⚠️ **Begrensninger:**
- **Minnebruk:** Klientside behandling er begrenset av tilgjengelig nettleserminne
- **Ytelse:** Svært store filer (>100MB) eller mange sider kan gi treg behandling
- **Nettleser:** Eldre nettlesere kan ha lavere minnesgrenser

### 🛡️ **Feilhåndtering:**
- **Filtype-validering:** Bare PDF-filer aksepteres
- **Størrelsesjekker:** Validerer både individuelle filer og total størrelse
- **PDF-validering:** Sjekker at filer er gyldige PDF-dokumenter
- **Minnefeilhåndtering:** Spesifikke feilmeldinger for minneproblemer
- **Detaljert logging:** Console-logger for feilsøking
- **Brukervenlige meldinger:** Norske feilmeldinger med forslag til løsning

## Helt offline

Denne applikasjonen kan fungere helt offline når den er lastet. Du kan:
1. Laste ned alle filer til din lokale maskin
2. Åpne `index.html` i hvilken som helst nettleser
3. Slå sammen PDF-er uten internettforbindelse

## Akademisk verktøy

Dette verktøyet er designet som et selvhjelpserktøy for forelesere og studenter ved NTNU, slik at de ikke trenger å bruke eksterne nettsteder for PDF-sammenslåing.

## Credits

- **PDF-lib**: Takk til [Hopding](https://github.com/Hopding) og bidragsyterne til [PDF-lib](https://github.com/Hopding/pdf-lib) for det fantastiske JavaScript PDF-biblioteket
- **Inspirasjon**: Design inspirert av NTNU's DokuWiki-plattform

## Contributing

Feel free to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source. Feel free to use and modify as needed.
