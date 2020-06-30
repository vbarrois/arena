import * as Calculation from '@common/analysis/processingStepCalculation'

import * as NodeDef from '@core/survey/nodeDef'

import { useUpdate } from './useUpdate'

export const useUpdateAttribute = ({
  chain,
  setChain,
  step,
  setStep,
  setDirty,
  calculation,
  setCalculation,
  setCalculationDirty,
}) => {
  const update = useUpdate({
    chain,
    setChain,
    step,
    setStep,
    setDirty,
    calculation,
    setCalculation,
    setCalculationDirty,
  })

  return ({ attrDef }) => {
    const calculationUpdated = Calculation.assocNodeDefUuid(NodeDef.getUuid(attrDef))(calculation)
    update({ calculationUpdated })
  }
}
