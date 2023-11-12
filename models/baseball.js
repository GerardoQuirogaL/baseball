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
    addRow:`
    INSERT INTO
        baseball (
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
        
        NAME = ?,
        Cover = ?,
        LF_Dim = ?,
        CF_Dim = ?,
        RF_Dim = ?,
        LF_W = ?,
        CF_W = ?,
        RF_W = ?
    WHERE
        park = ?
`,
    deleteRow: `
            DELETE 
            FROM
                baseball
            WHERE
                park = ?
    `
}

module.exports = baseballModel;