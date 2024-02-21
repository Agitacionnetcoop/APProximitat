const mysql = require("mysql2/promise");
require('dotenv').config()
const { findIdsByOption, transformTagsOrCategories } = require('../lib/helpers');

let pool = null;

function getDatabase() {
  async function connection() {
    if (!pool) {
      console.log('Creating connection pool...');
      pool = mysql.createPool({
        host: process.env.EXTERNAL_DATABASE_HOST,
        user: process.env.EXTERNAL_DATABASE_USER,
        password: process.env.EXTERNAL_DATABASE_PWD,
        database: process.env.EXTERNAL_DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      pool.on('connection', function (connection) {
        console.log('DB Connection established');
        connection.on('error', function (err) {
          console.error(new Date(), 'MySQL error', err.code);
        });
        connection.on('close', function (err) {
          console.error(new Date(), 'MySQL close', err);
        });
      });
    }
    console.log('Getting connection from pool...');
    return pool;
  }

  //BASE INFO
  async function getLiterals() {
    const sql = `SELECT * FROM tbl_literales`;
    const conn = await connection();
    const [results, fields] = await conn.query(sql);

    const literals = results.reduce((acc, result) => {
      acc[result.id] = {
        ca: result.ca,
        es: result.es
      };
      return acc;
    }, {});

    return literals;
  }

  async function getIcons() {
    const sql = `SELECT * FROM def_icons`;
    const conn = await connection();
    const [results, fields] = await conn.query(sql);

    const icons = results.reduce((acc, result) => {
      acc[result.id] = {
        icon: result.icon,
        file: `${process.env.ASSETS_URL}/admin${result.icon_file}`
      };
      return acc;
    }, {});

    return icons;
  }

  async function getCategories() {
    const sql = `
      SELECT
        tbl_categorias.id id,
        tbl_categorias.nombre name,
        tbl_categorias.nombre_es name_es
      FROM
        tbl_categorias
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql);

    const categories = transformTagsOrCategories(results);

    return categories;

  }

  async function getSustainabilityTags() {
    const sql = `
      SELECT
        tbl_cat_sostenibilidad.id id,
        tbl_cat_sostenibilidad.nombre name, 
        tbl_cat_sostenibilidad.nombre_es name_es,
        tbl_cat_sostenibilidad.url url,
        tbl_cat_sostenibilidad.icon icon
      FROM
        tbl_cat_sostenibilidad
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql);

    const sustainabilityTags = transformTagsOrCategories(results, url = true, icon = true);

    return sustainabilityTags;
  }

  async function getActivitiesTags() {
    const sql = `
      SELECT 
        tbl_cat_actividades.id,
        tbl_cat_actividades.nombre,
        tbl_cat_actividades.nombre_es
      FROM tbl_cat_actividades
      LEFT JOIN tbl_actividades ON tbl_actividades.id_cat_actividad = tbl_cat_actividades.id
      WHERE
        tbl_actividades.data_fi > ?
      GROUP BY
        tbl_cat_actividades.id
    `;

    const date = [new Date().toISOString()];
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [date]);

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        results[i].text = {
          ca: results[i].nombre,
          es: results[i].nombre_es
        };

        delete results[i].nombre;
        delete results[i].nombre_es;
      }
    }

    return { tags: results };
  }

  //HOME (PREFERENCES FILTERS)
  async function getPreferencesShops(sustainabilityNames = [], categoryNames = []) {
    const conn = await connection();

    let sustainabilityTagCondition = '';
    if (sustainabilityNames.length > 0) {
      const sustainabilityTagIds = await findIdsByOption(conn, sustainabilityNames, "tbl_cat_sostenibilidad");
      sustainabilityTagCondition = `catData.sustainabilityTagId IN ('${sustainabilityTagIds.join("','")}')`;
    } else {
      sustainabilityTagCondition = '1';
    }

    let categoryCondition = '';
    if (categoryNames.length > 0) {
      const categoryIds = await findIdsByOption(conn, categoryNames, "tbl_categorias");
      categoryCondition = `catData.catId IN ('${categoryIds.join("','")}')`;
    } else {
      categoryCondition = '1';
    }

    const sql = `
      SELECT
        catData.catId,
        catData.catName,
        catData.shopId,
        catData.shopName,
        catData.shopDescription,
        GROUP_CONCAT(DISTINCT files.file) as images,
        GROUP_CONCAT(DISTINCT tags.tagId) as tagIds,
        GROUP_CONCAT(DISTINCT tags.tagName) as tagNames,
        GROUP_CONCAT(DISTINCT tags.tagName_es) as tagNames_es,
        GROUP_CONCAT(DISTINCT sustainabilityTags.sustainabilityTagId) as sustainabilityTagIds,
        GROUP_CONCAT(DISTINCT sustainabilityTags.sustainabilityTagName) as sustainabilityTagNames,
        GROUP_CONCAT(DISTINCT sustainabilityTags.sustainabilityTagName_es) as sustainabilityTagNames_es
      FROM (
        SELECT
          tbl_categorias.id AS catId,
          tbl_categorias.nombre AS catName,
          tbl_comercios.id AS shopId,
          tbl_comercios.nombre AS shopName,
          tbl_comercios.descripcion AS shopDescription,
          tbl_cat_sostenibilidad.id AS sustainabilityTagId,
          ROW_NUMBER() OVER (PARTITION BY tbl_categorias.id ORDER BY tbl_cat_sostenibilidad.id DESC) as sustainability_priority
        FROM
          tbl_categorias
          LEFT JOIN tbl_comercios ON tbl_comercios.id_cat = tbl_categorias.id
          LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_comercio = tbl_comercios.id
          LEFT JOIN tbl_cat_sostenibilidad ON tbl_cat_sostenibilidad.id = tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad
        WHERE
          tbl_comercios.activo = 1
      ) AS catData
      LEFT JOIN tbl_files AS files ON catData.shopId = files.id_comercio AND files.file IS NOT NULL
      LEFT JOIN (
        SELECT
          tbl_comercios.id AS shopId,
          tbl_tags.id AS tagId,
          tbl_tags.nombre AS tagName,
          tbl_tags.nombre_es AS tagName_es
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_comercio_tag ON tbl_rel_comercio_tag.id_comercio = tbl_comercios.id
          LEFT JOIN tbl_tags ON tbl_tags.id = tbl_rel_comercio_tag.id_tag
      ) AS tags ON catData.shopId = tags.shopId
      LEFT JOIN (
        SELECT
          tbl_comercios.id AS shopId,
          tbl_cat_sostenibilidad.id AS sustainabilityTagId,
          tbl_cat_sostenibilidad.nombre AS sustainabilityTagName,
          tbl_cat_sostenibilidad.nombre_es AS sustainabilityTagName_es
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_comercio = tbl_comercios.id
          LEFT JOIN tbl_cat_sostenibilidad ON tbl_cat_sostenibilidad.id = tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad
      ) AS sustainabilityTags ON catData.shopId = sustainabilityTags.shopId
      WHERE
        ${sustainabilityTagCondition} AND
        catData.sustainability_priority <= 10 AND
        ${categoryCondition}
      GROUP BY
        catData.catId, catData.shopId
      ORDER BY
        catData.catName,
        catData.sustainability_priority ASC,
        catData.shopName;
    `;

    const [results, fields] = await conn.query(sql);

    const categorizedShops = {};

    for (const row of results) {
      const { catId, catName, shopId, shopName, shopDescription, images, tagIds, tagNames, tagNames_es, sustainabilityTagIds, sustainabilityTagNames, sustainabilityTagNames_es } = row;

      if (!categorizedShops[catId]) {
        categorizedShops[catId] = {
          id: catId,
          name: catName,
          shops: []
        };
      }

      const tags = [];
      const sustainabilityTags = [];

      if (tagIds) {
        const tagIdsArray = tagIds.split(',');
        const tagNamesArray = tagNames.split(',');
        const tagNamesEsArray = tagNames_es.split(',');

        for (let i = 0; i < tagIdsArray.length; i++) {
          tags.push({
            id: tagIdsArray[i],
            text: {
              ca: tagNamesArray[i],
              es: tagNamesEsArray[i]
            }
          });
        }
      }

      if (sustainabilityTagIds) {
        const sustainabilityTagIdsArray = sustainabilityTagIds.split(',');
        const sustainabilityTagNamesArray = sustainabilityTagNames.split(',');
        const sustainabilityTagNamesEsArray = sustainabilityTagNames_es.split(',');

        for (let i = 0; i < sustainabilityTagIdsArray.length; i++) {
          sustainabilityTags.push({
            id: sustainabilityTagIdsArray[i],
            text: {
              ca: sustainabilityTagNamesArray[i],
              es: sustainabilityTagNamesEsArray[i]
            }
          });
        }
      }

      categorizedShops[catId].shops.push({
        id: shopId,
        name: shopName,
        description: shopDescription,
        images: images ? images.split(',').map(file => `${process.env.ASSETS_URL}${file}`) : [],
        tags: tags,
        sustainabilityTags: sustainabilityTags
      });
    }

    const categoriesArray = Object.values(categorizedShops);
    return categoriesArray;
  }

  //SHOPS FILTERED (CATEGORY, TAGS o SUSTAINTAGS)
  async function filterShops(categoryName = null, tagName = null, sustainabilityTagName = null, page, pageSize) {
    const offset = (page - 1) * pageSize;

    const conn = await connection();
    let categoryCondition = '';
    let tagCondition = '';
    let sustainabilityTagCondition = '';

    if (categoryName) {
      const categoryNamesArray = [categoryName];
      const categoryId = await findIdsByOption(conn, categoryNamesArray, "tbl_categorias");
      categoryCondition = `catData.catId = ${categoryId}`;
    } else {
      categoryCondition = '1';
    }

    if (tagName) {
      const tagNamesArray = [tagName];
      const tagId = await findIdsByOption(conn, tagNamesArray, "tbl_tags");
      tagCondition = `tags.shopId IN (SELECT id_comercio FROM tbl_rel_comercio_tag WHERE id_tag = ${tagId})`;
    } else {
      tagCondition = '1';
    }

    if (sustainabilityTagName) {
      const sustainabilityTagNamesArray = [sustainabilityTagName];
      const sustainabilityTagId = await findIdsByOption(conn, sustainabilityTagNamesArray, "tbl_cat_sostenibilidad");
      sustainabilityTagCondition = `sustainabilityTags.shopId IN (SELECT id_comercio FROM tbl_rel_tag_cat_sostenibilidad WHERE id_cat_sostenibilidad = ${sustainabilityTagId})`;
    } else {
      sustainabilityTagCondition = '1';
    }
    const countSubquery = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT DISTINCT tbl_comercios.id
      FROM tbl_comercios
      LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_comercio = tbl_comercios.id
      LEFT JOIN tbl_cat_sostenibilidad ON tbl_cat_sostenibilidad.id = tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad
      LEFT JOIN (
        SELECT
        tbl_comercios.id AS shopId,
        tbl_categorias.id AS catId
        FROM
          tbl_comercios
          LEFT JOIN  tbl_categorias ON tbl_categorias.id = tbl_comercios.id_cat
      ) AS catData ON tbl_comercios.id = catData.shopId
      LEFT JOIN (
        SELECT
          tbl_comercios.id AS shopId,
          tbl_cat_sostenibilidad.id AS sustainabilityTagId
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_comercio = tbl_comercios.id
          LEFT JOIN tbl_cat_sostenibilidad ON tbl_cat_sostenibilidad.id = tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad
      ) AS sustainabilityTags ON tbl_comercios.id = sustainabilityTags.shopId
      LEFT JOIN (
        SELECT
          tbl_comercios.id AS shopId,
          tbl_tags.id AS tagId
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_comercio_tag ON tbl_rel_comercio_tag.id_comercio = tbl_comercios.id
          LEFT JOIN tbl_tags ON tbl_tags.id = tbl_rel_comercio_tag.id_tag
      ) AS tags ON tbl_comercios.id = tags.shopId
      WHERE ${categoryCondition} AND ${tagCondition} AND ${sustainabilityTagCondition}
    ) AS shopCount
  `;

    const sql = `
  SELECT
    catData.catId,
    catData.catName,
    catData.shopId,
    catData.shopName,
    catData.shopDescription,
    GROUP_CONCAT(DISTINCT files.file) as images,
    GROUP_CONCAT(DISTINCT tags.tagId) as tagIds,
    GROUP_CONCAT(DISTINCT tags.tagName) as tagNames,
    GROUP_CONCAT(DISTINCT tags.tagName_es) as tagNames_es,
    GROUP_CONCAT(DISTINCT sustainabilityTags.sustainabilityTagId) as sustainabilityTagIds,
    GROUP_CONCAT(DISTINCT sustainabilityTags.sustainabilityTagName) as sustainabilityTagNames,
    GROUP_CONCAT(DISTINCT sustainabilityTags.sustainabilityTagName_es) as sustainabilityTagNames_es,
    GROUP_CONCAT(DISTINCT catData.catId) as catIds
  FROM (
    SELECT
    tbl_categorias.id AS catId,
    tbl_categorias.nombre AS catName,
    tbl_comercios.id AS shopId,
    tbl_comercios.nombre AS shopName,
    tbl_comercios.descripcion AS shopDescription,
    tbl_cat_sostenibilidad.id AS sustainabilityTagId
  FROM
    tbl_categorias
    LEFT JOIN tbl_comercios ON tbl_comercios.id_cat = tbl_categorias.id
    LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_comercio = tbl_comercios.id
    LEFT JOIN tbl_cat_sostenibilidad ON tbl_cat_sostenibilidad.id = tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad
  WHERE
    tbl_comercios.activo = 1
) AS catData
  LEFT JOIN tbl_files AS files ON catData.shopId = files.id_comercio AND files.file IS NOT NULL
  LEFT JOIN (
    SELECT
      tbl_comercios.id AS shopId,
      tbl_tags.id AS tagId,
      tbl_tags.nombre AS tagName,
      tbl_tags.nombre_es AS tagName_es
    FROM
      tbl_comercios
      LEFT JOIN tbl_rel_comercio_tag ON tbl_rel_comercio_tag.id_comercio = tbl_comercios.id
      LEFT JOIN tbl_tags ON tbl_tags.id = tbl_rel_comercio_tag.id_tag
  ) AS tags ON catData.shopId = tags.shopId
  LEFT JOIN (
    SELECT
      tbl_comercios.id AS shopId,
      tbl_cat_sostenibilidad.id AS sustainabilityTagId,
      tbl_cat_sostenibilidad.nombre AS sustainabilityTagName,
      tbl_cat_sostenibilidad.nombre_es AS sustainabilityTagName_es
    FROM
      tbl_comercios
      LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_comercio = tbl_comercios.id
      LEFT JOIN tbl_cat_sostenibilidad ON tbl_cat_sostenibilidad.id = tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad
  ) AS sustainabilityTags ON catData.shopId = sustainabilityTags.shopId
  WHERE
    ${categoryCondition} AND
    ${tagCondition} AND
    ${sustainabilityTagCondition}
  GROUP BY
    catData.catId, catData.shopId
  ORDER BY
    catData.sustainabilityTagId DESC,
    catData.catName,
    catData.shopName
  LIMIT ${pageSize}
  OFFSET ${offset}
`;

    const [results, fields] = await conn.query(sql);
    const [countResult] = await conn.execute(countSubquery);
    const total = countResult[0].total;

    const shops = [];

    for (const row of results) {
      const {
        catId,
        catName,
        shopId,
        shopName,
        shopDescription,
        images,
        tagIds,
        tagNames,
        tagNames_es,
        sustainabilityTagIds,
        sustainabilityTagNames,
        sustainabilityTagNames_es
      } = row;

      const tags = [];
      const sustainabilityTags = [];

      if (tagIds) {
        const tagIdsArray = tagIds.split(',');
        const tagNamesArray = tagNames.split(',');
        const tagNamesEsArray = tagNames_es.split(',');

        for (let i = 0; i < tagIdsArray.length; i++) {
          tags.push({
            id: tagIdsArray[i],
            text: {
              ca: tagNamesArray[i],
              es: tagNamesEsArray[i]
            }
          });
        }
      }

      if (sustainabilityTagIds) {
        const sustainabilityTagIdsArray = sustainabilityTagIds.split(',');
        const sustainabilityTagNamesArray = sustainabilityTagNames.split(',');
        const sustainabilityTagNamesEsArray = sustainabilityTagNames_es.split(',');

        for (let i = 0; i < sustainabilityTagIdsArray.length; i++) {
          sustainabilityTags.push({
            id: sustainabilityTagIdsArray[i],
            text: {
              ca: sustainabilityTagNamesArray[i],
              es: sustainabilityTagNamesEsArray[i]
            }
          });
        }
      }

      shops.push({
        id: shopId,
        name: shopName,
        description: shopDescription,
        images: images ? images.split(',').map(file => `${process.env.ASSETS_URL}${file}`) : [],
        tags: tags,
        sustainabilityTags: sustainabilityTags
      });

    }
    return { shops, total };
  }

  //SHOP DETAIL
  async function getShop(shopId, userId = null) {
    const conn = await connection();

    const sql = `
        SELECT
          tbl_categorias.nombre catName,
          tbl_categorias.id catId,
          tbl_comercios.id id,
          tbl_comercios.nombre name,
          tbl_comercios.descripcion description,
          tbl_comercios.via,
          tbl_comercios.num,
          tbl_comercios.cp,
          tbl_comercios.email email,
          tbl_comercios.url web,
          tbl_comercios.telf phone,
          tbl_comercios.comercio_accesible as 'accessible',
          tbl_comercios.latitud latitude,
          tbl_comercios.longitud longitude,
          tbl_files.file file
        FROM
          tbl_comercios
          LEFT JOIN tbl_categorias ON tbl_comercios.id_cat = tbl_categorias.id
          LEFT JOIN tbl_files ON tbl_comercios.id = tbl_files.id_comercio
        WHERE
          tbl_comercios.id = ?
          AND tbl_comercios.activo = 1
      `;

    const [results, fields] = await conn.query(sql, [shopId]);

    if (results.length === 0) {
      return null;
    }

    const shop = {
      ...results[0],
      coordenates: {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      },
      schedule: [],
      images: [],
      tags: [],
      sustainabilityTags: [],
      services: [],
      canals: [],
      offer: {}, //TODO: delete after publish new version
      offers: [],
      activities: []
    };
    delete shop.latitude;
    delete shop.longitude;
    delete shop.file;

    for (const result of results) {
      const { file } = result;
      if (file) {
        shop.images.push(`${process.env.ASSETS_URL}${file}`);
      }
    }

    const tagsQuery = `
        SELECT
          tbl_tags.id id,
          tbl_tags.nombre name,
          tbl_tags.nombre_es name_es
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_comercio_tag ON tbl_comercios.id = tbl_rel_comercio_tag.id_comercio
          LEFT JOIN tbl_tags ON tbl_rel_comercio_tag.id_tag = tbl_tags.id
        WHERE
          tbl_comercios.id = ?
      `;

    const [results2, fields2] = await conn.execute(tagsQuery, [shopId]);

    if (results2.length > 0 && Object.values(results2[0]).every(item => item !== null)) {
      shop.tags = transformTagsOrCategories(results2);
    }

    const sustainabilityTagsQuery = `
        SELECT
          tbl_cat_sostenibilidad.id id,
          tbl_cat_sostenibilidad.nombre name,
          tbl_cat_sostenibilidad.nombre_es name_es
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_comercios.id = tbl_rel_tag_cat_sostenibilidad.id_comercio
          LEFT JOIN tbl_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad = tbl_cat_sostenibilidad.id
        WHERE
          tbl_comercios.id = ?
      `;

    const [results3, fields3] = await conn.execute(sustainabilityTagsQuery, [shopId]);

    if (results3.length > 0 && Object.values(results3[0]).every(item => item !== null)) {
      shop.sustainabilityTags = transformTagsOrCategories(results3);
    }

    const servicesQuery = `
        SELECT
          tbl_rel_comercio_servicio.id id,
          tbl_rel_comercio_servicio.titulo_servicio title,
          tbl_rel_comercio_servicio.precio price
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_comercio_servicio ON tbl_comercios.id = tbl_rel_comercio_servicio.id_comercio
        WHERE
          tbl_comercios.id = ?
      `;

    const [results4, fields4] = await conn.execute(servicesQuery, [shopId]);

    if (results4.length > 0 && Object.values(results4[0]).every(item => item !== null)) {
      shop.services = results4.map(result => ({
        id: result.id,
        title: result.title,
        price: result.price
      }));
    }

    const scheduleQuery = `
        SELECT
          tbl_rel_comercio_horario.id_dia_semana day_id,
          tbl_rel_comercio_horario.hora hour,
          tbl_rel_comercio_horario.id_estado state_id,
          tbl_dias_semana.nombre day,
          tbl_estado_comercio.nombre_estado state
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_comercio_horario ON tbl_comercios.id = tbl_rel_comercio_horario.id_comercio
          LEFT JOIN tbl_dias_semana ON tbl_rel_comercio_horario.id_dia_semana = tbl_dias_semana.id
          LEFT JOIN tbl_estado_comercio ON tbl_rel_comercio_horario.id_estado = tbl_estado_comercio.id
        WHERE
          tbl_comercios.id = ?
      `;

    const [results6, fields6] = await conn.execute(scheduleQuery, [shopId]);

    if (results6.length > 0 && Object.values(results6[0]).every(item => item === null)) {
      return shop;
    } else {
      const groupedByDay = results6.reduce((acc, entry) => {
        if (!acc[entry.day_id]) {
          acc[entry.day_id] = [];
        }
        acc[entry.day_id].push(entry);
        return acc;
      }, {});

      for (const dayId in groupedByDay) {
        const dayEntries = groupedByDay[dayId];
        const hours = dayEntries.map(entry => ({
          hour: entry.hour,
          state: entry.state
        }));

        shop.schedule.push({
          dayId: Number(dayId),
          day: dayEntries[0].day,
          hours: hours
        });
      }
    }

    const canalsQuery = `
        SELECT
          tbl_rel_comercio_canal.id id,
          tbl_rel_comercio_canal.id_canal canal_id,
          tbl_canales.nombre canal_name,
          tbl_canales.icon canal_icon,
          tbl_rel_comercio_canal.link link
        FROM
          tbl_comercios
          LEFT JOIN tbl_rel_comercio_canal ON tbl_comercios.id = tbl_rel_comercio_canal.id_comercio
          LEFT JOIN tbl_canales ON tbl_rel_comercio_canal.id_canal = tbl_canales.id
        WHERE
          tbl_comercios.id = ?
      `;

    const [results7, fields7] = await conn.execute(canalsQuery, [shopId]);

    if (results7.length > 0 && Object.values(results7[0]).every(item => item !== null)) {
      shop.canals = results7.map(result => ({
        id: result.id,
        icon: `${process.env.ASSETS_URL}/iconos/${result.canal_icon}`,
        name: result.canal_name,
        value: result.link
      }));
    }

    const offerQuery = `
        SELECT
          tbl_comercio_fidelizacion.id id,
          tbl_comercio_fidelizacion.titulo_oferta title,
          tbl_comercio_fidelizacion.descripcion description,
          tbl_comercio_fidelizacion.num_compras max_purchases
        FROM
          tbl_comercio_fidelizacion
        WHERE
          tbl_comercio_fidelizacion.id_comercio = ?
          AND tbl_comercio_fidelizacion.activo = 1
        `

    const [results9, fields9] = await conn.execute(offerQuery, [shopId]);

    if (results9.length > 0 && Object.values(results9[0]).every(item => item !== null)) {
      shop.offers.push(...results9)
    }

    const userPurchasesQuery = `
    SELECT
      COUNT(tbl_rel_comercio_user_fidelizacion.id_user) AS user_purchases
    FROM
      tbl_rel_comercio_user_fidelizacion
    WHERE
      tbl_rel_comercio_user_fidelizacion.id_comercio = ?
      AND tbl_rel_comercio_user_fidelizacion.id_user = ?
  `;

    if (userId !== null && results9.length > 0) {
      const offerWithPurchases = shop.offers.some(offer => offer.max_purchases > 0);
      if (offerWithPurchases) {
        const [results10, fields10] = await conn.execute(userPurchasesQuery, [shopId, userId]);
        if (results10.length > 0 && Object.values(results10[0]).every(item => item !== null)) {
          shop.offers.find(offer => offer.max_purchases > 0).user_purchases = results10[0].user_purchases;
        }
      }
    }

    const activitiesQuery = `
        SELECT
          tbl_actividades.id id,
          tbl_actividades.titulo title,
          tbl_actividades.descripcion body,
          tbl_actividades.foto image,
          tbl_actividades.data_ini date_initial,
          tbl_actividades.data_fi date_final,
          tbl_actividades.via,
          tbl_actividades.num,
          tbl_actividades.cp,
          tbl_actividades.email email,
          tbl_actividades.telf phone
        FROM
          tbl_actividades
        WHERE
          tbl_actividades.id_comercio = ? AND
          tbl_actividades.data_fi > ?
        ORDER BY
          tbl_actividades.data_ini ASC
      `;

    const [results8, fields8] = await conn.execute(activitiesQuery, [shopId, new Date().toISOString()]);
    if (results8.length > 0) {
      shop.activities = results8.slice(0, 5).map(result => ({
        ...result,
        image: result.image ? `${process.env.ASSETS_URL}${result.image}` : null,
      }));
    }

    const impressionsQuery = `
        UPDATE tbl_comercios
        SET tbl_comercios.impresiones = tbl_comercios.impresiones + 1
        WHERE tbl_comercios.id = ?
        `
    await conn.execute(impressionsQuery, [shopId]);
    return shop;
  }

  //Map (Shops by coordinates)
  async function getShopsByCoordinates(latitude, longitude, sustainabilityNames = [], categoryNames = [], shopId = null, page, pageSize) {
    const conn = await connection();
    const offset = (page - 1) * pageSize;

    let sustainabilityTagCondition;
    if (sustainabilityNames.length > 0) {
      const sustainabilityTagIds = await findIdsByOption(conn, sustainabilityNames, "tbl_cat_sostenibilidad");
      sustainabilityTagCondition = `sustainabilityData.id_cat_sostenibilidad IN ('${sustainabilityTagIds.join("','")}')`;
    } else {
      sustainabilityTagCondition = '1';
    }

    let categoryCondition = '';
    if (categoryNames.length > 0) {
      const categoryIds = await findIdsByOption(conn, categoryNames, "tbl_categorias");
      categoryCondition = `tbl_comercios.id_cat IN ('${categoryIds.join("','")}')`;
    } else {
      categoryCondition = '1';
    }

    const sql = `
      SELECT
        tbl_comercios.id id,
        tbl_comercios.nombre name,
        tbl_comercios.descripcion description,
        tbl_comercios.latitud latitude,
        tbl_comercios.longitud longitude,
        (
          6371 *
          acos(
            cos(radians(${latitude})) *
            cos(radians(tbl_comercios.latitud)) *
            cos(radians(tbl_comercios.longitud) - radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians(tbl_comercios.latitud))
          )
        ) AS distance
      FROM
        tbl_comercios
        LEFT JOIN tbl_rel_tag_cat_sostenibilidad sustainabilityData ON sustainabilityData.id_comercio = tbl_comercios.id
      WHERE
        tbl_comercios.activo = 1
        AND ${sustainabilityTagCondition} 
        AND ${categoryCondition}
      GROUP BY
          tbl_comercios.id
      ORDER BY
        distance
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    const [results, fields] = await conn.query(sql);

    for (const result of results) {
      const { id } = result;
      const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${id}`;
      const [filesResult] = await conn.query(sqlFiles);
      result.images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`)
    }

    if (shopId !== null) {
      const existingShop = results.some(shop => shop.id === shopId);

      if (!existingShop) {
        const existingSql = `
          SELECT
          tbl_comercios.id id,
          tbl_comercios.nombre name,
          tbl_comercios.descripcion description,
          tbl_comercios.latitud latitude,
          tbl_comercios.longitud longitude
          FROM
            tbl_comercios
          WHERE
            tbl_comercios.id = ?
        `
        const [results2, fields2] = await conn.query(existingSql, [shopId]);
        if (results2.length > 0) {
          const { id } = results2[0];
          const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${id}`;
          const [filesResult] = await conn.query(sqlFiles);
          results2[0].images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`)
          results.unshift(results2[0])
        }
      }
    }

    return { results };
  }

  //SEARCH (Shops by name)
  async function searchShops(search, page, pageSize) {
    const offset = (page - 1) * pageSize;

    const sql = `
    SELECT
      tbl_comercios.id id,
      tbl_comercios.nombre name,
      tbl_comercios.descripcion description
    FROM
      tbl_comercios
    WHERE
      tbl_comercios.nombre LIKE ? AND
      tbl_comercios.activo = 1
    ORDER BY
      tbl_comercios.nombre
    LIMIT ?
    OFFSET ?
  `;
    const searchValue = `%${search}%`;
    const conn = await connection()
    const [results, fields] = await conn.execute(sql, [searchValue, pageSize, offset]);

    for (const result of results) {
      const { id } = result;
      const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${id}`;
      const [filesResult] = await conn.query(sqlFiles);
      result.images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`)
    }

    return { results };
  }

  //ACTIVITIES
  async function getAllActivities(page, pageSize, activityCatId = null) {
    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE tbl_actividades.data_fi > ?';
    let params = [new Date().toISOString()];

    if (activityCatId) {
      whereClause += ' AND tbl_cat_actividades.id = ?';
      params.push(activityCatId);
    }

    const sql = `
      SELECT
        tbl_cat_actividades.id catId,
        tbl_cat_actividades.nombre catName,
        tbl_cat_actividades.nombre_es catNameEs,
        tbl_actividades.id id,
        tbl_actividades.titulo title,
        tbl_actividades.descripcion body,
        tbl_actividades.foto image,
        tbl_actividades.data_ini date_initial,
        tbl_actividades.data_fi date_final,
        tbl_actividades.via,
        tbl_actividades.num,
        tbl_actividades.cp,
        tbl_actividades.email email,
        tbl_actividades.telf phone
      FROM
        tbl_actividades
      LEFT JOIN tbl_cat_actividades ON tbl_actividades.id_cat_actividad = tbl_cat_actividades.id
      ${whereClause}
      ORDER BY
        tbl_actividades.data_ini ASC
      LIMIT ?
      OFFSET ?
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [...params, pageSize, offset]);

    if (results.length > 0) {
      for (const result of results) {
        if (result.image) {
          result.image = `${process.env.ASSETS_URL}${result.image}`;
        }
        result.tags = [
          {
            id: result.catId,
            text: {
              ca: result.catName,
              es: result.catNameEs
            }
          }
        ];
        delete result.catId;
        delete result.catName;
        delete result.catNameEs;
      }
    }
    return { results };
  }

  async function getActivityById(activityId) {
    const sql = `
      SELECT
        tbl_cat_actividades.id catId,
        tbl_cat_actividades.nombre catName,
        tbl_cat_actividades.nombre_es catNameEs,
        tbl_actividades.id id,
        tbl_actividades.titulo title,
        tbl_actividades.descripcion body,
        tbl_actividades.foto image,
        tbl_actividades.data_ini date_initial,
        tbl_actividades.data_fi date_final,
        tbl_actividades.via,
        tbl_actividades.num,
        tbl_actividades.cp,
        tbl_actividades.email email,
        tbl_actividades.telf phone
      FROM
        tbl_actividades
        LEFT JOIN tbl_cat_actividades ON tbl_actividades.id_cat_actividad = tbl_cat_actividades.id
      WHERE tbl_actividades.id = ?
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [activityId]);

    if (results[0].image) {
      results[0].image = `${process.env.ASSETS_URL}${results[0].image}`;
    }
    results[0].tags = {
      id: results[0].catId,
      text: {
        ca: results[0].catName,
        es: results[0].catNameEs

      }
    }
    delete results[0].catId;
    delete results[0].catName;
    delete results[0].catNameEs;

    const shopSql = `
      SELECT
        tbl_comercios.id id,
        tbl_comercios.nombre name,
        tbl_comercios.descripcion description,
        tbl_comercios.via,
        tbl_comercios.num,
        tbl_comercios.cp,
        tbl_comercios.email email,
        tbl_comercios.url web,
        tbl_comercios.telf phone,
        tbl_comercios.comercio_accesible AS 'accessible'
      FROM
        tbl_comercios
        LEFT JOIN tbl_actividades ON tbl_actividades.id_comercio = tbl_comercios.id
      WHERE tbl_actividades.id = ?
    `;

    const [results2, fields2] = await conn.query(shopSql, [activityId]);

    if (results2.length > 0) {
      results[0].shop = { ...results2[0] };

      const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${results[0].shop.id}`;
      const [filesResult] = await conn.query(sqlFiles);
      results[0].shop.images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`)


      const tagsQuery = `
      SELECT
        tbl_tags.id id,
        tbl_tags.nombre name,
        tbl_tags.nombre_es name_es
      FROM
        tbl_comercios
        LEFT JOIN tbl_rel_comercio_tag ON tbl_comercios.id = tbl_rel_comercio_tag.id_comercio
        LEFT JOIN tbl_tags ON tbl_rel_comercio_tag.id_tag = tbl_tags.id
      WHERE
        tbl_comercios.id = ?
    `;

      const [results3, fields3] = await conn.execute(tagsQuery, [results[0].shop.id]);

      if (results3.length > 0 && Object.values(results3[0]).every(item => item !== null)) {
        results[0].shop.tags = transformTagsOrCategories(results3);
      }

      const sustainabilityTagsQuery = `
      SELECT
        tbl_cat_sostenibilidad.id id,
        tbl_cat_sostenibilidad.nombre name,
        tbl_cat_sostenibilidad.nombre_es name_es
      FROM
        tbl_comercios
        LEFT JOIN tbl_rel_tag_cat_sostenibilidad ON tbl_comercios.id = tbl_rel_tag_cat_sostenibilidad.id_comercio
        LEFT JOIN tbl_cat_sostenibilidad ON tbl_rel_tag_cat_sostenibilidad.id_cat_sostenibilidad = tbl_cat_sostenibilidad.id
      WHERE
        tbl_comercios.id = ?
    `;

      const [results4, fields4] = await conn.execute(sustainabilityTagsQuery, [results[0].shop.id]);

      if (results4.length > 0 && Object.values(results4[0]).every(item => item !== null)) {
        results[0].shop.sustainabilityTags = transformTagsOrCategories(results4);
      }
    }
    return results[0];
  }

  //USER ACTIONS
  const register = async (public_id, name, email, active = 0) => {
    const data = new Date();
    const conn = await connection();

    const emailExistsQuery = `
      SELECT COUNT(*) as count
      FROM tbl_user
      WHERE email = ?
    `;

    const [emailCheckResults] = await conn.query(emailExistsQuery, [email]);

    if (emailCheckResults[0].count > 0) {

      return { error: 'Email already exists' };

    } else {
      const insertQuery = `
        INSERT INTO tbl_user (id_publico, nombre, email, data, activo)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [results] = await conn.query(insertQuery, [public_id, name, email, data, active]);

      const newUser = { id: results.insertId, ...results };

      return newUser;
    }
  }

  const verify = async (userId) => {
    const sql = `
      UPDATE tbl_user
      SET activo = 1
      WHERE id = ?
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);

    if (results.affectedRows === 0) {
      throw new Error('User not found');
    } else {
      const user = await getUserById(userId);
      return user
    }
  }

  const getCode = async (email) => {
    const sql = `
      SELECT
        tbl_login_code.email email,
        tbl_login_code.code code,
        tbl_login_code.data data
      FROM
        tbl_login_code
      WHERE
        tbl_login_code.email = ?
      ORDER BY tbl_login_code.id DESC
      LIMIT 1
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [email]);

    if (results.length === 0) {
      return null;
    }

    const loginCode = { ...results[0] };

    return loginCode;
  }

  const login = async (email) => {
    const selectSql = `
      SELECT
        tbl_user.id id,
        tbl_user.id_publico public_id,
        tbl_user.nombre name,
        tbl_user.email email,
        tbl_user.data data,
        tbl_user.activo active
      FROM
        tbl_user
      WHERE
        tbl_user.email = ?
    `;

    const conn = await connection();
    const [selectResults, selectFields] = await conn.query(selectSql, [email]);
    const user = { ...selectResults[0] };

    if (user.active === 0) {
      const updateSql = `
        UPDATE tbl_user
        SET activo = 1
        WHERE id = ?
      `;
      await conn.query(updateSql, [user.id]);
      const [updatedResults, updatedFields] = await conn.query(selectSql, [email]);
      const updatedUser = { ...updatedResults[0] };

      return updatedUser;
    }
    return user;
  };

  const profile = async (id, name, email) => {
    const sql = `
      UPDATE tbl_user
      SET nombre = ?, email = ?
      WHERE id = ?
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [name, email, id]);
    const updatedUser = {
      id,
      name,
      email
    };
    return updatedUser;
  }

  const toggleFavorite = async (shopId, userId) => {
    const conn = await connection();

    const checkQuery = `SELECT id FROM tbl_favoritos WHERE id_comercio = ? AND id_user = ? AND fecha IS NOT NULL`;
    const [checkResults] = await conn.execute(checkQuery, [shopId, userId]);

    if (checkResults.length > 0) {
      const deleteQuery = `DELETE FROM tbl_favoritos WHERE id_comercio = ? AND id_user = ?`;
      await conn.execute(deleteQuery, [shopId, userId]);

      return { favorite: false };
    } else {
      const insertQuery = `INSERT INTO tbl_favoritos (id_comercio, id_user, fecha) VALUES (?, ?, NOW())`;
      await conn.execute(insertQuery, [shopId, userId]);

      return { favorite: true };
    }
  }

  const favorites = async (userId) => {
    const sql = `
      SELECT
        tbl_comercios.id id,
        tbl_comercios.nombre name,
        tbl_comercios.descripcion description,
        tbl_comercios.email email,
        tbl_comercios.telf phone
      FROM
        tbl_favoritos
        LEFT JOIN tbl_comercios ON tbl_comercios.id = tbl_favoritos.id_comercio
      WHERE
        tbl_favoritos.id_user = ?
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);

    for (const result of results) {
      const { id } = result;
      const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${id}`;
      const [filesResult] = await conn.query(sqlFiles);
      result.images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`)

      const purchases = `SELECT COUNT(*) AS total FROM tbl_rel_comercio_user_fidelizacion WHERE id_comercio = ? AND id_user = ?`;
      const [purchasesResult] = await conn.query(purchases, [id, userId]);


      const offer = `SELECT num_compras FROM tbl_comercio_fidelizacion WHERE id_comercio = ? AND activo = 1 AND num_compras > 0`;
      const [offerResult] = await conn.query(offer, [id]);


      if (offerResult.length > 0) {
        result.offer = {
          max_purchases: offerResult[0].num_compras,
          user_purchases: purchasesResult[0].total
        }
      }

      const canals = `
      SELECT
        tbl_rel_comercio_canal.id id,
        tbl_rel_comercio_canal.id_canal canal_id,
        tbl_canales.nombre canal_name,
        tbl_canales.icon canal_icon,
        tbl_rel_comercio_canal.link link
      FROM
        tbl_comercios
        LEFT JOIN tbl_rel_comercio_canal ON tbl_comercios.id = tbl_rel_comercio_canal.id_comercio
        LEFT JOIN tbl_canales ON tbl_rel_comercio_canal.id_canal = tbl_canales.id
      WHERE
        tbl_comercios.id = ?
    `;

      const [canalsResult] = await conn.query(canals, [id]);

      if (canalsResult.length > 0 && Object.values(canalsResult[0]).every(item => item !== null)) {
        result.canals = canalsResult.map(result => ({
          id: result.id,
          icon: `${process.env.ASSETS_URL}/iconos/${result.canal_icon}`,
          name: result.canal_name,
          value: result.link
        }));
      }
    }

    return { results };
  }

  const userPurchases = async (userId) => {
    const sql = `
    SELECT
      tbl_comercios.id AS id,
      tbl_comercios.nombre AS name,
      tbl_comercio_fidelizacion.id offer_id,
      tbl_comercio_fidelizacion.titulo_oferta AS title,
      tbl_comercio_fidelizacion.descripcion AS description,
      tbl_comercio_fidelizacion.num_compras AS max_purchases,
      COUNT(tbl_rel_comercio_user_fidelizacion.id_user) AS user_purchases
    FROM
      tbl_comercios
      LEFT JOIN tbl_comercio_fidelizacion ON tbl_comercio_fidelizacion.id_comercio = tbl_comercios.id
      LEFT JOIN tbl_rel_comercio_user_fidelizacion ON tbl_comercio_fidelizacion.id_comercio = tbl_rel_comercio_user_fidelizacion.id_comercio
    WHERE
      tbl_rel_comercio_user_fidelizacion.id_user = ?
      AND tbl_comercio_fidelizacion.num_compras > 0
      AND tbl_comercio_fidelizacion.activo = 1
      AND tbl_comercios.activo = 1
    GROUP BY tbl_comercios.id
  `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);

    const purchases = [];

    for (const result of results) {
      const { id } = result;
      const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${id}`;
      const [filesResult] = await conn.query(sqlFiles);
      result.images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`);

      purchases.push({
        id: result.id,
        name: result.name,
        offer: {
          id: result.offer_id,
          title: result.title,
          description: result.description,
          max_purchases: result.max_purchases,
          user_purchases: result.user_purchases
        },
        images: result.images
      });
    }
    return purchases;
  };

  const listNotifications = async (userId) => {

    const sql = `
      SELECT
        tbl_comercios.nombre name,
        tbl_notifications.id notiId,
        tbl_notifications.id_comercio shopId,
        tbl_notifications.fecha data,
        tbl_notifications.id_offer offerId,
        tbl_notifications.read \`read\`,
        tbl_comercio_fidelizacion.num_compras max_purchases
      FROM
        tbl_notifications
        LEFT JOIN tbl_comercios ON tbl_notifications.id_comercio = tbl_comercios.id
        LEFT JOIN tbl_comercio_fidelizacion ON tbl_comercio_fidelizacion.id = tbl_notifications.id_offer
      WHERE
        tbl_notifications.id_user = ?
        AND tbl_comercio_fidelizacion.num_compras > 0
        AND tbl_comercio_fidelizacion.activo = 1
        AND tbl_comercios.activo = 1
      ORDER BY tbl_notifications.fecha DESC
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);

    const notifications = [];

    for (const result of results) {
      const { notiId, shopId, read, name, data, offerId, max_purchases, date } = result;
      const sqlFiles = `SELECT file FROM tbl_files WHERE id_comercio = ${shopId}`;
      const [filesResult] = await conn.query(sqlFiles);
      const images = filesResult.map(file => `${process.env.ASSETS_URL}${file.file}`);

      const oldPurchases = `SELECT COUNT(*) AS total FROM tbl_rel_comercio_user_fidelizacion WHERE id_comercio = ? AND id_user = ? AND fecha_compra <= ?`;
      const [oldPurchasesResult] = await conn.query(oldPurchases, [shopId, userId, data]);
      const allPurchases = oldPurchasesResult[0].total;


      notifications.push({
        notiId,
        shopId,
        name,
        offer: {
          max_purchases,
          user_purchases: allPurchases
        },
        data: data.toISOString(),
        offerId,
        images,
        read
      });
    }
    return notifications;
  }


  const getUnreadNotificationsNumber = async (userId) => {
    const sql = `
      SELECT
        COUNT(*) AS total
      FROM
        tbl_notifications
      WHERE
        tbl_notifications.id_user = ?
        AND tbl_notifications.read = 0
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);

    return results[0].total;
  }


  const deleteAccount = async (userId) => {
    const conn = await connection();

    const deleteQuery = `DELETE FROM tbl_user WHERE id = ?`;
    await conn.execute(deleteQuery, [userId]);

    return { deleted: true };
  }

  const readNotifications = async (notiIds) => {
    if (!Array.isArray(notiIds) || notiIds.length === 0) {
      console.log("No notification IDs provided or the provided value is not an array.");
      return null;
    }

    const conn = await connection();

    const placeholders = notiIds.map(() => '?').join(', ');

    const updateSql = `
      UPDATE tbl_notifications
      SET \`read\` = 1
      WHERE id IN (${placeholders})
    `;

    await conn.query(updateSql, notiIds);

    const selectSql = `
      SELECT *
      FROM tbl_notifications
      WHERE id IN (${placeholders})
    `;

    const [selectResults] = await conn.query(selectSql, notiIds);

    if (selectResults.length === 0) {
      console.log("No notifications found.");
      return null;
    }


    const notifications = selectResults.map(result => ({ ...result }));

    return notifications;
  }






  //HELPER USER FUNCTIONS
  const getUserByEmail = async (email) => {
    const sql = `
      SELECT
        tbl_user.id id,
        tbl_user.id_publico public_id,
        tbl_user.nombre name,
        tbl_user.email email
      FROM
        tbl_user
      WHERE
        tbl_user.email = ?
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [email]);

    if (results.length === 0) {
      return null;
    }

    const user = { ...results[0] };

    return user;
  }

  async function getUserById(userId) {
    const sql = `
      SELECT
        tbl_user.id id,
        tbl_user.id_publico public_id,
        tbl_user.nombre name,
        tbl_user.email email,
        tbl_user.data data,
        tbl_user.activo active
      FROM
        tbl_user
      WHERE
        tbl_user.id = ? AND
        tbl_user.activo = 1
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);
    const user = { ...results[0] };
    return user;
  }

  async function getUserByPublicId(publicId) {
    const sql = `
      SELECT
        tbl_user.id id,
        tbl_user.id_publico public_id,
        tbl_user.nombre name,
        tbl_user.email email,
        tbl_user.data data,
        tbl_user.activo active
      FROM
        tbl_user
      WHERE
        tbl_user.id_publico = ? AND
        tbl_user.activo = 1
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [publicId]);
    const user = { ...results[0] };
    return user;
  }

  async function savePlayerId(userId, playerId) {
    const sql = `
      INSERT INTO tbl_rel_user_playerId (user_id, player_id, data)
      VALUES (?, ?, NOW())`
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId, playerId]);
    return results;
  }

  async function getPlayerId(userId) {
    const sql = `
      SELECT player_id
      FROM tbl_rel_user_playerId
      WHERE user_id = ?`;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [userId]);

    if (results.length > 0) {
      return results[0].player_id;
    } else {
      return null;
    }
  }

  async function updatePlayerId(userId, playerId) {
    const sql = `
      UPDATE tbl_rel_user_playerId
      SET player_id = ?, data = NOW()
      WHERE user_id = ?`;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [playerId, userId]);
    return results;
  }

  const setCode = async (user, code) => {
    const currentTime = new Date().toISOString()
    const sql = `
      INSERT INTO tbl_login_code (email, code, data)
      VALUES (?, ?, NOW())
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [user.email, code]);
  };

  const deleteExpiredCode = async (email) => {
    const sql = `
      DELETE FROM tbl_login_code
      WHERE email = ? AND data < DATE_SUB(NOW(), INTERVAL 5 MINUTE)
    `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [email]);
  }

  const saveNotification = async (userId, shopId, offerId) => {
    const sql = `
      INSERT INTO tbl_notifications (id_comercio, id_user, id_offer, fecha)
      VALUES (?, ?, ?, NOW())
    `;

    const conn = await connection();
    const [results, fields] = await conn.query(sql, [shopId, userId, offerId]);

    return results;
  }

  const findRecordByNanoid = async (nanoid) => {
    const sql = `
        SELECT
          COUNT(*) AS count
        FROM
          tbl_user
        WHERE
          tbl_user.id_publico = ?
      `;
    const conn = await connection();
    const [results, fields] = await conn.query(sql, [nanoid]);

    const count = results[0].count;

    return count > 0;
  }

  return {
    connection,
    getLiterals,
    getIcons,
    getCategories,
    getSustainabilityTags,
    getActivitiesTags,
    getPreferencesShops,
    filterShops,
    getShop,
    getShopsByCoordinates,
    searchShops,
    getAllActivities,
    getActivityById,
    register,
    verify,
    getCode,
    login,
    profile,
    toggleFavorite,
    favorites,
    userPurchases,
    listNotifications,
    deleteAccount,
    getUserByEmail,
    getUserById,
    getUserByPublicId,
    savePlayerId,
    getPlayerId,
    updatePlayerId,
    setCode,
    deleteExpiredCode,
    saveNotification,
    findRecordByNanoid,
    readNotifications,
    getUnreadNotificationsNumber
  }
}

module.exports = getDatabase;