import { into, mouseAction, press } from 'taiko'
import { click, dragAndDrop, waitFor, waitFor1sec } from '../utils/api'
import { waitForLoader } from '../utils/ui/loader'
import { clickSidebarBtnSurveyForm } from '../utils/ui/sidebar'
import { dragSurveyFormTableItem, resizeSurveyFormItem } from '../utils/ui/surveyForm'

describe('SurveyForm edit: tree attributes re-order', () => {
  test('SurveyForm: navigate to plot', async () => {
    await waitForLoader()
    await clickSidebarBtnSurveyForm()
    await click('Plot')
  })

  test('Tree: enlarge table', async () => {
    // await resizeSurveyFormItem({ nodeDefName: 'tree', increaseWidth: 550, increaseHeight: 150 })

    // await dragSurveyFormTableItem({ nodeDefName: 'tree_dec_1', left: 200, bottom: 200 })
    // await press('Escape')

    // await dragAndDrop('TREE DECIMAL 1', into('TREE ID'))

    await waitFor1sec()
    const source = { x: 600, y: 430 }
    const destination = { x: 450, y: 570 }
    await mouseAction('press', source)
    // await waitFor(2000)
    await mouseAction('move', { x: 500, y: 570 })
    await waitFor(1000)

    await mouseAction('move', destination)

    // await waitFor(2000)
    await mouseAction('release', destination)
    await waitFor(2000)
  })
})
