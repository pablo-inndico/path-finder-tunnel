const urls = {
  'tipo-evento': '/data/events.json',
  'personas-lastimadas': '/data/person.json',
  'sentido-circulacion': '/data/sentido.json',
  'carriles-bloqueados': '/data/carril.json',
  'retorno-inhabilitado': '/data/return.json'
};

const selectors = ['tipo-evento', 'personas-lastimadas', 'sentido-circulacion', 'carriles-bloqueados', 'retorno-inhabilitado'];

selectors.forEach(selector => {
  fetch(urls[selector])
      .then(response => response.json())
      .then(data => {
          if (selector === 'retorno-inhabilitado') {
              populateDropdown(data);
          } else {
              populateSelect(selector, data);
          }
          restoreSelection(selector);
      });
});

function populateSelect(id, data) {
  const select = document.getElementById(id);
  data.forEach(item => {
      const option = document.createElement('option');
      option.value = item._id;
      option.textContent = item.name;
      select.appendChild(option);
  });

  select.addEventListener('change', () => {
      saveSelection(id);
  });
}

function populateDropdown(data) {
  const dropdown = document.getElementById('dropdown');
  data.forEach(item => {
      const div = document.createElement('div');
      div.dataset.value = item._id;
      div.textContent = item.name;
      dropdown.appendChild(div);
  });

  dropdown.addEventListener('click', (event) => {
      if (event.target.dataset.value) {
          addChip(event.target.dataset.value, event.target.textContent);
          saveSelection('retorno-inhabilitado');
          document.getElementById('chip-input').value = '';
          dropdown.style.display = 'none';
      }
  });
}

function addChip(value, text) {
  const chipContainer = document.getElementById('chip-container');
  const existingChip = chipContainer.querySelector(`.chip[data-value="${value}"]`);
  if (!existingChip) {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.dataset.value = value;
      chip.textContent = text;
      chipContainer.insertBefore(chip, chipContainer.querySelector('input'));
      chip.addEventListener('click', () => {
          chipContainer.removeChild(chip);
          saveSelection('retorno-inhabilitado');
      });
      updateHiddenInput();
  }
}

function updateHiddenInput() {
  const chipContainer = document.getElementById('chip-container');
  const selectedValues = Array.from(chipContainer.querySelectorAll('.chip')).map(chip => chip.dataset.value);
  document.getElementById('retorno-inhabilitado').value = JSON.stringify(selectedValues);
}

function saveSelection(id) {
  const selectedValues = id === 'retorno-inhabilitado'
      ? JSON.parse(document.getElementById(id).value)
      : Array.from(document.getElementById(id).selectedOptions).map(option => option.value);
  localStorage.setItem(id, JSON.stringify(selectedValues));
}

function restoreSelection(id) {
  const savedValues = JSON.parse(localStorage.getItem(id));
  if (savedValues) {
      if (id === 'retorno-inhabilitado') {
          savedValues.forEach(value => {
              const dropdown = document.getElementById('dropdown');
              const option = dropdown.querySelector(`div[data-value="${value}"]`);
              if (option) {
                  addChip(option.dataset.value, option.textContent);
              }
          });
      } else {
          const select = document.getElementById(id);
          Array.from(select.options).forEach(option => {
              option.selected = savedValues.includes(option.value);
          });
      }
  }
}

document.getElementById('chip-input').addEventListener('focus', () => {
  document.getElementById('dropdown').style.display = 'block';
});

document.addEventListener('click', (event) => {
  if (!document.getElementById('chip-container').contains(event.target)) {
      document.getElementById('dropdown').style.display = 'none';
  }
});