'SELECT * FROM (' +
  'SELECT DISTINCT ' +
    'ON(id) * ' +
    'FROM (' +
      'SELECT job.*, ' +
        '(' +
          'SELECT array_agg(row_to_json(skill.*)) ' +
          'FROM skill ' +
          'LEFT JOIN jobskill ON jobskill.skill_id = skill.id ' +
          'WHERE jobskill.job_id = job.id ' +
        ') ' +
      'AS skills, ' +
       "setweight(to_tsvector(job.title), 'A') || " +
       "setweight(to_tsvector(job.description), 'B') || " +
       "setweight(to_tsvector('simple', skill.title), 'A') || " +
       "setweight(to_tsvector('simple', coalesce(string_agg(skill.title, ' '))), 'B') " +
      'AS document ' +
      'FROM job ' +
      'JOIN jobskill ON jobskill.job_id = job.id ' +
      'INNER JOIN skill ON skill.id = jobskill.skill_id ' +
      'GROUP BY job.id, skill.id' +
    ') p_search ' +
    `WHERE p_search.document @@ to_tsquery('english', '${q}') ` +
    'ORDER BY id ASC, ' +
    `ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC` +
') jobs ' +
'ORDER BY updated_at DESC;'

'SELECT DISTINCT ON(id) id, * ' +
'FROM (SELECT "user".*, ' +
// `ST_Distance(job.the_geom, ST_MakePoint(${body.coords})::geography) as distance, ` +
   `(SELECT json_agg(json_build_object('title', project.title, 'skills', (SELECT array_agg(row_to_json(skill.*)) FROM skill LEFT JOIN "ProjectSkill" ON "ProjectSkill".skill_id=skill.id WHERE "ProjectSkill".project_id=project.id))) FROM project WHERE project.user_id="user".id) AS projects, ` +
   'to_tsvector("user".title) || ' +
   'to_tsvector("user".summary) || ' +
   'to_tsvector(project.title) as document ' +
// 'to_tsvector("simple", coalesce(string_agg(project.title, " "))) as document ' +
'FROM "user" ' +
'JOIN project ON project.user_id = "user".id ' +
'INNER JOIN "ProjectSkill" ON "ProjectSkill".project_id = project.id ' +
'INNER JOIN skill ON skill.id = "ProjectSkill".project_id ' +
'GROUP BY "user".id, project.id, skill.id) p_search ' +
'WHERE ' +
`p_search.document @@ to_tsquery('english', '${q}') ` +
`ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC;`
