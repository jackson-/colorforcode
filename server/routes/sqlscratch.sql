SELECT * FROM (
  SELECT DISTINCT
  ON(id) *
  FROM (
    SELECT "user".*,
      (
        SELECT json_agg(
          json_build_object(
            'id', project.id, 'title', project.title, 'skills',
            (
               SELECT array_agg(row_to_json(skill.*))
               FROM skill
               LEFT JOIN projectskill
               ON projectskill.skill_id = skill.id
               WHERE projectskill.project_id = project.id
            )
          )
        )
        FROM project WHERE project.user_id = user.id
      )
      AS projects,
      setweight(
        (
          SELECT to_tsvector('simple', coalesce(string_agg(skill.title, ' ')))
          FROM skill
          JOIN ProjectSkill ON ProjectSkill.skill_id = skill.id
          INNER JOIN project ON project.id = ProjectSkill.project_id
          WHERE project.user_id = user.id
       ), 'A') ||
       setweight(to_tsvector(user.title), 'B') ||
       setweight(to_tsvector(user.summary), 'C') ||
       setweight(to_tsvector(project.title), 'D')
       AS document
      FROM user
      JOIN project ON project.user_id = user.id
      INNER JOIN projectskill ON projectskill.project_id = project.id
      INNER JOIN skill ON skill.id = projectskill.project_id
      GROUP BY user.id, project.id, skill.id
  ) p_search
  WHERE p_search.document @@ to_tsquery('english', '${q}')
  ORDER BY id ASC, ts_rank(p_search.document, to_tsquery('english', '${q}')) DESC
) users)
