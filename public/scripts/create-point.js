function populateUFs() {
    const ufSelect = document.querySelector('select[name=uf]')

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then( (res) => { return res.json()})
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }

        
    } )
}


function getCities(event) {
    const citySelect = document.querySelector('[name=city]')
    const stateInput = document.querySelector('[name=state]')

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( (res) => { return res.json()})
    .then( cities => {

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
        
    } )
}

const collectedItens = document.querySelector("input[name=itens]")

let selectedItens = []


function handleSelectedItem(event) {
    const itemLi = event.target

    // Adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // Verificar se existem ítens selecionados, se sim
    // Pegar os itens selecionados

    const alreadySelected = selectedItens.findIndex( function( item) {
        const itemFound = item == itemId // Isso será true ou false
        return itemFound
    }) 

    // Se já estiver selecionado, tirar da seleção
    if(alreadySelected >= 0) {
        // Tirar da seleção
        const filteredItens = selectedItens.filter( item => {
            const itemIsDifferent = item != itemId // false
            return itemIsDifferent
        })

        selectedItens = filteredItens
    }else {
        // Se não estiver selecionado, adicionar a seleção
        selectedItens.push(itemId)
    }

    // Atualizar o campo escondido com os ítens selecionados
    collectedItens.value = selectedItens

}


populateUFs()

document
    .querySelector('select[name=uf]')
    .addEventListener('change', getCities)

//Ítens de coleta
//Pegar todos os li´s

const itensToCollect = document.querySelectorAll(".itens-grid li")

for (const item of itensToCollect) {
    item.addEventListener("click", handleSelectedItem)
}
