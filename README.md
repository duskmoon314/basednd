# basednd

Encode your binary data into a list of DND spells.

## Specification

`basednd` encodes and decodes binary data in following steps:

### Encode

1. Convert the binary data into a list of bytes.
2. Transform each byte into its decimal representation and pad it to 3 digits with leading zeros.
   - `a` -> `097`
3. For each digit, randomly select a spell from its corresponding level.
   - `097` -> `Acid Splash`, `Wish`, `Simulacrum`
4. Concatenate the spell names with two spaces between them.
   - `Acid Splash  Wish  Simulacrum`
5. If a language is specified, the spell names will be translated into that language.
   - e.g. `zh` will translate the above encoded string into `酸液飞溅  祝愿术  拟像术`.

### Decode

1. Split the encoded string by two spaces.
2. For each spell name, find the corresponding spell level
3. Group the spell levels into 3-digit numbers.
4. Convert the 3-digit numbers into bytes.

## Repo Structure

- `lib/`: Contains the implementation of `basednd` in different languages.
  - `node`: A simple prototype implementation in Node.js.
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

## License

All the code in this repository is licensed under the MIT license.

## Contributing

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you shall be licensed as above, without any additional terms or conditions.

### Improve the database

Currently, the database is built based on [mythril-forge/vanilla-spells](https://github.com/mythril-forge/vanilla-spells). If you find any missing spells or incorrect information, please open an issue or PR to fix it.

Contributions on adding more languages are also welcome. Only `zh` is partial supported for now.

### Add more implementations

If you want to implement `basednd` in another language, feel free to open a PR. The implementation should be able to encode and decode binary data.
