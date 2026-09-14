// 1. Configuração do Drag & Drop com SortableJS
const taskColumns = ['tasks--todo', 'tasks--doing', 'tasks--done'];

taskColumns.forEach((columnId) => {
  const columnElement = document.getElementById(columnId);

  if (columnElement) {
    new Sortable(columnElement, {
      group: 'kanban-board',
      animation: 150,
      fallbackOnBody: true,
      chosenClass: 'task--chosen',
      dragClass: 'task--drag'
    });
  }
});

// 2. Lógica para Adicionar Nova Tarefa
document.querySelectorAll('.add-task-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const columnId = button.getAttribute('data-column');
    addTaskToColumn(columnId);
  });
});

function addTaskToColumn(columnId) {
  const columnContainer = document.getElementById(columnId);
  if (!columnContainer) return;

  const taskTitle = prompt('Digite o título da nova tarefa:');
  if (!taskTitle || taskTitle.trim() === '') return;

  const taskArticle = document.createElement('article');
  taskArticle.className = 'task';

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  taskArticle.innerHTML = `
    <header>
      <h3>${escapeHtml(taskTitle.trim())}</h3>
      <div class="task-actions">
        <button type="button" class="btn-edit" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button type="button" class="btn-delete" title="Excluir">&times;</button>
      </div>
    </header>
    <div class="tags">
      <div class="tag" style="background-color: var(--violet);">Nova</div>
      <button type="button" class="btn-add-tag" title="Adicionar Tag">+</button>
    </div>
    <footer>
      <div class="profile profile--jm">
        <img src="https://i.pravatar.cc/100?img=12" alt="Perfil">
      </div>
      <span class="task-date" title="Clique para editar a data">Today - ${today}</span>
    </footer>
  `;

  columnContainer.appendChild(taskArticle);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 3. Delegação de Eventos (Tarefas, Tags e Datas)
const columnsContainer = document.querySelector('.columns');

if (columnsContainer) {
  columnsContainer.addEventListener('click', (e) => {
    const target = e.target;

    // --- AÇÃO: EXCLUIR TAREFA ---
    if (target.classList.contains('btn-delete') || target.closest('.btn-delete')) {
      const taskArticle = target.closest('.task');
      if (taskArticle) taskArticle.remove();
      return;
    }

    // --- AÇÃO: EDITAR TÍTULO DA TAREFA ---
    if (target.classList.contains('btn-edit') || target.closest('.btn-edit')) {
      const taskArticle = target.closest('.task');
      if (taskArticle) {
        const titleElement = taskArticle.querySelector('h3');
        const currentTitle = titleElement ? titleElement.textContent : '';
        const newTitle = prompt('Edite o título da tarefa:', currentTitle);
        if (newTitle !== null && newTitle.trim() !== '') {
          titleElement.textContent = newTitle.trim();
        }
      }
      return;
    }

    // --- AÇÃO: ADICIONAR NOVA TAG ---
    if (target.classList.contains('btn-add-tag') || target.closest('.btn-add-tag')) {
      const tagsContainer = target.closest('.tags');
      const tagName = prompt('Digite o nome da nova tag:');
      if (!tagName || tagName.trim() === '') return;

      const tagColor = prompt('Digite a cor da tag (ex: #a278e6, #ffa94d, green, purple):', '#a278e6');

      const newTag = document.createElement('div');
      newTag.className = 'tag';
      newTag.textContent = tagName.trim();
      if (tagColor && tagColor.trim() !== '') {
        newTag.style.backgroundColor = tagColor.trim();
      }

      tagsContainer.insertBefore(newTag, target.closest('.btn-add-tag'));
      return;
    }

    // --- AÇÃO: EDITAR OU REMOVER TAG EXISTENTE ---
    if (target.classList.contains('tag')) {
      const currentText = target.textContent.trim();
      const newText = prompt('Edite o nome da tag (ou deixe em branco para apagar):', currentText);

      if (newText === null) return;

      if (newText.trim() === '') {
        target.remove();
        return;
      }

      target.textContent = newText.trim();

      const newColor = prompt(
        'Digite uma nova cor para a tag (ex: #ff5e94, #4be0bb, purple, orange) ou clique OK para manter:',
        ''
      );

      if (newColor && newColor.trim() !== '') {
        target.style.backgroundColor = newColor.trim();
      }
      return;
    }

    // --- AÇÃO: EDITAR DATA DA TAREFA ---
    if (target.classList.contains('task-date')) {
      const currentDate = target.textContent.trim();
      const newDate = prompt('Edite a data da tarefa:', currentDate);

      if (newDate !== null && newDate.trim() !== '') {
        target.textContent = newDate.trim();
      }
    }
  });
}