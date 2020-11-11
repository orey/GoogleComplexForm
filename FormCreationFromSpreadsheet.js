/*==============================================================
 * Script to create a form from a meta description stored in a
 * Google spreadsheet.
 * This code erases the form previously created.
 * Author: O. Rey
 * Version: 1.0
 * Licence: GPL v3
 * Date: November 11 2020
 *==============================================================*/

const SEPARATOR = '|';
const CONFIG_SS_ID = "1SBGeXMO8SlLhgVWehkE9hMkpF-IaWh-EiuMMQuhZWw4";

const FORM_ID = "1UcSsStTE5rR6Pn6koPcLpYLrOfW9ROQ74_UhU9fQ60A";
const FORM_NAME = "Olivier's questionnaire";
const FORM_VERSION = "1.0";
const FORM_DESCRIPTION = "My test questionnaire";

const OUTPUT_SS_ID = "1xPV4tP0pClY_h5LbnKaRuev2SBZpE_f3k9ufah5j6_I";
const CONFIG_SHEET = "CONFIG";

const MULTIPLE = 'CHECKBOX';
const SINGLE = 'RADIOBUTTON';
const SECTION = 'SECTION';
const DATE = 'DATE';
const GRID = 'GRID';
const TRUE = 'TRUE';
const FALSE = 'FALSE';


/*
 * Mapping Logger in 'console' class
 */
class console {
    static log(str){
        Logger.log(str);
    }
}

/*
 * Multiple choices
 */
function addMultipleChoices(f, title, choices, other=false){
    f.addCheckboxItem()
     .setTitle(title)
     .setChoiceValues(choices)
     .showOtherOption(other);
}


/*
 * Single choice
 */
function addSingleChoice(f, title, choices, other=false){
    f.addMultipleChoiceItem()
     .setTitle(title)
     .setChoiceValues(choices)
        .showOtherOption(other);
}


/*
 * Re-init form
 */
function reInitForm(f){
    let items = f.getItems();
    for (let i of items) {
        f.deleteItem(i);
        console.log('"' + i + '" item deleted');
    }
    
}


/*
 * Tools
 */
function createList(str){
    return str.split(SEPARATOR);
}

function opened(str){
    return (str == TRUE) ? true : false;
}



/*
 * This function creates a form based on the spreadsheet ID and the formname
 * Warning: The ojects need to have permissions.
 */
function createFormFromSpreadsheet(create = false){
    let ss = SpreadsheetApp.openById(CONFIG_SS_ID);
    console.log("Name of the parameter spreadsheet: " + ss.getName());
  
    // Create a new form, then add a checkbox question, a multiple choice question,
    // a page break, then a date question and a grid of questions.
    let form;
    if (create)
        form = FormApp.create(FORM_NAME + " - Version " + FORM_VERSION);
    else
        form = FormApp.openById(FORM_ID);

    // Remove everything in the form
    reInitForm(form);

    form.setDescription(FORM_DESCRIPTION)
        .setCollectEmail(true);


    let lastrow = ss.getSheetByName(CONFIG_SHEET).getLastRow();
    console.log("Last row: " + lastrow);
    let row, l;
    for (let i=2; i <= lastrow; i++){
        row = ss.getRange(CONFIG_SHEET + "!A" + i.toString() + ":E" +  i.toString());
        l = row.getValues()[0];
        console.log(l);

        if (l[0] == MULTIPLE)
            addMultipleChoices(form, l[1], createList(l[2]), opened(l[4]));
        else if (l[0] == SINGLE)
            addSingleChoice(form, l[1], createList(l[2]), opened(l[4]));
        else if (l[0] == SECTION)
            form.addPageBreakItem().setTitle(l[1]);
        else if (l[0] == DATE)
            form.addDateItem().setTitle(l[1]);
        else if (l[0] == GRID)
            form.addGridItem().setTitle(l[1]).setRows(createList(l[2])).setColumns(createList(l[3]));
        else
            console.log("Unrecognized command: "+ l[0]);
    }
    
    /*
    addMultipleChoices(form,
                       'What condiments would you like on your hot dog?',
                       ['Ketchup', 'Mustard','Relish']);

    addSingleChoice(form,
                    'Do you prefer cats or dogs?',
                    ['Cats','Dogs', 'Snakes'],
                    true);
  
    form.addPageBreakItem()
        .setTitle('Getting to know you');
    form.addDateItem()
        .setTitle('When were you born?');
    form.addGridItem()
        .setTitle('Rate your interests')
        .setRows(['Cars', 'Computers', 'Celebrities'])
        .setColumns(['Boring', 'So-so', 'Interesting']);
    */
    
    console.log('Published URL: ' + form.getPublishedUrl());
    console.log('Editor URL: ' + form.getEditUrl());

    // Update the form's response destination.
    form.setDestination(FormApp.DestinationType.SPREADSHEET, OUTPUT_SS_ID);

    
    return true;
}



