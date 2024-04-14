# basednd

Encode your binary data into a list of DND spells.

## Repo Structure

- `lib/`: Contains the implementation of `basednd` in different languages.
- `spells.db`: A sqlite3 file contains the list of DND spells with i18n support.
  - table `spell`:
    - `id`: Unique Integer ID
    - `name`: Name of the spell
    - `level`: Level of the spell (0 for cantrip)
    - `school`: School of the spell
  - table `i18n`:
    - `lang`: Language code (e.g. `zh`)
    - `orig`: Original English text
    - `tran`: Translated text
