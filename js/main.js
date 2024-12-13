"use strict"

//------------------------------------------------------------------------progress-bar
  document.addEventListener('DOMContentLoaded', () => {
    // Находим все элементы с классом "progress-bar"
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
      // Получаем значение процента из атрибута data-percent
      const percent = bar.getAttribute('data-percent');
      // Устанавливаем ширину для внутреннего заполнения
      const fill = bar.querySelector('.progress-bar__fill');
      fill.style.width = percent + '%';
    });
  });
//------------------------------------------------------------------------progress-bar

//------------------------------------------------------------------------select выпадающий список
document.querySelectorAll('.dropdown').forEach(function(dropDownWrapper) {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list_item');
  const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');
  const dropDownBtnText = dropDownBtn.querySelector('.dropdown__button_text');
  const dropDownBtnArrow = dropDownBtn.querySelector('.dropdown__button_arrow');  // Стрелка

  // Функция для закрытия текущего дропдауна
  function closeCurrentDropdown() {
    dropDownList.classList.remove('dropdown__list--active');
    dropDownBtn.classList.remove('dropdown__button--active');
  }

  // Открыть/закрыть текущий дропдаун
  dropDownBtn.addEventListener('click', function (e) {
    e.stopPropagation(); // Остановить всплытие события
    e.preventDefault(); // Предотвращаем отправку формы
    const isActive = dropDownList.classList.contains('dropdown__list--active');

    // Закрываем все дропдауны перед открытием текущего
    document.querySelectorAll('.dropdown__list--active').forEach(function(activeList) {
      activeList.classList.remove('dropdown__list--active');
    });
    document.querySelectorAll('.dropdown__button--active').forEach(function(activeButton) {
      activeButton.classList.remove('dropdown__button--active');
    });

    // Если текущий дропдаун не был активным, открываем его
    if (!isActive) {
      dropDownList.classList.add('dropdown__list--active');
      dropDownBtn.classList.add('dropdown__button--active');
    }
  });

  // Выбор элемента списка
  dropDownListItems.forEach(function (listItem) {
    listItem.addEventListener('click', function (e) {
      e.stopPropagation(); // Остановить всплытие события
      e.preventDefault(); // Предотвращаем отправку формы

      // Удаляем класс selected со всех элементов
      dropDownListItems.forEach(function (item) {
        item.classList.remove('selected');
      });

      // Добавляем класс selected к текущему элементу
      this.classList.add('selected');

      // Обновляем текст кнопки и скрытый input
      dropDownBtnText.innerText = this.innerText;
      dropDownInput.value = this.dataset.value;

      // Стрелочка остаётся видимой
      closeCurrentDropdown();
    });
  });

  // Закрытие при клике снаружи
  document.addEventListener('click', function (e) {
    if (!dropDownWrapper.contains(e.target)) {
      closeCurrentDropdown(); // Закрываем только текущий дропдаун
    }
  });

  // Закрытие при нажатии Tab или Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Escape') {
      closeCurrentDropdown(); // Закрываем только текущий дропдаун
    }
  });
});

//------------------------------------------------------------------------select выпадающий список

//------------------------------------------------------------------------ответы в коментариях
// Утилита для добавления обработчиков событий
const addToggleEvent = (triggerElements, targetElements, toggleClass = 'view') => {
  triggerElements.forEach((trigger, index) => {
      const target = targetElements[index];
      if (target) {
          trigger.addEventListener('click', () => {
              target.classList.toggle(toggleClass);
          });
      }
  });
};
// Управление показом/скрытием для двух состояний
const addShowHideHandlers = (showElements, hideElements, targetElements, toggleClass = 'view', hideClass = 'hide') => {
  if (showElements.length === hideElements.length && showElements.length === targetElements.length) {
      showElements.forEach((showElement, index) => {
          const hideElement = hideElements[index];
          const targetElement = targetElements[index];

          showElement.addEventListener('click', () => {
              targetElement.classList.add(toggleClass);
              showElement.classList.add(hideClass);
              hideElement.classList.remove(hideClass);
          });

          hideElement.addEventListener('click', () => {
              targetElement.classList.remove(toggleClass);
              showElement.classList.remove(hideClass);
              hideElement.classList.add(hideClass);
          });
      });
  }
};
// Основная логика
const feedbackAnswers = document.querySelectorAll('.feedback__answer');
const replies = document.querySelectorAll('.reply');
const feedbackAnswersUnder = document.querySelectorAll('.feedback__answer_under');
const replyUnder = document.querySelectorAll('.reply-under');
const feedbackShows = document.querySelectorAll('.feedback__show');
const feedbackHides = document.querySelectorAll('.feedback__hide');
const answers = document.querySelectorAll('.answer');

// Добавление событий для переключения классов
addToggleEvent(feedbackAnswers, replies);
addToggleEvent(feedbackAnswersUnder, replyUnder);

// Добавление событий для управления показом и скрытием ответов
addShowHideHandlers(feedbackShows, feedbackHides, answers);

//------------------------------------------------------------------------ответы в коментариях

//------------------------------------------------------------------------фильтрация в поиске
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.search__input');
  const searchList = document.querySelector('.search__list');
  const compareItems = document.querySelector('.compare__items');
  const searchClose = document.querySelector('.search__close');

  // Проверка, есть ли на странице все необходимые элементы
  if (input && searchList && compareItems) {
    const listItems = Array.from(searchList.querySelectorAll('li'));

    // Открытие списка при фокусе на инпуте
    input.addEventListener('focus', () => {
      searchList.style.display = 'block';
    });

    // Закрытие списка при клике вне его
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.search')) {
        searchList.style.display = 'none';
      }
    });

    // Фильтрация списка при вводе текста
    input.addEventListener('input', () => {
      const filterText = input.value.toLowerCase();
      listItems.forEach((item) => {
        const itemText = item.textContent.toLowerCase();
        item.style.display = itemText.includes(filterText) ? 'flex' : 'none';
      });
    });

    // Добавление элемента в compare__items при клике
    searchList.addEventListener('click', (event) => {
      const clickedElement = event.target.closest('li');
      if (clickedElement) {
        // Извлечение данных элемента
        const textOnly = clickedElement.textContent.trim(); // Текст элемента
        const dataAttributes = Array.from(clickedElement.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {});

        // Создание нового элемента и добавление данных
        const newItem = document.createElement('div');
        newItem.classList.add('search__item');
        
        const itemText = document.createElement('span');
        itemText.textContent = textOnly;
        newItem.appendChild(itemText);

        // Добавление кнопки удаления
        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => {
          newItem.remove(); // Удаление элемента из compare__items
        });
        newItem.appendChild(removeButton);

        Object.entries(dataAttributes).forEach(([key, value]) => {
          newItem.setAttribute(key, value);
        });
        compareItems.appendChild(newItem);

        // Сделать элемент search__close видимым
        if (searchClose) {
          searchClose.style.display = 'flex';
        }

        input.value = ''; // Очистить поле ввода
        listItems.forEach((item) => (item.style.display = 'flex')); // Сброс фильтрации
        searchList.style.display = 'none'; // Скрыть список
      }
    });
  }
});

//------------------------------------------------------------------------фильтрация в поиске