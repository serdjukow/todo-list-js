"use strict"

document.addEventListener("DOMContentLoaded", () => {
  const getTodos = () => JSON.parse(sessionStorage.getItem("todos")) || []

  const todoList = document.querySelector(".todo-list")
  const newTodo = document.querySelector(".new-todo")
  const todoCount = document.querySelector(".todo-count strong")
  const filterLinks = document.querySelectorAll(".filters a")

  const updateTodoCount = () => {
    const todos = getTodos()
    const incompleteTodos = todos.filter((todo) => !todo.completed)
    todoCount.innerText = incompleteTodos.length
  }

  const todoItemToHtml = (todo) => `
    <li data-id="${todo.id}" ${todo.completed && "class='completed'"} >
        <div class="view">
            <input 
                id=${todo.id} 
                class="toggle" 
                type="checkbox" 
                ${todo.completed && "checked"}
            />
            <label for=${todo.id}>${todo.value}</label>
            <button class="destroy"></button>
        </div>
        <input class="edit" value="${todo.value}" />
    </li>
  `

  const renderTodos = (todos) => {
    todoList.innerHTML = ""
    todos.forEach((todo) => {
      todoList.insertAdjacentHTML("afterbegin", todoItemToHtml(todo))
    })
    updateTodoCount()
    updateClearCompletedButton()
  }

  const saveTodos = (todos) => {
    sessionStorage.setItem("todos", JSON.stringify(todos))
    updateClearCompletedButton()
  }

  const removeCompletedTodos = () => {
    const todos = getTodos()
    const remainingTodos = todos.filter((todo) => !todo.completed)
    saveTodos(remainingTodos)
    renderTodos(remainingTodos)
  }

  const toggleAllTodosCompletion = () => {
    const todos = getTodos()
    const allCompleted = todos.every((todo) => todo.completed)
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }))

    saveTodos(updatedTodos)
    renderTodos(updatedTodos)
  }

  const updateClearCompletedButton = () => {
    const todos = getTodos()
    const clearCompletedButton = document.querySelector(".clear-completed")
    const hasCompletedTodos = todos.some((todo) => todo.completed)

    if (hasCompletedTodos) {
      clearCompletedButton.style.display = "inline-block"
    } else {
      clearCompletedButton.style.display = "none"
    }
  }

  const filterTodos = (filter) => {
    const todos = getTodos()
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed)
    } else if (filter === "completed") {
      return todos.filter((todo) => todo.completed)
    }
    return todos
  }

  const updateFilterSelection = () => {
    const currentFilter = getCurrentFilter()
    filterLinks.forEach((link) => {
      if (link.getAttribute("href") === `#/${currentFilter}`) {
        link.classList.add("selected")
      } else {
        link.classList.remove("selected")
      }
    })
  }

  const getCurrentFilter = () => {
    const hash = window.location.hash
    if (hash === "#/active") {
      return "active"
    } else if (hash === "#/completed") {
      return "completed"
    }
    return "all"
  }

  const applyFilter = () => {
    const currentFilter = getCurrentFilter()
    updateFilterSelection()
    const filteredTodos = filterTodos(currentFilter)
    renderTodos(filteredTodos)
  }

  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault()
      const filter = link.getAttribute("href").substring(2)
      window.location.hash = `#/${filter}`
      applyFilter()
    })
  })

 
  window.addEventListener("hashchange", applyFilter)
  applyFilter() 
  updateTodoCount()

  newTodo.addEventListener("keypress", (event) => {
    if (event.keyCode === 13 && event.target.value.trim() !== "") {
      const todos = getTodos()
      const newTodo = {
        id: uuid.v4(),
        value: event.target.value,
        completed: false,
      }
      todos.push(newTodo)
      saveTodos(todos)
      applyFilter()
      event.target.value = ""
    }
  })

  document.addEventListener("click", (event) => {
    const todos = getTodos()
    const toggle = event.target.closest(".toggle")
    if (toggle) {
      const li = toggle.closest("li")
      const todoId = li.getAttribute("data-id")
      const todo = todos.find((todo) => todo.id === todoId)
      if (todo) {
        todo.completed = toggle.checked
        saveTodos(todos)
        applyFilter()
      }
    }

    const destroyButton = event.target.closest(".destroy")
    if (destroyButton) {
      const li = destroyButton.closest("li")
      const todoId = li.getAttribute("data-id")
      const todoIndex = todos.findIndex((todo) => todo.id === todoId)
      if (todoIndex !== -1) {
        todos.splice(todoIndex, 1)
        saveTodos(todos)
        applyFilter()
      }
    }

    const clearСompletedButton = event.target.closest(".clear-completed")
    if (clearСompletedButton) {
      removeCompletedTodos()
    }

    const toggleAllButton = event.target.closest(".toggle-all")
    if (toggleAllButton) {
      toggleAllTodosCompletion()
    }
  })
})
