# Werkboekjes toevoegen

De pagina **Werkboekjes** (`werkbladen/werkboekjes.html`) toont alle werkboekjes
als een soort webshop: een raster met kaarten, links een filter en bij een klik
een voorbeeld met download-knop. De pagina leest alle gegevens uit
`werkboekjes/werkboekjes.json`. Je hoeft dus geen code aan te passen.

## Een nieuw werkboekje toevoegen (3 stappen)

1. **Upload de PDF** in de map `werkboekjes/pdfs/`.
   Gebruik een eenvoudige bestandsnaam zonder spaties, bijv.
   `rekenen-groep6-breuken.pdf`.

2. **Voeg een blok toe** aan de lijst `"werkboeken"` in
   `werkboekjes/werkboekjes.json`:

   ```json
   {
     "titel": "Rekenen groep 6 - breuken",
     "categorie": "rekenen",
     "beschrijving": "Korte beschrijving die rechts naast het voorbeeld verschijnt.",
     "bestand": "rekenen-groep6-breuken.pdf",
     "cover": ""
   }
   ```

3. **Klaar.** De kaart verschijnt automatisch in het juiste filter.

## Velden

| Veld           | Verplicht | Uitleg |
|----------------|-----------|--------|
| `titel`        | ja        | Naam van het werkboekje (op de kaart en in het voorbeeld). |
| `categorie`    | ja        | Eén filter, óf meerdere als lijst: `["rekenen", "weektaak"]`. Moet overeenkomen met de lijst `categorieen` bovenaan het bestand. |
| `beschrijving` | ja        | Korte tekst rechts naast het voorbeeld. |
| `bestand`      | ja        | Bestandsnaam van de PDF in `werkboekjes/pdfs/`. |
| `cover`        | nee       | Optionele omslagafbeelding in `werkboekjes/covers/`. Laat leeg (`""`) voor een automatische omslag met de titel. |

## Downloadnaam

De download krijgt automatisch een nette naam op basis van de categorie:
het eerste boek van *gouden weken* downloadt als `goudenweken_leerblad.pdf`,
het tweede als `goudenweken2_leerblad.pdf`, enzovoort. Je hoeft hier niets
voor in te stellen. Wil je toch een eigen naam? Voeg dan `"downloadnaam":
"eigen_naam"` toe aan het blok.

## Filters wijzigen

De filters staan bovenaan in `"categorieen"`. Voeg hier een categorie toe of
verwijder er een; de filterlijst op de pagina past zich vanzelf aan.

## De voorbeelden verwijderen

De zes `voorbeeld-*.pdf` bestanden en de bijbehorende blokken in de JSON zijn
alleen bedoeld om te laten zien hoe het werkt. Verwijder ze zodra je je eigen
werkboekjes hebt toegevoegd.
