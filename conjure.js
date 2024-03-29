var roptorCache = new Map()
var attackCache = new Map()
var advantageCache = []
var attacked = false
var isFirstConjure = true
class Animal {
    constructor(id, health) {
        this.id = id
        this.health = health
        this.advantage = true
    }

    attack() {
        return new Map()
    }
}

class Roptor extends Animal {
    constructor(id) {
        super(id, 10)
    }

    attack(withAdvantage) {
        var attacks = new Map()
        attacks.set('bite', this.bite(withAdvantage))
        attacks.set('claw', this.claw(withAdvantage))
        attackCache.set(this.id, attacks)
        console.log(this)
        console.log(attackCache)
        return attacks
    }

    bite(withAdvantage) {
        console.log("adv" + withAdvantage)
        var attackRolls = []
        if(withAdvantage) {
            for (let i = 0; i < 2; i++) {
                attackRolls.push(getRandomIntInclusive(1,20) + 4)
            }
        } else {
            attackRolls.push(getRandomIntInclusive(1,20) + 4)
        }

        var attackRoll = Math.max(...attackRolls)
        attackRolls.sort(function(a, b) { return b - a });

        if(attackRoll == 24) {
            var damage = 6 + getRandomIntInclusive(1,6) + 2
        } else {
            var damage = getRandomIntInclusive(1,6) + 2
        }
        var attacks = new Map()
        attacks.set('attackRolls', attackRolls)
        attacks.set('damage', damage)
        return attacks
    }

    claw(withAdvantage) {
        var attackRolls = []
        if(withAdvantage) {
            for (let i = 0; i < 2; i++) {
                attackRolls.push(getRandomIntInclusive(1,20)+4)
            }
        } else {
            attackRolls.push(getRandomIntInclusive(1,20)+4)
        }

        var attackRoll = Math.max(...attackRolls)
        attackRolls.sort(function(a, b) { return b - a });

        if(attackRoll == 24) {
            var damage = 4 + getRandomIntInclusive(1,4) + 2
        } else {
            var damage = getRandomIntInclusive(1,4) + 2
        } 
        var attacks = new Map()
        attacks.set('attackRolls', attackRolls)
        attacks.set('damage', damage)
        return attacks
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function attackWithAnimals() {
    var roptorCacheValuesArray = Array.from(roptorCache.values())
    console.log('ff' + roptorCacheValuesArray)
    for(let i = 0; i < roptorCacheValuesArray.length; i++) {
        console.log('e:' + roptorCacheValuesArray[i])
        roptorCacheValuesArray[i].attack(roptorCacheValuesArray[i].advantage)
    }
    attacked = true
    updateTable()

}

function conjure() {
    
    document.getElementById('attackButton').disabled = false
    var animalCount = document.getElementById('conjureCount').value

    console.log('cnt:' + animalCount)
    if(!isFirstConjure) {
        if (!confirm("Biztos új állatokat akarsz idézni?")) { return }
    }
    
    roptorCache = new Map()

    for (let i = 0; i < animalCount; i++) {
        uuid = crypto.randomUUID()
        roptorCache.set(uuid, new Roptor(uuid))
    }

    updateTable()
    isFirstConjure = false
    console.log('gee' + isFirstConjure)
}



function createTable(rowCount) {
    var headers = ["Élet", "Advantage", "Támadás Tipusa", "Dobás(ok)", "Sebzés"]
    var table = document.createElement('table')
    table.className = "table table-striped table-dark table-hover w-auto"
    table.id = "conjureTable"

    for (let i = 0; i < rowCount; i++) {
        var row = table.insertRow(i)
        row.insertCell(0).id = "health#" + i
        row.cells[0].className = 'col col-auto'
        row.insertCell(1).id = "advantage#" + i
        row.insertCell(2).id = "attackType#" + i
        row.insertCell(3).id = "attackRoll#" + i
        row.insertCell(4).id = "damage#" + i

        var checkbox = document.createElement("INPUT")
        checkbox.type = "checkbox"
        checkbox.checked =  Array.from(roptorCache.values())[i].advantage
        checkbox.id = 'advantageCheckBox#' + i
        checkbox.onchange = function() {
            Array.from(roptorCache.values())[i].advantage = !Array.from(roptorCache.values())[i].advantage
        }

        
        row.cells[1].appendChild(checkbox)
    }

    var headerRow = table.createTHead().insertRow(0);
    for (let i = 0; i < headers.length; i++) {
        headerRow.insertCell(i).innerHTML = headers[i]
        headerRow.cells[i].className = 'text-center'
    }
    document.getElementById('tableDiv').appendChild(table)
}

function checkDeath(id, index) {
    Array.from(roptorCache.values())[index].health = document.getElementById(id).value
    console.log(document.getElementById(id).value)
    console.log(index)
    if(document.getElementById(id).value == 0) {
        console.log("trigger");
        console.log(roptorCache)
        roptorCache.delete(id)
        console.log(roptorCache)
        attacked = true
    }
    updateTable()
    console.log(roptorCache)
}

function updateTable() {
    if (!isFirstConjure) {
        document.getElementById('conjureTable').remove()
    }
    isFirstConjure = false
    var roptorCacheValuesArray = Array.from(roptorCache.values())

    createTable(roptorCacheValuesArray.length)

    table = document.getElementById('conjureTable')

    console.log('len: ' + roptorCacheValuesArray.length)

    for (let i = 0; i < roptorCacheValuesArray.length; i++) {
        var div = document.createElement('div')
        div.className = "number-input"
        
        var minusButton = document.createElement("BUTTON")
        minusButton.className = 'minus'
        minusButton.onclick = function () {
            this.parentNode.querySelector('input[type=number]').stepDown() 
            checkDeath(roptorCacheValuesArray[i].id, i)
        }
        var plusButton = document.createElement("BUTTON")
        plusButton.className = 'plus'
        plusButton.onclick = function () {
            this.parentNode.querySelector('input[type=number]').stepUp() 
            checkDeath(roptorCacheValuesArray[i].id, i)
        }
        var number = document.createElement("INPUT")
        number.type = 'number'
        number.min = 0
        
        number.value = roptorCacheValuesArray[i].health
        number.id = roptorCacheValuesArray[i].id
        number.onchange = function() {
            checkDeath(roptorCacheValuesArray[i].id,i)
        }
        div.appendChild(minusButton)
        div.appendChild(number)
        div.appendChild(plusButton)

        // console.log($('#conjureTable tr:eq(1) td:eq(1)'))
        // $('#conjureTable tr:eq(' + (i + 1) +') td:eq(0)').append(
        //     `<div class="number-input">
        //     <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus"></button>
        //     <input class="quantity" min="0" name="quantity" value=` + roptorCacheValuesArray[i].health + ` id= ` + roptorCacheValuesArray[i].id + ` type="number">
        //     <button onclick="function() { this.parentNode.querySelector('input[type=number]').stepUp() checkDeath('` + roptorCacheValuesArray[i].id + `', ` + i + `)" class="plus"></button>
        //     </div>`
        // )
        table.rows[i+1].cells[0].appendChild(div)

        // table.rows[i+1].cells[0].appendChild(minusButton)
        // table.rows[i+1].cells[0].appendChild(number)
        // table.rows[i+1].cells[0].appendChild(plusButton)

        table.rows[i+1].cells[0].children[0] = number

    }

    console.log('lennn' + roptorCacheValuesArray.length)
    for(let i = 0; i < roptorCacheValuesArray.length; i++) {
        attackTypeTable = document.createElement('table')
        attackRollTable = document.createElement('table')
        damageTable = document.createElement('table')
        if(attacked) {
            for (const [key, value] of attackCache.get(roptorCacheValuesArray[i].id).entries()) {
                var attackTypeRow = attackTypeTable.insertRow()
                var attackRollRow = attackRollTable.insertRow()
                var damageRow = damageTable.insertRow()
                
                attackTypeRow.insertCell().id = 'attack' + key + i + 0
                attackTypeRow.cells[0].innerHTML = key
    
                attackRollRow.insertCell().id = 'attack' + key + i + 1
                attackRollRow.cells[0].innerHTML = value.get('attackRolls')
    
                damageRow.insertCell().id = 'attack' + key + i + 2
                damageRow.cells[0].innerHTML = value.get('damage')
                
            }
    
            document.getElementById("attackType#"+i).appendChild(attackTypeTable);
            document.getElementById("attackRoll#"+i).appendChild(attackRollTable);
            document.getElementById("damage#"+i).appendChild(damageTable);
        }
    } 
    console.log(roptorCache)
}