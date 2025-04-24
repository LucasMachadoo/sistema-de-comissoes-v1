// Constantes para regras de comissão
const COMMISSION_RULES = {
    "Rede Ideia": 5.0,
    Gabrieli: 20.0,
  }
  
  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    // Configurar data atual
    setCurrentDate()
  
    // Carregar usuário atual
    loadCurrentUser()
  
    // Carregar dados salvos
    loadData()
  
    // Configurar eventos
    setupEventListeners()
  
    // Atualizar comissão quando AR mudar
    document.getElementById("ar").addEventListener("change", updateCommission)
  
    // Validação para o campo de protocolo (somente números)
    document.getElementById("protocol").addEventListener("input", function (e) {
      const feedback = this.nextElementSibling
      this.value = this.value.replace(/[^0-9]/g, "")
  
      if (this.value === "") {
        feedback.textContent = "Este campo é obrigatório"
      } else if (!/^\d+$/.test(this.value)) {
        feedback.textContent = "Somente números são permitidos"
      } else {
        feedback.textContent = ""
      }
    })
  
    // Definir data atual no campo de data
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("date").value = today
  
    // Inicializar tema
    initTheme()
  })
  
  // Configurar todos os event listeners
  function setupEventListeners() {
    // Navegação
    document.getElementById("nav-new-record").addEventListener("click", (e) => {
      e.preventDefault()
      toggleSection("section-form")
    })
  
    document.getElementById("nav-search").addEventListener("click", (e) => {
      e.preventDefault()
      toggleSection("section-search")
    })
  
    document.getElementById("nav-export").addEventListener("click", (e) => {
      e.preventDefault()
      exportToTxt()
    })
  
    // Fechar seções
    document.getElementById("close-form").addEventListener("click", () => {
      document.getElementById("section-form").style.display = "none"
    })
  
    document.getElementById("close-search").addEventListener("click", () => {
      document.getElementById("section-search").style.display = "none"
    })
  
    // Toggle resumo detalhado
    document.getElementById("toggle-summary").addEventListener("click", function () {
      const summarySection = document.getElementById("summary-section")
      const summaryBody = summarySection.querySelector(".card-body")
      const icon = this.querySelector("i")
  
      if (summaryBody.style.display === "none") {
        summaryBody.style.display = "block"
        icon.className = "fas fa-chevron-up"
      } else {
        summaryBody.style.display = "none"
        icon.className = "fas fa-chevron-down"
      }
    })
  
    // Form de registro
    document.getElementById("record-form").addEventListener("submit", saveRecord)
  
    // Busca
    document.getElementById("search-btn").addEventListener("click", searchRecords)
    document.getElementById("clear-search-btn").addEventListener("click", clearSearch)
  
    // Exportar
    document.getElementById("export-btn").addEventListener("click", exportToTxt)
  
    // Modal de usuário
    document.getElementById("change-user-btn").addEventListener("click", openUserModal)
    document.querySelector(".close").addEventListener("click", closeUserModal)
    document.getElementById("save-user-btn").addEventListener("click", saveUser)
  
    // Modal de confirmação
    document.querySelector(".close-confirm").addEventListener("click", closeConfirmModal)
    document.getElementById("confirm-no").addEventListener("click", closeConfirmModal)
  
    // Menu móvel
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
    const sidebar = document.querySelector(".sidebar")
  
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  
    // Fechar sidebar ao clicar em um item do menu em telas pequenas
    document.querySelectorAll(".sidebar-nav a").forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active")
        }
      })
    })
  
    // Fechar modal ao clicar fora
    window.addEventListener("click", (event) => {
      const userModal = document.getElementById("user-modal")
      const confirmModal = document.getElementById("confirm-modal")
  
      if (event.target === userModal) {
        closeUserModal()
      }
  
      if (event.target === confirmModal) {
        closeConfirmModal()
      }
  
      // Fechar sidebar ao clicar fora dela em telas pequenas
      if (window.innerWidth <= 768 && !event.target.closest(".sidebar") && !event.target.closest("#mobile-menu-toggle")) {
        sidebar.classList.remove("active")
      }
    })
  
    // Tema
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme)
  }
  
  // Mostrar/esconder seções
  function toggleSection(sectionId) {
    const section = document.getElementById(sectionId)
    const isVisible = section.style.display === "block"
  
    // Esconder todas as seções
    document.getElementById("section-form").style.display = "none"
    document.getElementById("section-search").style.display = "none"
  
    // Mostrar a seção selecionada se não estiver visível
    if (!isVisible) {
      section.style.display = "block"
    }
  }
  
  // Definir data atual
  function setCurrentDate() {
    const dateElement = document.getElementById("current-date")
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    dateElement.textContent = new Date().toLocaleDateString("pt-BR", options)
  }
  
  // Atualizar campo de comissão com base no AR selecionado
  function updateCommission() {
    const arSelect = document.getElementById("ar")
    const commissionInput = document.getElementById("commission")
  
    if (arSelect.value) {
      const commission = COMMISSION_RULES[arSelect.value]
      commissionInput.value = `R$ ${commission.toFixed(2)}`
    } else {
      commissionInput.value = ""
    }
  }
  
  // Salvar um novo registro
  function saveRecord(e) {
    e.preventDefault()
  
    const protocol = document.getElementById("protocol").value
    const date = document.getElementById("date").value
    const ar = document.getElementById("ar").value
  
    // Validação
    if (!protocol || !date || !ar) {
      showToast("Por favor, preencha todos os campos obrigatórios.", "error")
      return
    }
  
    if (!/^\d+$/.test(protocol)) {
      showToast("O protocolo deve conter apenas números.", "error")
      return
    }
  
    // Calcular comissão
    const commission = COMMISSION_RULES[ar]
  
    // Criar novo registro
    const record = {
      id: Date.now(), // ID único baseado no timestamp
      protocol,
      date,
      ar,
      commission,
    }
  
    // Obter registros existentes
    const records = JSON.parse(localStorage.getItem("records") || "[]")
  
    // Adicionar novo registro
    records.push(record)
  
    // Salvar no localStorage
    localStorage.setItem("records", JSON.stringify(records))
  
    // Limpar formulário
    document.getElementById("record-form").reset()
    document.getElementById("commission").value = ""
  
    // Definir data atual no campo de data
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("date").value = today
  
    // Recarregar dados
    loadData()
  
    // Esconder formulário
    document.getElementById("section-form").style.display = "none"
  
    showToast("Registro salvo com sucesso!", "success")
  }
  
  // Carregar dados do localStorage e exibir na tabela
  function loadData() {
    const records = JSON.parse(localStorage.getItem("records") || "[]")
    displayRecords(records)
    updateSummary(records)
    updateDashboardSummary(records)
  }
  
  // Exibir registros na tabela
  function displayRecords(records) {
    const tableBody = document.getElementById("data-body")
    tableBody.innerHTML = ""
  
    if (records.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum registro encontrado</td></tr>'
      return
    }
  
    // Ordenar registros por data (mais recente primeiro)
    records.sort((a, b) => new Date(b.date) - new Date(a.date))
  
    // Agrupar por data
    const groupedByDate = {}
    records.forEach((record) => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = []
      }
      groupedByDate[record.date].push(record)
    })
  
    // Exibir registros agrupados por data
    Object.keys(groupedByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const dateRecords = groupedByDate[date]
        const totalCommission = dateRecords.reduce((sum, record) => sum + record.commission, 0)
  
        // Adicionar cabeçalho da data
        const dateHeader = document.createElement("tr")
        dateHeader.style.backgroundColor = "rgba(67, 97, 238, 0.05)"
        dateHeader.innerHTML = `
        <td colspan="3" style="font-weight: 600;">
          <i class="fas fa-calendar-day"></i> ${formatDate(date)}
        </td>
        <td style="font-weight: 600;">R$ ${totalCommission.toFixed(2)}</td>
        <td>${dateRecords.length} registro(s)</td>
      `
        tableBody.appendChild(dateHeader)
  
        // Adicionar registros da data
        dateRecords.forEach((record) => {
          const row = document.createElement("tr")
          row.innerHTML = `
          <td>${record.protocol}</td>
          <td>${formatDate(record.date)}</td>
          <td>${record.ar}</td>
          <td>R$ ${record.commission.toFixed(2)}</td>
          <td class="action-buttons">
            <button class="action-btn btn-duplicate" onclick="duplicateRecord(${record.id})">
              <i class="fas fa-copy"></i> Duplicar
            </button>
            <button class="action-btn btn-delete" onclick="confirmDelete(${record.id})">
              <i class="fas fa-trash-alt"></i> Excluir
            </button>
          </td>
        `
          tableBody.appendChild(row)
        })
      })
  }
  
  // Atualizar resumo de comissões
  function updateSummary(records) {
    const summaryContainer = document.getElementById("summary-data")
    summaryContainer.innerHTML = ""
  
    if (records.length === 0) {
      summaryContainer.innerHTML = "<p class='text-center'>Nenhum dado disponível</p>"
      return
    }
  
    // Agrupar por data
    const groupedByDate = {}
    records.forEach((record) => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = []
      }
      groupedByDate[record.date].push(record)
    })
  
    // Agrupar por mês
    const groupedByMonth = {}
    records.forEach((record) => {
      const month = record.date.substring(0, 7) // YYYY-MM
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = []
      }
      groupedByMonth[month].push(record)
    })
  
    // Criar resumo mensal primeiro
    Object.keys(groupedByMonth)
      .sort((a, b) => b.localeCompare(a))
      .forEach((month) => {
        const monthlyRecords = groupedByMonth[month]
        const totalCommission = monthlyRecords.reduce((sum, record) => sum + record.commission, 0)
  
        const monthName = new Date(month + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  
        const summaryItem = document.createElement("div")
        summaryItem.className = "summary-item month-summary"
        summaryItem.innerHTML = `
          <h4><i class="fas fa-calendar-alt"></i> ${monthName}</h4>
          <p>R$ ${totalCommission.toFixed(2)}</p>
          <small>${monthlyRecords.length} registro(s)</small>
        `
  
        summaryContainer.appendChild(summaryItem)
      })
  
    // Criar resumo por data
    Object.keys(groupedByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const dailyRecords = groupedByDate[date]
        const totalCommission = dailyRecords.reduce((sum, record) => sum + record.commission, 0)
  
        const summaryItem = document.createElement("div")
        summaryItem.className = "summary-item"
        summaryItem.innerHTML = `
          <h4><i class="fas fa-calendar-day"></i> ${formatDate(date)}</h4>
          <p>R$ ${totalCommission.toFixed(2)}</p>
          <small>${dailyRecords.length} registro(s)</small>
        `
  
        summaryContainer.appendChild(summaryItem)
      })
  }
  
  // Atualizar resumo do dashboard
  function updateDashboardSummary(records) {
    // Total de hoje
    const today = new Date().toISOString().split("T")[0]
    const todayRecords = records.filter((record) => record.date === today)
    const todayTotal = todayRecords.reduce((sum, record) => sum + record.commission, 0)
    document.getElementById("today-total").textContent = `R$ ${todayTotal.toFixed(2)}`
  
    // Total do mês
    const currentMonth = today.substring(0, 7) // YYYY-MM
    const monthRecords = records.filter((record) => record.date.startsWith(currentMonth))
    const monthTotal = monthRecords.reduce((sum, record) => sum + record.commission, 0)
    document.getElementById("month-total").textContent = `R$ ${monthTotal.toFixed(2)}`
  
    // Total de registros
    document.getElementById("records-count").textContent = records.length
  
    // Total geral
    const totalAll = records.reduce((sum, record) => sum + record.commission, 0)
    document.getElementById("total-all").textContent = `R$ ${totalAll.toFixed(2)}`
  }
  
  // Buscar registros por período
  function searchRecords() {
    const startDate = document.getElementById("start-date").value
    const endDate = document.getElementById("end-date").value
  
    if (!startDate && !endDate) {
      showToast("Por favor, informe pelo menos uma data para busca.", "info")
      return
    }
  
    let records = JSON.parse(localStorage.getItem("records") || "[]")
  
    if (startDate) {
      records = records.filter((record) => record.date >= startDate)
    }
  
    if (endDate) {
      records = records.filter((record) => record.date <= endDate)
    }
  
    displayRecords(records)
    updateSummary(records)
  
    // Esconder seção de busca
    document.getElementById("section-search").style.display = "none"
  
    showToast(`Encontrado(s) ${records.length} registro(s) no período.`, "info")
  }
  
  // Limpar busca e mostrar todos os registros
  function clearSearch() {
    document.getElementById("start-date").value = ""
    document.getElementById("end-date").value = ""
    loadData()
    showToast("Busca limpa. Exibindo todos os registros.", "info")
  }
  
  // Confirmar exclusão
  function confirmDelete(id) {
    const confirmModal = document.getElementById("confirm-modal")
    const confirmMessage = document.getElementById("confirm-message")
    const confirmYes = document.getElementById("confirm-yes")
  
    confirmMessage.textContent = "Tem certeza que deseja excluir este registro?"
    confirmModal.style.display = "block"
  
    // Remover event listener anterior se existir
    const newConfirmYes = confirmYes.cloneNode(true)
    confirmYes.parentNode.replaceChild(newConfirmYes, confirmYes)
  
    // Adicionar novo event listener
    newConfirmYes.addEventListener("click", () => {
      deleteRecord(id)
      closeConfirmModal()
    })
  }
  
  // Duplicar um registro
  function duplicateRecord(id) {
    const records = JSON.parse(localStorage.getItem("records") || "[]")
    const recordToDuplicate = records.find((record) => record.id === id)
  
    if (recordToDuplicate) {
      const newRecord = {
        ...recordToDuplicate,
        id: Date.now(), // Novo ID
      }
  
      records.push(newRecord)
      localStorage.setItem("records", JSON.stringify(records))
      loadData()
  
      showToast("Registro duplicado com sucesso!", "success")
    }
  }
  
  // Excluir um registro
  function deleteRecord(id) {
    let records = JSON.parse(localStorage.getItem("records") || "[]")
    records = records.filter((record) => record.id !== id)
  
    localStorage.setItem("records", JSON.stringify(records))
    loadData()
  
    showToast("Registro excluído com sucesso!", "success")
  }
  
  // Exportar registros para arquivo TXT
  function exportToTxt() {
    const records = JSON.parse(localStorage.getItem("records") || "[]")
  
    if (records.length === 0) {
      showToast("Não há registros para exportar.", "error")
      return
    }
  
    let content = "SISTEMA DE PLANILHA DE COMISSÕES\n"
    content += "==============================\n\n"
    content += `Data de exportação: ${new Date().toLocaleString("pt-BR")}\n`
    content += `Usuário: ${localStorage.getItem("currentUser") || "Não definido"}\n\n`
    content += "REGISTROS:\n"
    content += "==============================\n\n"
  
    // Agrupar por data
    const groupedByDate = {}
    records.forEach((record) => {
      if (!groupedByDate[record.date]) {
        groupedByDate[record.date] = []
      }
      groupedByDate[record.date].push(record)
    })
  
    // Adicionar registros agrupados por data
    Object.keys(groupedByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const dailyRecords = groupedByDate[date]
        const totalCommission = dailyRecords.reduce((sum, record) => sum + record.commission, 0)
  
        content += `DATA: ${formatDate(date)}\n`
        content += "------------------------------\n"
  
        dailyRecords.forEach((record) => {
          content += `Protocolo: ${record.protocol}\n`
          content += `AR: ${record.ar}\n`
          content += `Comissão: R$ ${record.commission.toFixed(2)}\n`
          content += "------------------------------\n"
        })
  
        content += `TOTAL DO DIA: R$ ${totalCommission.toFixed(2)}\n`
        content += `QUANTIDADE: ${dailyRecords.length} registro(s)\n\n`
      })
  
    // Adicionar resumo geral
    const totalCommission = records.reduce((sum, record) => sum + record.commission, 0)
    content += "==============================\n"
    content += `TOTAL GERAL: R$ ${totalCommission.toFixed(2)}\n`
    content += `TOTAL DE REGISTROS: ${records.length}\n`
  
    // Criar e baixar o arquivo
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `comissoes_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  
    showToast("Arquivo exportado com sucesso!", "success")
  }
  
  // Funções para gerenciamento de usuário
  function loadCurrentUser() {
    const currentUser = localStorage.getItem("currentUser")
    document.getElementById("current-user").textContent = currentUser || "Não definido"
  
    if (!currentUser) {
      openUserModal()
    }
  }
  
  function openUserModal() {
    const modal = document.getElementById("user-modal")
    modal.style.display = "block"
  
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      document.getElementById("username").value = currentUser
    }
  }
  
  function closeUserModal() {
    document.getElementById("user-modal").style.display = "none"
  }
  
  function closeConfirmModal() {
    document.getElementById("confirm-modal").style.display = "none"
  }
  
  function saveUser() {
    const username = document.getElementById("username").value.trim()
  
    if (!username) {
      showToast("Por favor, informe um nome de usuário.", "error")
      return
    }
  
    localStorage.setItem("currentUser", username)
    document.getElementById("current-user").textContent = username
    closeUserModal()
  
    showToast(`Bem-vindo, ${username}!`, "success")
  }
  
  // Funções para gerenciamento de tema
  function initTheme() {
    // Verificar se há uma preferência salva
    const savedTheme = localStorage.getItem("theme")
  
    if (savedTheme) {
      // Aplicar tema salvo
      document.documentElement.setAttribute("data-theme", savedTheme)
      updateThemeIcon(savedTheme)
    } else {
      // Verificar preferência do sistema
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  
      if (prefersDarkScheme) {
        document.documentElement.setAttribute("data-theme", "dark")
        updateThemeIcon("dark")
        localStorage.setItem("theme", "dark")
      }
    }
  }
  
  function toggleTheme() {
    // Adicionar classe para transição suave
    document.documentElement.classList.add("color-theme-in-transition")
  
    // Obter tema atual
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
    const newTheme = currentTheme === "light" ? "dark" : "light"
  
    // Aplicar novo tema
    document.documentElement.setAttribute("data-theme", newTheme)
  
    // Atualizar ícone
    updateThemeIcon(newTheme)
  
    // Salvar preferência
    localStorage.setItem("theme", newTheme)
  
    // Remover classe de transição após a animação
    setTimeout(() => {
      document.documentElement.classList.remove("color-theme-in-transition")
    }, 800)
  
    // Mostrar notificação
    showToast(`Tema ${newTheme === "dark" ? "escuro" : "claro"} ativado`, "info")
  }
  
  function updateThemeIcon(theme) {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      const icon = themeToggle.querySelector("i")
      if (theme === "dark") {
        icon.className = "fas fa-sun"
      } else {
        icon.className = "fas fa-moon"
      }
    }
  }
  
  // Mostrar notificação toast
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container")
  
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
  
    let icon = "info-circle"
    if (type === "success") icon = "check-circle"
    if (type === "error") icon = "exclamation-circle"
  
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`
  
    toastContainer.appendChild(toast)
  
    // Remover toast após 3 segundos
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }
  
  // Função auxiliar para formatar data
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }
  