import sketch from 'sketch'

let UI = require('sketch/ui');

let document = sketch.getSelectedDocument();
let symbols = document.getSymbols();

export default function() {
    
    let selected = new Boolean();
    
    for (let i in symbols) {
        if (symbols[i].selected == true) {
            selected = true;
            break;
        } else {
            selected = false;
        }
    }
    
    if (selected) {
        let indexSelectedSymbols = listingSelectedSymbols(symbols);
        let initialValue = getInitialValue(indexSelectedSymbols);
        let userTextInput = openRenameWindow(initialValue);
        renameSelectedSymbols(userTextInput, initialValue, indexSelectedSymbols);
    } else {
        UI.message("No master symbols selected");
    }

}


const listingSelectedSymbols = () => {
    let list = new Array();
    for (let i in symbols) {
        if (symbols[i].selected == true) {
            list.push(i);
        } 
    }
    
    console.log(`1 -  listingSelectedSymbols() = ${list}`);
    return list;
}

const decomposeSymbolName = (index) => {
    let symbolNames = new Array();
    for (let i in index) {
        symbolNames[i] = symbols[index[i]].name.split("/");
        
        for (let j in symbolNames[i]){
            symbolNames[i][j] = symbolNames[i][j].trim();
        }
    }
    console.log(`1 -  decomposeSymbolName() = ${symbolNames}`);
    return symbolNames;
}


const getInitialValue = (index) => {
    let result = new String();
    let temp = new Array();
    
    temp = decomposeSymbolName(index);
    
    if (index.length == 1) {
        for (let i in temp[0]){
            if (i == temp[0].length - 1) {
                result = result.concat(temp[0][i]);
            } else {
                result = result.concat(temp[0][i] + " / ");
            }
        }
    } else {
        let match = true;
        let maxColumn = 100;
        
        for (let i in temp){
            if (temp[i].length < maxColumn){
                maxColumn = temp[i].length;
            }
        }
        
        let column = 0;
        while (column < maxColumn) {
            let row = 0;
            while (row < temp.length - 1){
                if (temp[row][column] === temp[row + 1][column]) {
                    row++;
                } else {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                result = result.concat(temp[row][column] + " / ");
                column++;
            } else {
                break;
            }
        }
    }
    
    console.log(`2 -  getInitialValue() = ${result}`);
    return result;
}


const openRenameWindow = (initialValue) => {
    
    let answer = "default";
    
    UI.getInputFromUser("Symbol Master Renamer",
                {
                    description: 'You can organize your symbols using " / ".',
                    initialValue: initialValue,
                    type: 'string',
                },
                    (err, value) => {
                        if (err) {
                            UI.message("No renamed symbols");
                        } else {
                            answer = value;
                        }
                     }
    )
    
    console.log(`3 -  openRenameWindow() = ${answer}`);
    return answer;
}


const renameSelectedSymbols = (userTextInput, initialValue, indexSelectedSymbols) => {
    
    if (userTextInput != "default") {
        if (indexSelectedSymbols.length == 1) {
            symbols[indexSelectedSymbols[0]].name = userTextInput;
        } else {
            let temp = new Array();
            let newSymbolName = new Array();
            
            initialValue = initialValue.split(" / ");
            
            let pos1 = initialValue.indexOf(""); 
            initialValue.splice(pos1, 1);

            temp = decomposeSymbolName(indexSelectedSymbols);
            
            for (let i in temp) {
                newSymbolName[i] = userTextInput;
                
                let pos2 = temp[i].indexOf(initialValue[0]); 
                temp[i].splice(pos2, initialValue.length);
                
                for (let j in temp[i]) {
                    if (j != temp[i].length - 1) {
                        newSymbolName[i] = newSymbolName[i].concat(temp[i][j] + " / ");
                    } else {
                        newSymbolName[i] = newSymbolName[i].concat(temp[i][j]);
                    }
                }
                
                symbols[indexSelectedSymbols[i]].name = newSymbolName[i];
            }
            
            console.log(`4 -  renameSelectedSymbols() = Change symbol names to: ${indexSelectedSymbols} with: `);
            console.log(newSymbolName);
        }
    }
}
