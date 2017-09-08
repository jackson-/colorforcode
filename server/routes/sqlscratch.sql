SELECT
  job.*, skills.*, skills.jobskill."created_at" AS skills.jobskill."created_at", skills.jobskill."updated_at" AS skills.jobskill."updated_at", skills.jobskill."job_id" AS skills.jobskill."job_id", skills.jobskill."skill_id" AS skills.jobskill."skill_id"
FROM job AS job
LEFT OUTER JOIN (
  jobskill AS skills.jobskill
  INNER JOIN skill AS skills
  ON skills.id = skills.jobskill."skill_id"
)
ON job.id = skills.jobskill."job_id"
WHERE job.employment_types @> ARRAY['Remote','Full Time']::VARCHAR(255)[];
