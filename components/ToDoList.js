import { cloneTemplate, createElement } from "../function/dom.js"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */

export class TodoList {
    /**
     * @type {Todo[]} */
    #todos = []

    /**
     * @type {HTMLUListElement[]} */
    #listElement = []

    /**@param {Todo[]} todos */
    constructor (todos) {
        this.#todos = todos
    }

    /**
     * @param {HTMLElement} element 
     */
    appendTo (element) {
        element.append(
            cloneTemplate('todolist-layout')
        )
    this.#listElement = element.querySelector('.list-group')
    for (let todo of this.#todos) {
        const t = new TodoListItem(todo)
        this.#listElement.append(t.element)
    }
    element.querySelector('form').addEventListener('submit', event => this.#onSubmit(event))
    element.querySelectorAll('.btn-group button').forEach(button => {
        button.addEventListener('click', event => this.#toggleFilter(event))
    })
    }

    /**
     * @param {SubmitEvent} event 
     */
    #onSubmit (event) {
        event.preventDefault()
        const form = event.currentTarget
        const title = new FormData(event.currentTarget).get('title').toString().trim()
        if (title === '') {
            return
        }
        const todo = {
            id: Date.now(),
            title,
            completed: false
        }
        const item = new TodoListItem(todo)
        this.#listElement.prepend(item.element)
        form.reset()
    }

    /**
     * @param {PointerEvent} event 
     */
    #toggleFilter (event) {
        event.preventDefault()
        const filter = event.currentTarget.getAttribute('data-filter')
        event.currentTarget.parentElement.querySelector('.active').classList.remove('active')
        event.currentTarget.classList.add('active')
        if (filter === 'todo') {
            this.#listElement.classList.add('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        } else if (filter === 'done') {
            this.#listElement.classList.add('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        } else {
            this.#listElement.classList.remove('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        }

    }
}

class TodoListItem {

    #element

    /**@type {Todo} */
    constructor(todo) {
       const id = `todo-${todo.id}`
       const li = cloneTemplate('todolist-item').firstElementChild
        this.#element = li
        const checkbox = li.querySelector('input')
        checkbox.setAttribute('id', id)
        if (todo.completed) {
            checkbox.setAttribute('checked', '')
        }
        const label = li.querySelector('label')
        label.setAttribute('for', id)
        label.innerText = todo.title
        const button = li.querySelector('button')
        this.toggle(checkbox)

        button.addEventListener('click', event => this.remove(event))
        checkbox.addEventListener('change', event => this.toggle(event.currentTarget))
        
        
        this.#element = li
    }
    /**
     * @return {HTMLElement} 
     */
    get element () {
        return this.#element
    }
    /**
     * @param {PointerEvent} event 
     */
    remove (event) {
        event.preventDefault()
        this.#element.remove()
    }
    /**
     * Change l'etat (a faire / fait) de la tache
     * 
     * @param {HTMLInputElement} checkbox 
     */
    toggle (checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add('is-completed')
        } else {
            this.#element.classList.remove('is-completed')
        }
    }
}