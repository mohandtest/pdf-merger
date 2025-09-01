# PDF-sammenslåing

Et komplett offline verktøy for å slå sammen flere PDF-filer til ett dokument. All behandling skjer i nettleseren uten eksterne avhengigheter - ingen filer blir lagret på servere og ingen nettverksforespørsler gjøres etter at siden er lastet.

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

Fungerer i alle moderne nettlesere:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Filstørrelsesgrenser

Klientside behandling er begrenset av tilgjengelig nettleserminne. For svært store PDF-filer (>100MB hver), vurder å dele store filer først.

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
