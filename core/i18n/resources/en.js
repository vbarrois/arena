/* eslint-disable camelcase */
import * as ActivityLog from '@common/activityLog/activityLog'

export const enTranslation = {
  common: {
    add: 'Add',
    apply: 'Apply',
    aggregateFunction: 'Aggregate function',
    aggregateFunction_plural: 'Aggregate functions',
    avg: 'Average',
    ascending: 'Ascending',
    back: 'Back',
    cancel: 'Cancel',
    cancelConfirm: `**There are unsaved changes**.

Do you want to cancel them?`,
    cantUndoWarning: 'This operation cannot be undone',
    cantBeDeletedUsedItem: 'This {{item}} is used by some node definitions and cannot be deleted',
    close: 'Close',
    cnt: 'Count',
    code: 'Code',
    childrenEmpty: 'Define at least one child item',
    csvExport: 'CSV Export',
    csvImport: 'CSV Import',
    cycle: 'Cycle',
    cycle_plural: 'Cycles',
    dateCreated: 'Date created',
    dateLastModified: 'Date last modified',
    delete: 'Delete',
    deleted: 'Deleted!',
    descending: 'Descending',
    description: 'Description',
    description_plural: 'Descriptions',
    dimension: 'Dimension',
    dimension_plural: 'Dimensions',
    done: 'Done',
    download: 'Download',
    draft: 'Draft',
    edit: 'Edit',
    email: 'Email',
    emailSentConfirmation: 'An email to {{email}} has been sent',
    empty: 'Empty',
    error: 'Error',
    error_plural: 'Errors',
    errorMessage: 'Error message',
    errorMessage_plural: 'Error messages',
    false: 'False',
    formContainsErrors: 'Form contains errors',
    formContainsErrorsCannotSave: 'The form contains errors. Please, fix them before saving.',
    from: 'From',
    group: 'Group',
    id: 'id',
    import: 'Import',
    invalid: 'INVALID',
    item: 'Item',
    item_plural: 'Items',
    label: 'Label',
    label_plural: 'Labels',
    language: 'Language',
    leavePageConfirmMessage: `There are unsaved changes in the form. 

By confirming, all changes will be lost.
Do you want to proceed?`,
    max: 'Maximum',
    med: 'Median',
    manage: 'Manage',
    message_plural: 'Messages',
    measure: 'Measure',
    measure_plural: 'Measures',
    min: 'Minimum',
    name: 'Name',
    new: 'New',
    no: 'No',
    noItems: `$t(common.no) $t(common.item,{'count':2})`,
    orderBy: 'Order by',
    of: 'of',
    ok: 'Ok',
    owner: 'Owner',
    path: 'Path',
    publish: 'Publish',
    publishConfirm: `#### You are about to publish the survey {{survey}} ####

###### The publishing process will *permanently delete* the following information ###### 
- Labels associated with deleted languages.
- Records associated with deleted cycles.
- Data associated with deleted form fields.

###### After publishing: ###### 
- Form fields cannot be changed from single to multiple and vice versa.
- Category items' codes cannot be changed.
- Category items cannot be deleted.
- Taxonomy codes cannot be changed.
- Taxa cannot be deleted.

**Are you sure you want to continue?**`,
    required: 'Required',
    reset: 'Reset',
    save: 'Save',
    saved: 'Saved!',
    select: 'Select',
    selected: 'Selected',
    srs: 'SRS',
    sum: 'Sum',
    to: 'To',
    true: 'True',
    type: 'Type',
    undefinedName: 'Undefined name',
    upload: 'Upload',
    view: 'View',
    warning: 'Warning',
    warning_plural: 'Warnings',
    yes: 'Yes',
    date: {
      aMomentAgo: 'A moment ago',
      hour: 'hour',
      hour_plural: 'hours',
      day: 'day',
      day_plural: 'days',
      minute: 'minute',
      minute_plural: 'minutes',
      week: 'week',
      week_plural: 'weeks',
      timeDiff: `{{count}} $t(common.date.{{unit}}, { 'count': {{count}} }) ago`,
    },
  },

  sidebar: {
    openForisShort: 'OF',
    openForis: 'Open Foris',
    logout: 'Logout',
  },

  header: {
    myProfile: 'My profile',
  },

  nodeDefsTypes: {
    integer: 'Integer',
    decimal: 'Decimal',
    text: 'Text',
    date: 'Date',
    time: 'Time',
    boolean: 'Boolean',
    code: 'Code',
    coordinate: 'Coordinate',
    taxon: 'Taxon',
    file: 'File',
    entity: 'Entity',
  },

  // ====== App modules and views

  appModules: {
    home: 'Home',
    dashboard: 'Dashboard',
    surveyList: 'My Surveys',
    collectImportReport: 'Collect Import Report',

    designer: 'Survey',
    formDesigner: 'Form Designer',
    surveyHierarchy: 'Hierarchy',
    categories: 'Categories',
    taxonomies: 'Taxonomies',

    data: 'Data',
    records: 'Records',
    explorer: 'Explorer',
    validationReport: 'Validation report',

    users: 'Users',
    userList: 'User list',

    analysis: 'Analysis',
    processingChain: 'Processing Chain',
    processingChain_plural: 'Processing Chains',
  },

  surveyDefsLoader: {
    requireSurveyPublish: 'This section is available only when survey is published',
  },

  loginView: {
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourPassword: 'Your password',
    yourNewPassword: 'Your new password',
    repeatYourNewPassword: 'Repeat your new password',
    resetPassword: 'Reset password',
    login: 'Login',
    forgotPassword: 'Forgot password',
    sendPasswordResetEmail: 'Send password reset email',
  },

  resetPasswordView: {
    setNewPassword: 'Set new password',
    forgotPasswordLinkInvalid: 'The page you have tried to access does not exist or is no longer valid',
    passwordSuccessfullyReset: 'Your password has been successfully reset',
  },

  homeView: {
    createSurvey: 'Create Survey',
    surveyDeleted: 'Survey {{surveyName}} has been deleted',
    surveyInfo: {
      confirmDeleteCycle: 'Are you sure you want to delete the cycle {{cycle}}?\n\n$t(common.cantUndoWarning)',
      editInfo: 'Edit info',
      viewInfo: 'View info',
    },
    deleteSurveyDialog: {
      confirmDelete: 'Are you sure you want to delete this survey?',
      deleteWarning: 'Deleting the **{{surveyName}}** survey will delete all of its data.',
      confirmName: 'Enter this survey’s name to confirm:',
    },
    surveyList: {
      status: 'Status',
      active: 'Active',
      activate: 'Activate',
    },
    surveyCreate: {
      createSurvey: 'Create Survey',
      importFromCollect: 'Import from Collect',
    },
    collectImportReport: {
      expression: 'Expression',
      resolved: 'Resolved',
      exprType: {
        applicable: '$t(nodeDefEdit.advancedProps.relevantIf)',
        codeParent: 'Parent code',
        defaultValue: 'Default value',
        validationRule: 'Validation rule',
      },
    },
    recordsSummary: {
      recordsAdded: 'Records added from {{from}} to {{to}}',
      record: '{{count}} Record',
      record_plural: '{{count}} Records',
      week: '{{count}} Week',
      week_plural: '{{count}} Weeks',
      month: '{{count}} Month',
      month_plural: '{{count}} Months',
      year: '{{count}} Year',
      year_plural: '{{count}} Years',
    },
  },

  activityLogView: {
    recentActivity: 'Recent activity',
    messages: {
      // Survey
      [ActivityLog.type.surveyCreate]: 'created the survey',
      [ActivityLog.type.surveyPropUpdate]: 'updated survey {{key}}',
      [ActivityLog.type.surveyPublish]: 'published the survey',
      [ActivityLog.type.surveyCollectImport]: 'imported the survey from Collect',

      // NodeDef
      [ActivityLog.type.nodeDefCreate]: 'added node definition {{type}} in entity {{parentName}}',
      [ActivityLog.type.nodeDefUpdate]: 'updated {{keys}} of node definition {{name}}',
      [ActivityLog.type.nodeDefMarkDeleted]: 'deleted node definition {{name}}',

      // Category
      [ActivityLog.type.categoryInsert]: 'added category',
      [ActivityLog.type.categoryPropUpdate]: 'updated {{key}} of category {{categoryName}}',
      [ActivityLog.type.categoryDelete]: 'deleted category {{categoryName}}',
      [ActivityLog.type.categoryLevelInsert]: 'added level at index {{index}} to category {{categoryName}}',
      [ActivityLog.type.categoryLevelPropUpdate]: 'updated level {{index}} {{key}} of category {{categoryName}}',
      [ActivityLog.type.categoryLevelDelete]: 'deleted level {{index}} of category {{categoryName}}',
      [ActivityLog.type.categoryItemInsert]: 'added item to level {{levelIndex}} of category {{categoryName}}',
      [ActivityLog.type.categoryItemPropUpdate]: 'updated item {{code}} {{key}} of category {{categoryName}}',
      [ActivityLog.type.categoryItemDelete]:
        'deleted item {{code}} at level {{levelIndex}} of category {{categoryName}}',
      [ActivityLog.type.categoryImport]: 'imported CSV file to category {{categoryName}}',

      // Taxonomy
      [ActivityLog.type.taxonomyCreate]: 'added taxonomy',
      [ActivityLog.type.taxonomyPropUpdate]: 'updated {{key}} of taxonomy {{taxonomyName}}',
      [ActivityLog.type.taxonomyDelete]: 'deleted taxonomy {{taxonomyName}}',
      [ActivityLog.type.taxonomyTaxaImport]: 'imported CSV file to taxonomy {{taxonomyName}}',
      [ActivityLog.type.taxonInsert]: 'added taxon to taxonomy {{taxonomyName}}',

      // Record
      [ActivityLog.type.recordCreate]: 'added record',
      [ActivityLog.type.recordDelete]: 'deleted record {{keys}}',
      [ActivityLog.type.recordStepUpdate]: 'updated record {{keys}} step from {{stepFrom}} to {{stepTo}}',

      // Node
      [ActivityLog.type.nodeCreate]: 'added node {{name}} in {{parentPath}} to record {{recordKeys}}',
      [ActivityLog.type.nodeValueUpdate]: 'updated node {{name}} in {{parentPath}} of record {{recordKeys}}',
      [ActivityLog.type.nodeDelete]: 'deleted node {{name}} from record {{recordKeys}}',

      // User
      [ActivityLog.type.userInvite]: 'invited user {{email}} with role {{groupName}}',
      [ActivityLog.type.userUpdate]: 'updated user {{name}}',
      [ActivityLog.type.userRemove]: 'removed user {{name}} from survey',

      // Analysis
      [ActivityLog.type.processingChainCreate]: 'added processing chain',
      [ActivityLog.type.processingChainPropUpdate]: 'updated {{key}} of processing chain {{label}}',
      [ActivityLog.type.processingChainStatusExecSuccess]: 'successfully executed processing chain {{label}}',
      [ActivityLog.type.processingChainDelete]: 'deleted processing chain {{label}}',
      [ActivityLog.type.processingStepCreate]:
        'added processing step {{index}} to processing chain {{processingChainLabel}}',
      [ActivityLog.type.processingStepPropUpdate]:
        'updated {{key}} of processing chain {{processingChainLabel}} step {{index}}',
      [ActivityLog.type.processingStepDelete]: 'deleted processing chain {{processingChainLabel}} step {{index}}',
      [ActivityLog.type.processingStepCalculationCreate]:
        'added calculation {{index}} to processing chain {{processingChainLabel}} step {{stepIndex}}',
      [ActivityLog.type.processingStepCalculationIndexUpdate]:
        'updated calculation index from {{indexFrom}} to {{indexTo}} of processing chain {{processingChainLabel}} step {{stepIndex}}',
      [ActivityLog.type.processingStepCalculationUpdate]:
        'updated calculation {{label}} at index {{index}} of processing chain {{processingChainLabel}} step {{stepIndex}}',
      [ActivityLog.type.processingStepCalculationDelete]:
        'deleted calculation {{label}} at index {{index}} of processing chain {{processingChainLabel}} step {{stepIndex}}',
    },
  },

  designerView: {
    formPreview: 'Form preview',
  },

  recordView: {
    justDeleted: 'This record has just been deleted',
    sessionExpired: 'Record session has expired',
  },

  dataView: {
    records: {
      owner: 'Owner',
      step: 'Step',
      noRecordsAdded: 'No records added',
    },
    rowNum: 'Row #',
    invalidRecord: 'Invalid record',
    dataVis: {
      noData: 'This query returned no data',
    },
  },

  usersView: {
    inviteUser: 'Invite',
    accepted: 'Accepted',
    updateUserConfirmation: 'User {{name}} has been updated',
    notAcceptedYet: 'Invitation not accepted yet',
  },

  userView: {
    scale: 'Scale',
    rotate: 'Rotate',
    dragAndDrop: 'Drop an image above or',
    upload: 'click here to upload',
    sendInvitation: 'Send invitation',
    sendNewInvitation: 'Send new invitation',
    removeFromSurvey: 'Remove from survey',
    confirmRemove: 'Are you sure you want to revoke access to {{user}} from survey {{survey}}?',
    removeUserConfirmation: 'User {{user}} has been removed from survey {{survey}}',
  },

  processingChainView: {
    formLabel: 'Processing chain label',
    dateExecuted: 'Date executed',
    status: 'Status',
    deleteConfirm: `Delete this processing chain?
    
$t(common.cantUndoWarning)`,
    deleteComplete: 'Processing chain deleted',
    processingSteps: 'Processing steps',
    cannotSelectNodeDefNotBelongingToCycles: `The node definition "{{label}}" cannot be selected because it doesn't belong to all cycles of the processing chain`,
    cannotSelectCycle: 'This cycle cannot be selected because some node definitions do not belong to this cycle',
  },

  processingStepView: {
    deleteConfirm: `Delete this processing step?
    
$t(common.cantUndoWarning)`,
    deleteComplete: 'Processing step deleted',
    category: 'Category',
    calculationSteps: 'Calculation Steps',
    virtualEntity: 'Virtual Entity',
  },

  processingStepCalculation: {
    attribute: 'Attribute',
    types: {
      quantitative: 'Quantitative',
      categorical: 'Categorical',
    },
    deleteConfirm: `Delete this calculation step?
    
$t(common.cantUndoWarning)`,
  },

  itemsTable: {
    unused: 'Unused',
    noItemsAdded: 'No items added',
  },

  // ====== Survey views

  nodeDefEdit: {
    basic: 'Basic',
    advanced: 'Advanced',
    validations: 'Validations',
    function: 'Function',
    editorHelp: 'Valid expressions are a subset of Javascript.',
    editorCompletionHelp: '- Show the available variables and functions that can be used',
    functionDescriptions: {
      min: 'Take the minimum of the arguments',
      max: 'Take the maximum of the arguments',
      pow: 'Raise a number X to the power P',
      ln: 'Take the natural logarithm of x',
      log10: 'Take the base 10 logarithm of x',
    },
    basicProps: {
      key: 'Key',
      multiple: 'Multiple',
      displayAs: 'Display as',
      displayIn: 'Display in',
      form: 'Form',
      table: 'Table',
      parentPage: 'Parent page',
      ownPage: 'Its own page',
      analysis: 'Analysis',
      entitySource: 'Entity Source',
      formula: 'Formula',
    },
    advancedProps: {
      readOnly: 'Read only',
      defaultValues: 'Default values',
      relevantIf: 'Relevant if',
    },
    decimalProps: {
      maxNumberDecimalDigits: 'Max number of decimal digits',
    },
    booleanProps: {
      labelValue: 'Label value',
      labelValues: {
        trueFalse: '$t(common.true)/$t(common.false)',
        yesNo: '$t(common.yes)/$t(common.no)',
      },
    },
    codeProps: {
      category: 'Category',
      displayAs: 'Display As',
      displayAsTypes: {
        checkbox: 'Checkbox',
        dropdown: 'Dropdown',
      },
      parentCode: 'Parent Code',
    },
    expressionsProp: {
      expression: 'Expression',
      applyIf: 'Apply If',
      confirmDelete: 'Delete this expression?',
      severity: 'Severity',
    },
    validationsProps: {
      minCount: 'Min count',
      maxCount: 'Max count',
      expressions: 'Expressions',
    },
    cannotChangeIntoMultipleWithDefaultValues:
      'This node cannot be converted to multiple because it has default values.',
    cannotDeleteNodeDefReferenced: `Cannot delete "{{nodeDef}}": it's referenced by these node definitions: {{nodeDefDependents}}`,
  },

  languagesEditor: {
    languages: 'Language(s)',
  },

  surveyForm: {
    subPage: 'Sub page',
    addChildTo: 'Add to {{nodeDef}}',
    hidePages: 'Hide pages',
    showPages: 'Show pages',
    formEditActions: {
      preview: 'Preview',
    },
    formEntryActions: {
      confirmDemote: 'Are sure you want to demote this record to {{name}}?',
      confirmPromote: `Are sure you want to promote this record to {{name}}?\n\nYou won't be able to edit it anymore`,
      confirmDelete: 'Are you sure you want to delete this record?\n\n$t(common.cantUndoWarning)',
      closePreview: 'Close preview',
      step: 'Step {{id}} ({{name}})',
    },
    nodeDefEditFormActions: {
      columns: 'Columns',
      confirmDelete: 'Are you sure you want to permanently delete this node definition?\n\n$t(common.cantUndoWarning)',
    },
    nodeDefCode: {
      buttonCode: 'Button code',
      code: '$t(common.code)',
      label: '$t(common.label)',
    },
    nodeDefBoolean: {
      labelValue: {
        trueFalse: {
          true: '$t(common.true)',
          false: '$t(common.false)',
        },
        yesNo: {
          true: '$t(common.yes)',
          false: '$t(common.no)',
        },
      },
    },
    nodeDefCoordinate: {
      x: 'X',
      y: 'Y',
    },
    nodeDefEntityForm: {
      confirmDelete: 'Are you sure you want to delete this entity?',
      select: 'Select',
    },
    nodeDefTaxon: {
      code: '$t(common.code)',
      scientificName: 'Scientific name',
      vernacularName: 'Vernacular name',
    },
    nodeDefFile: {
      fileUuid: 'File uuid',
      fileName: 'File name',
    },
    step: {
      entry: 'Entry',
      cleansing: 'Cleansing',
      analysis: 'Analysis',
    },
    confirmNodeDelete: 'Are you sure you want to delete this item?',
  },

  taxonomy: {
    header: 'Taxonomy',
    cantBeDeleted: `$t(common.cantBeDeletedUsedItem, {'item': 'taxonomy'})`,
    confirmDelete: 'Delete the taxonomy {{taxonomyName}}?\n$t(common.cantUndoWarning)',
    edit: {
      taxonomyListName: 'Taxonomy list name',
      taxaNotImported: 'Taxa not imported',
      family: 'Family',
      genus: 'Genus',
      scientificName: '$t(surveyForm.nodeDefTaxon.scientificName)',
    },
  },

  categoryEdit: {
    header: 'Category',
    addLevel: 'Add level',
    categoryName: 'Category name',
    cantBeDeleted: `$t(common.cantBeDeletedUsedItem, {'item': 'category'})`,
    cantBeDeletedLevel: `$t(common.cantBeDeletedUsedItem, {'item': 'category level'})`,
    cantImportCsvIntoPublishedCategory: 'Cannot import CSV into a published category.',
    confirmDelete: 'Delete the category {{categoryName}}?\n$t(common.cantUndoWarning)',
    confirmDeleteLevel: `Delete the category level '{{levelName}}' with all items?\n$t(common.cantUndoWarning)`,
    confirmDeleteItem: `Delete the item?

$t(common.cantUndoWarning)`,
    confirmDeleteItemWithChildren: `Delete the item with all children?

$t(common.cantUndoWarning)`,
    deleteItem: 'Delete item',
    level: 'Level',

    importSummary: {
      column: 'Column',
      columnTypeSummary: 'Level {{level}} $t(categoryEdit.importSummary.columnType.{{type}})',
      columnTypeSummaryExtra: '{{type}}',
      columnTypeSummaryWithLanguage: '$t(categoryEdit.importSummary.columnTypeSummary) ({{language}})',
      columnType: {
        code: 'code',
        description: 'description',
        label: 'label',
        extra: 'extra',
      },
      columnDataType: {
        geometryPoint: 'Geometry Point',
        number: 'Number',
        text: 'Text',
      },
      dataType: 'Data Type',
    },
  },

  // ===== All validation errors
  validationErrors: {
    // Common
    invalidField: '"{{field}}" is invalid',
    invalidNumber: 'Invalid number',
    invalidDate: 'Invalid date',
    nameDuplicate: 'Name is duplicate',
    nameCannotBeKeyword: `Name "{{value}}" cannot be used: it's a reserved word`,
    nameRequired: 'Name is required',
    rowsDuplicate: 'row: {{row}} duplicate row: {{duplicateRow}}',

    analysis: {
      labelDefaultLangRequired: 'Label in survey default language is required',
      processingChain: {
        stepsRequired: 'At least one step is required',
      },
      processingStep: {
        entityOrCategoryRequired: 'One of Entity or Category is required',
        calculationsRequired: 'At least one calculation is required',
      },
      processingStepCalculation: {
        attributeRequired: 'Attribute is required',
        invalid: 'Processing Step Calculation is invalid',
      },
    },

    categoryEdit: {
      childrenEmpty: '$t(common.childrenEmpty)',
      childrenInvalid: 'At least one invalid child',
      codeCannotBeKeyword: `Code "{{value}}" cannot be used: it's a reserved word`,
      codeDuplicate: 'Code is duplicate',
      codeRequired: 'Code is required',
      itemExtraPropInvalidNumber: 'Invalid number for extra property "{{key}}"',
      itemExtraPropInvalidGeometryPoint: 'Invalid geometry point for extra property "{{key}}"',
      itemsInvalid: 'At least one invalid item',
      itemsEmpty: 'Define at least one item',
      levelDuplicate: 'Level name is duplicate',
      levelsInvalid: 'At least one invalid level',
    },

    categoryImport: {
      codeColumnMissing: 'There should be at least one "code" column',
      codeRequired: '{{columnName}}: a code is required',
      codeDuplicate: '{{columnName}}: duplicate code "{{code}}"',
      columnMissing: 'Missing column: {{columnNameMissing}}',
      emptyHeaderFound: 'The file contains an empty header',
      emptyFile: 'The file you are trying to import is empty',
    },

    expressions: {
      cannotGetChildOfAttribute: 'cannot get child node {{childName}} of attribute {{parentName}}',
      cannotUseCurrentNode: 'cannot use current node {{name}} in this expression',
      circularDependencyError: 'cannot reference node {{name}} because it references the current node',
      expressionInvalid: 'Invalid expression: {{details}}',
      unableToFindNode: 'unable to find node: {{name}}',
      unableToFindNodeChild: 'unable to find child node: {{name}}',
      unableToFindNodeParent: 'unable to find parent node: {{name}}',
      unableToFindNodeSibling: 'unable to find sibling node: {{name}}',
    },

    nodeDefEdit: {
      applyIfDuplicate: '"$t(nodeDefEdit.expressionsProp.applyIf)" condition is duplicate',
      applyIfInvalid: 'Invalid "$t(nodeDefEdit.advancedProps.relevantIf)" condition',
      countMaxMustBePositiveNumber: 'Max Count must be a positive integer',
      countMinMustBePositiveNumber: 'Min Count must be a positive integer',
      categoryRequired: 'Category is required',
      childrenEmpty: '$t(common.childrenEmpty)',
      defaultValuesInvalid: 'Invalid "Default Values"',
      defaultValuesNotSpecified: 'Default value not specified',
      entitySourceRequired: 'Entity Source required',
      expressionApplyIfOnlyLastOneCanBeEmpty:
        'Only last expression can have empty "$t(nodeDefEdit.expressionsProp.applyIf)" condition',
      expressionDuplicate: 'Expression duplicate',
      expressionRequired: 'Expression required',
      formulaInvalid: 'Formula is invalid',
      keysEmpty: 'Define at least one key attribute',

      keysExceedingMax: 'Exceeding maximum number of key attributes',
      nameInvalid:
        'Name is invalid (it must contain only lowercase letters, numbers and underscores, starting with a letter)',
      taxonomyRequired: 'Taxonomy is required',
      validationsInvalid: 'Invalid "Validations"',
    },

    record: {
      keyDuplicate: 'Duplicate record key',
      oneOrMoreInvalidValues: 'One or more values are invalid',

      entityKeyDuplicate: 'Duplicate entity key',
      nodesMaxCountExceeded: '{{nodeDefName}} nodes must be less than or equal to {{maxCount}}',
      nodesMinCountNotReached: '{{nodeDefName}} nodes must be more than or equal to {{minCount}}',
      valueInvalid: 'Invalid value',
      valueRequired: 'Required value',
    },

    surveyInfoEdit: {
      langRequired: 'Language is required',
      srsRequired: 'Spatial Reference System is required',
      cyclesRequired: 'At least one cycle must be defined',
      cyclesExceedingMax: 'A survey can have at most 10 cycles',
      cycleDateStartBeforeDateEnd: 'Cycle start date must be before its end date',
      cycleDateStartAfterPrevDateEnd: 'Cycle start date must be after previous cycle end date',
      cycleDateStartInvalid: 'Cycle start date is invalid',
      cycleDateStartMandatory: 'Cycle start date is mandatory',
      cycleDateEndInvalid: 'Cycle end date is invalid',
      cycleDateEndMandatoryExceptForLastCycle: 'Cycle end date is mandatory for all but the last cycle',
    },

    taxonomyEdit: {
      codeDuplicate: 'Duplicate code {{code}}; $t(validationErrors.rowsDuplicate)',
      codeRequired: 'Code is required',
      familyRequired: 'Family is required',
      genusRequired: 'Genus is required',
      scientificNameDuplicate: 'Duplicate scientific name {{scientificName}}; $t(validationErrors.rowsDuplicate)',
      scientificNameRequired: 'Scientific name is required',
      taxaEmpty: 'Empty taxa',
      vernacularNamesDuplicate: `Duplicate vernacular name '{{name}}' for language '{{lang}}'`,
    },

    taxonomyImportJob: {
      missingRequiredColumns: 'Missing required column(s): {{columns}}',
    },

    user: {
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      emailNotFound: 'Email not found',
      groupRequired: 'Group is required',
      nameRequired: 'Name is required',
      passwordRequired: 'Password is required',
      passwordInvalid: 'Password should not start nor end with white spaces',
      passwordUnsafe:
        'Password should be at least 8 characters long and contain lowercase characters, uppercase characters and numbers',
      passwordsDoNotMatch: `Passwords don't match`,

      userNotFound: 'User not found. Make sure email and password are correct',
      passwordChangeRequired: 'Password change required',
    },
  },

  // ====== Jobs
  jobs: {
    CategoriesImportJob: 'Categories Import',
    CategoryImportJob: 'Category Import',
    CategoriesValidationJob: 'Categories Validation',
    ChainsValidationJob: 'Processing Chains Validation',
    CollectImportJob: 'Collect Import',
    CollectSurveyReaderJob: 'Collect Survey Reader',
    CyclesDeletedCheckJob: 'Deleted Cycles Check',
    NodeDefsImportJob: 'Node Definitions Import',
    NodeDefsValidationJob: 'Node Definitions Validation',
    ProcessingChainsCyclesCheckJob: `Processing Chains' Cycles Check`,
    RecordCheckJob: 'Record Check',
    RecordsImportJob: 'Records Import',
    RecordsUniquenessValidationJob: 'Records Uniqueness Validation',
    SamplingPointDataImportJob: 'Sampling Point Data Import',
    SurveyCreatorJob: 'Survey Create',
    SurveyDependencyGraphsGenerationJob: 'Survey Dependency Graph Generation',
    SurveyIndexGeneratorJob: 'Survey Index Generator',
    SurveyInfoValidationJob: 'Survey Info Validation',
    SurveyPropsPublishJob: 'Survey Props Publish',
    SurveyPublishJob: 'Survey Publish',
    SurveyPublishPerformJob: 'Survey Publish Perform',
    SurveyRdbCreationJob: 'Survey RDB Creation',
    TaxonomiesImportJob: 'Taxonomies Import',
    TaxonomiesValidationJob: 'Taxonomies Validation',
    TaxonomyImportJob: 'Taxonomy Import',
  },

  // ====== App Errors

  appErrors: {
    cannotGetChild: `Cannot get child '{{childName}}' from attribute {{name}}`,
    cannotOverridePublishedTaxa: 'Cannot overwrite published taxa',
    cantUpdateStep: `Can't update step`,
    entryDataNotFound: 'Entry data not found: {{entryName}}',
    generic: '{{text}}',
    invalidType: 'Invalid type {{type}}',
    jobCanceledOrErrorsFound: 'Job canceled or errors found; rollback transaction',
    paramIsRequired: 'Param {{param}} is required',
    processingChainCannotBeSaved: 'Processing chain or step or calculation is invalid and cannot be saved',
    processingStepOnlyLastCanBeDeleted:
      'Processing step cannot be deleted.\n\nOnly last step in processing chain can be deleted',
    unableToFindParent: 'Unable to find parent of {{name}}',
    unableToFindNode: 'Unable to find node with name {{name}}',
    unableToFindSibling: 'Unable to find sibling with name {{name}}',
    undefinedFunction: `Undefined function '{{fnName}}' or wrong parameter types`,
    invalidSyntax: 'Expression syntax is invalid',
    unsupportedFunctionType: 'Unsupported function type: {{exprType}}',
    functionHasTooFewArguments: 'Function {{fnName}} requires at least {{minArgs}} (got {{numArgs}})',
    functionHasTooManyArguments: 'Function {{fnName}} only accepts at most {{maxArgs}} (got {{numArgs}})',
    userHasPendingInvitation: `There's already a pending invitation for user {{email}}; he/she cannot be invited to this survey until it's accepted`,
    userHasRole: 'The given user has already a role in this survey',
    userInvalid: 'Invalid user',
    userIsAdmin: 'The given user is already a system administrator',
    userNotAllowedToChangePref: 'User not allowed to change pref',
    userNotAuthorized: 'User {{userName}} is not authorized',
  },

  systemErrors: {
    somethingWentWrong: 'Oooops! Something went wrong. Try to refresh the page.',
  },

  // ====== Common components

  expressionEditor: {
    and: 'AND',
    or: 'OR',
    group: 'Group',
    var: 'Var',
    const: 'Const',
  },

  // ====== Auth

  authGroups: {
    systemAdmin: {
      label: 'System Administrator',
      label_plural: 'System Administrators',
      description: 'OF Arena system administrators',
    },
    surveyAdmin: {
      label: 'Survey administrator',
      label_plural: 'Survey administrators',
      description: 'Full rights',
    },
    surveyEditor: {
      label: 'Survey editor',
      label_plural: 'Survey editors',
      description: 'Can edit survey, records, invite users',
    },
    dataEditor: {
      label: 'Data editor',
      label_plural: 'Data editors',
      description: 'Can edit records in data entry step',
    },
    dataCleanser: {
      label: 'Data cleanser',
      label_plural: 'Data cleansers',
      description: 'Can edit records in data cleansing step',
    },
    dataAnalyst: {
      label: 'Data analyst',
      label_plural: 'Data analysts',
      description: 'Can edit records in data analysis step',
    },
    surveyGuest: {
      label: 'Survey guest',
      label_plural: 'Survey guests',
      description: 'Can view records',
    },
  },

  emails: {
    signature: `<p>Thank you,<br>
      The OpenForis Arena team
      </p>`,
    temporaryMsg: '<p>This link is only valid for the next 7 days.</p>',
    userInvite: {
      subject: 'You have been invited to OpenForis Arena!',
      body: `<p>Hello,</p>
             <p>You have been invited to join the survey <strong>{{surveyLabel}}</strong> as {{groupLabel}}</p>
             <p><a href="{{urlResetPassword}}">Click here to access OpenForis Arena</a></p>
             $t(emails.temporaryMsg)
             $t(emails.signature)`,
    },
    userInviteRepeatConfirmation:
      'User {{email}} has been successfully invited again. $t(common.emailSentConfirmation)',
    userResetPassword: {
      subject: 'OpenForis Arena. Password reset',
      body: `<p>Hello {{name}},</p>
             <p>You recently requested to reset your password for your OpenForis Arena account. Click the link below to reset it.</p>
             <p><a href="{{url}}">Reset your password</a></p>
             $t(emails.temporaryMsg)
             <p>If you did not request a password reset, please ignore this email or let us know.<br/>This password reset link is only valid for the next 7 days.</p>
             $t(emails.signature)`,
    },
  },
}
