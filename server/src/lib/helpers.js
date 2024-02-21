async function findIdsByOption(conn, options, tableName) {
  const columnNames = {
    tbl_tags: 'nombre',
    tbl_cat_sostenibilidad: 'nombre',
    tbl_categorias: 'nombre'
  };

  const columnName = columnNames[tableName];
  if (!columnName) {
    throw new Error('Invalid table name');
  }

  const sql = `
    SELECT id
    FROM ${tableName}
    WHERE ${columnName} IN (${options.map(tag => `'${tag}'`).join(',')})
  `;

  const [results, fields] = await conn.execute(sql);
  return results.map(row => row.id);
}


function transformTagsOrCategories(results, url = false, icon = false) {
  return results.map(result => ({
    id: result.id,
    text: {
      ca: result.name,
      es: result.name_es
    },
    url: url && result.url ? result.url : null,
    icon: icon && result.icon ? `${process.env.ASSETS_URL}/iconos/${result.icon}` : null,
  }));
}


module.exports = {
  findIdsByOption,
  transformTagsOrCategories
};
