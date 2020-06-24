import { useCreate } from './useCreate'
import { useDelete } from './useDelete'
import { useMove } from './useMove'
import { useUpdateProp } from './useUpdateProp'
import { useUpdateAttribute } from './useUpdateAttribute'

export const useActions = ({ chain, setChain, dirty, setDirty, step, setStep, calculation, setCalculation }) => ({
  create: useCreate({ chain, setChain, step, setStep, setCalculation }),
  move: useMove({ step, setStep }),
  delete: useDelete({ step, setStep, calculation, setCalculation }),
  updateProp: useUpdateProp({ chain, setChain, dirty, setDirty, step, setStep, calculation, setCalculation }),
  updateAttribute: useUpdateAttribute({ chain, setChain, dirty, setDirty, step, setStep, calculation, setCalculation }),
})
