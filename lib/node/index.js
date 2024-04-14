import SqlJs from "sql.js";

class BaseDnd {
  // Accessor of the database
  #data;

  // Prepared statement for getting a random spell of a given level
  #level2spellStmt;

  // Prepared statement for getting the level of a given spell
  #spell2levelStmt;

  // Prepared statement for translating the spell names
  #orig2tranStmt;

  // Prepared statement for translating back the spell names
  #tran2origStmt;

  async loadData(buffer) {
    const sql = await SqlJs();
    this.#data = new sql.Database(buffer);
    this.#level2spellStmt = this.#data.prepare(
      "SELECT * FROM spell WHERE level = $level ORDER BY RANDOM();"
    );
    this.#spell2levelStmt = this.#data.prepare(
      "SELECT * FROM spell WHERE name = $name;"
    );
    this.#orig2tranStmt = this.#data.prepare(
      "SELECT * FROM i18n WHERE lang = $lang AND orig = $orig;"
    );
    this.#tran2origStmt = this.#data.prepare(
      "SELECT * FROM i18n WHERE lang = $lang AND tran = $tran;"
    );
  }

  level2spell(level) {
    return this.#level2spellStmt.getAsObject({ $level: level }).name;
  }

  spell2level(name) {
    return this.#spell2levelStmt.getAsObject({ $name: name }).level;
  }

  orig2tran(lang, orig) {
    return this.#orig2tranStmt.getAsObject({ $lang: lang, $orig: orig }).tran;
  }

  tran2orig(lang, tran) {
    return this.#tran2origStmt.getAsObject({ $lang: lang, $tran: tran }).orig;
  }

  encode(input, lang) {
    const binary = new Uint8Array(Buffer.from(input));

    const repr = Array.from(binary)
      .map((byte) => {
        const str = byte.toString();
        // pad 0 to 3 digits
        return "0".repeat(3 - str.length) + str;
      })
      .join("")
      .split("");

    const encoded = repr.map((char) => {
      const level = parseInt(char, 10);

      let name = "";
      while (name === "") {
        name = this.level2spell(level);
        if (lang) {
          name = this.orig2tran(lang, name) || "";
        }
      }
      return name;
    });
    return encoded.join("  ");
  }

  decode(input, lang) {
    const words = input.split("  ");

    const repr = words
      .map((word) => {
        const name = lang ? this.tran2orig(lang, word) : word;
        const level = this.spell2level(name);
        return level;
      })
      .reduce((decode, level, idx) => {
        if (idx % 3 < 2) {
          return [...decode, level];
        }
        const last = decode.pop();
        const last2 = decode.pop();
        return [...decode, last2 * 100 + last * 10 + level];
      }, []);

    return Uint8Array.from(repr);
  }
}

export default BaseDnd;
