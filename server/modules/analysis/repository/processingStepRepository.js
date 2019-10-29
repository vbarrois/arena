import camelize from 'camelize'

import db from '@server/db/db'

import { dbTransformCallback, getSurveyDBSchema } from '@server/modules/survey/repository/surveySchemaRepositoryUtils'

// ====== CREATE
export const insertStep = async (surveyId, processingChainUuid, processingStepIndex, client = db) =>
  await client.one(`
      INSERT INTO ${getSurveyDBSchema(surveyId)}.processing_step
        (processing_chain_uuid, index)  
      VALUES 
        ($1, $2)
      RETURNING *
    `,
    [processingChainUuid, processingStepIndex],
    dbTransformCallback
  )

// ====== READ
export const fetchStepsByChainUuid = async (surveyId, processingChainUuid, client = db) => {
  const schema = getSurveyDBSchema(surveyId)

  return await client.map(`
    SELECT
      s.*,
      COUNT(c.uuid) AS calculations_count
    FROM
      ${schema}.processing_step s
    LEFT OUTER JOIN
      ${schema}.processing_step_calculation c
    ON
      s.uuid = c.processing_step_uuid
    WHERE
      s.processing_chain_uuid = $1
    GROUP BY
      s.uuid
    ORDER BY
      s.index`,
    [processingChainUuid],
    camelize
  )
}

export const fetchStepByUuid = async (surveyId, processingStepUuid, client = db) =>
  await client.one(`
      SELECT *
      FROM ${getSurveyDBSchema(surveyId)}.processing_step
      WHERE uuid = $1
    `,
    [processingStepUuid],
    camelize
  )
// ====== UPDATE

// ====== DELETE
