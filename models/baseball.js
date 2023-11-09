const baseballModel = {
    getAll:`
        SELECT
            *
        FROM
            baseball
    `,
    getByPARK: `
    SELECT
    *
    FROM
        baseball
    WHERE
        park = ?
    `,
    getByNAME: `
    SELECT
    *
    FROM
        baseball
    WHERE
        NAME = ?
    `,
    getByEmail: `
    SELECT
    *
    FROM
        Users
    WHERE
        email = ?
    `,
    addRow:`
    INSERT INTO
        park (
            park,
            NAME,
            Cover,
            LF_Dim,
            CF_Dim,
            RF_Dim,
            LF_W,
            CF_W,
            RF_W
        ) VALUES (
            ?,?,?,?,?,?,?,?,?
        )
    `,
    updateRow: `
    UPDATE
        baseball
    SET
        park,
        NAME,
        Cover,
        LF_Dim,
        CF_Dim,
        RF_Dim,
        LF_W,
        CF_W,
        RF_W
    WHERE
        park = ?
`,
    deleteRow: `
            UPDATE
                baseball
            SET
                is_active = 0
            WHERE
                id = ?
    `,
}

module.exports = baseballModel;