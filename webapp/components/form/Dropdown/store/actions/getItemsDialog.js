import * as StringUtils from '@core/stringUtils'
import { State } from '../state'

// Utility function used to get or fetch the dialog items
export const getItemsDialog = async ({ state, value }) => {
  const autocompleteMinChars = State.getAutocompleteMinChars(state)
  const items = State.getItems(state)
  const searchValue = value.trim()

  if (autocompleteMinChars <= 0 && searchValue.length === 0) {
    return items.constructor === Array ? items : items(searchValue)
  }

  if (autocompleteMinChars > 0 && searchValue.length < autocompleteMinChars) {
    return []
  }

  return items.constructor === Array
    ? items.filter((item) =>
        item.constructor === String
          ? StringUtils.contains(searchValue, item)
          : StringUtils.contains(searchValue, State.getItemKey(state)(item)) ||
            StringUtils.contains(searchValue, State.getItemLabel(state)(item))
      )
    : items(value)
}
