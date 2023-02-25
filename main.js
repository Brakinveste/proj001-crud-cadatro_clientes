

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

// CRUD - DELETE

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

// CRUD - UPDATE

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// CRUD - READ

const readClient = () => getLocalStorage()

//CRUD - CREATE

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}   

const isValidFilds = () => {
    return document.querySelector('#form').reportValidity()
}

// INTERAÇÃO COM USUÁRIO

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if (isValidFilds()) {
        const client = {
            nome: document.getElementById("nome").value,
            email: document.querySelector("#email").value,
            celular: document.querySelector("#fone").value,
            cidade: document.querySelector("#cidade").value
        }
        const index = document.querySelector('#nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()

        } 
    }
}    

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}" >editar</button>
            <button type="button" class="button red" id="delete-${index}" >excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)

}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}


const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome
    document.querySelector('#email').value = client.email
    document.querySelector('#fone').value = client.celular
    document.querySelector('#cidade').value = client.cidade

    document.querySelector('#nome').dataset.index = client.index
}

const editClient = (index) => {
    
    const client = readClient()[index]
    client.index = index
    
    fillFields(client)
    openModal()
    
}

const editDelete = (event) => {
   
    if(event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
            } else {
            const client = readClient()[index]
            const response = confirm(`Confirma a exclusão de ${client.nome} ?`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// eventos    

document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('cancelar').addEventListener('click', closeModal)

document.querySelector('#salvar').addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);



// mascara do fone

function handlePhone(event)  {
    let input = event.target
    input.value = phoneMask(input.value)
    console.log(input.value)
  }
  
  function phoneMask(value) {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
  }