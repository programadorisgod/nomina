document.addEventListener('DOMContentLoaded', () => {
  const addProfessor = document.getElementById('addProfessor')
  const calculate = document.getElementById('calculate')
  const table = document.getElementById('table')
  const table2 = document.getElementById('table_2')
  const show = document.querySelector('.mostrar')

  const teachers = []
  const Payroll = []
  let totalPayroll = 0

  addProfessor.addEventListener('click', (event) => {
    event.preventDefault()

    // Obtener los valores del formulario
    const name = document.querySelector('.name').value
    const lastname = document.querySelector('.lastname').value
    const cc = document.querySelector('.id').value
    const category = document.getElementById('combobox').value
    const qualificaction = document.getElementById('combobox1').value

    // Obtener las opciones y/o semillero seleccionadas
    const seedgroups = []
    const checkboxes = document.querySelectorAll('.select_group input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        seedgroups.push(checkbox.value)
      }
    })

    if (name === '' || lastname === '' || cc === '' || category === '0' || qualificaction === '0' || seedgroups.length === 0) {
      alert('Por favor diligencie todos los campos')
      return
    }

    const existInTable = Array.from(document.querySelectorAll('tbody tr')).some((row) => {
      const ccCell = row.querySelector('td:nth-child(3)')
      return ccCell.innerHTML === cc
    })
    if (existInTable) {
      alert('El profesor ya existe')
      return
    }

    // Calcular el salario del profesor

    const SMMLV = calculateSMMLV(category, qualificaction, seedgroups)

    Payroll.push(SMMLV)

    // Object con los datos del profesor
    const teacher = {
      name,
      lastname,
      cc,
      category,
      qualificaction,
      seedgroups,
      SMMLV
    }

    teachers.push(teacher)
    addUser(teacher)

    // Limpiar el formulario si es necesario
    document.querySelector('.name').value = ''
    document.querySelector('.lastname').value = ''
    document.querySelector('.id').value = ''
    document.getElementById('combobox').value = '1' // Valor predeterminado
    document.getElementById('combobox1').value = '1' // Valor predeterminado

    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })
    clearTable()
    // Mostrar los profesores en la tabla

    teachers.forEach((teacher) => {
      const row = document.createElement('tr')

      const nombreCell = document.createElement('td')
      nombreCell.innerHTML = teacher.name
      row.appendChild(nombreCell)

      const apellidoCell = document.createElement('td')
      apellidoCell.innerHTML = teacher.lastname
      row.appendChild(apellidoCell)

      const ccCell = document.createElement('td')
      ccCell.innerHTML = teacher.cc
      row.appendChild(ccCell)

      const categoryCell = document.createElement('td')
      categoryCell.innerHTML = teacher.category
      row.appendChild(categoryCell)

      const qualificactionCell = document.createElement('td')
      qualificactionCell.innerHTML = teacher.qualificaction
      row.appendChild(qualificactionCell)

      const seedgroupsCell = document.createElement('td')
      seedgroupsCell.innerHTML = teacher.seedgroups
      row.appendChild(seedgroupsCell)

      const SMMLVCell = document.createElement('td')
      const SMMLV = formatNumber(teacher.SMMLV)
      SMMLVCell.innerHTML = SMMLV
      row.appendChild(SMMLVCell)

      table.querySelector('tbody').appendChild(row)
    })

    function clearTable () {
      const tableBody = document.querySelector('tbody')
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild)
      }
    }

    function formatNumber (number) {
      return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    async function addUser (teacher) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/nomina', {
          method: 'POST',
          body: JSON.stringify(teacher),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          alert('Ocurrió un error al almacenar el profesor')
          return
        }
        const data = response.json()

        console.log(data)
        alert('Profesor agregado exitosamente')
      } catch (error) {
        alert('Ocurrió un error al almacenar el profesor')
      }
    }

    function calculateSMMLV (category, qualificaction, seedgroups) {
      const CATEGORY_1 = 3068200
      const CATEGORY_2 = 1751650
      const CATEGORY_3 = 3625000
      const CATEGORY_4 = 2028840
      const CATEGORY_5 = 4182960
      const CATEGORY_6 = 2308400
      const CATEGORY_7 = 4544880
      const CATEGORY_8 = 2489360

      const QUALIFICATION_1 = 0.10
      const QUALIFICATION_2 = 0.45
      const QUALIFICATION_3 = 0.90
      const QUALIFICATION_4 = 0

      const SEEDGROUP_1 = 0.056
      const SEEDGROUP_2 = 0.47
      const SEEDGROUP_3 = 0.42
      const SEEDGROUP_4 = 0.38
      const SEEDGROUP_5 = 0.33
      const SEEDGROUP_6 = 0.19

      let basicBonus = 0
      let SMMLV = 0
      let bonificacionQualification = 0
      let bonificacionSeedgroups = 0
      let totalBonus = 0

      const categoryValue = {
        1: CATEGORY_1,
        2: CATEGORY_2,
        3: CATEGORY_3,
        4: CATEGORY_4,
        5: CATEGORY_5,
        6: CATEGORY_6,
        7: CATEGORY_7,
        8: CATEGORY_8
      }

      const qualificactionValue = {
        1: QUALIFICATION_1,
        2: QUALIFICATION_2,
        3: QUALIFICATION_3,
        4: QUALIFICATION_4
      }

      const seedgroupsValue = {
        1: SEEDGROUP_1,
        2: SEEDGROUP_2,
        3: SEEDGROUP_3,
        4: SEEDGROUP_4,
        5: SEEDGROUP_5,
        6: SEEDGROUP_6
      }

      if (category in categoryValue) {
        SMMLV = categoryValue[category]
      }

      // La bonificacion total = (bonificacion base * (1+IPC anual)) * SMMLV
      // IPC Vigente 11,8 = 0,118
      if (qualificaction in qualificactionValue) {
        basicBonus = qualificactionValue[qualificaction]
      }

      bonificacionQualification = (basicBonus * (1 + 0.118)) * SMMLV

      // como seedgroups es un array, se debe recorrer y preguntar si contiene el valor de alguno de los seedgroupsValue y asi aplicar la formula y sumar los resultados
      seedgroups.forEach((seedgroup) => {
        if (seedgroup in seedgroupsValue) {
          bonificacionSeedgroups += parseFloat(seedgroupsValue[seedgroup])
        }
      })

      bonificacionSeedgroups = (bonificacionSeedgroups * (1 + 0.118)) * SMMLV

      totalBonus = Number(bonificacionQualification) + Number(bonificacionSeedgroups) + Number(SMMLV)
      return totalBonus
    }
  })

  calculate.addEventListener('click', (event) => {
    event.preventDefault()

    if (Payroll.length === 0) {
      alert('No hay profesores para calcular la nomina')
    } else {
      totalPayroll = calculateTotalPayroll(Payroll)
      const formattedTotalBONUS = totalPayroll.toFixed(4)
      const parts = formattedTotalBONUS.toString().split('.')
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      const decimalPart = parts[1]
      const finalTotalPayroll = `${integerPart},${decimalPart}`

      document.getElementById('totalPayroll').innerHTML = finalTotalPayroll
    }

    // Funcion para calcular el total de la nomina
    function calculateTotalPayroll (Payroll) {
      let totalPayroll = 0
      Payroll.forEach((SMMLV) => {
        totalPayroll += SMMLV
      })
      return totalPayroll
    }
  })

  show.addEventListener('click', async (event) => {
    event.preventDefault()
    const totalPayroll = document.getElementById('total')
    let total = 0
    let teachers = []
    async function loadTeachersFromDatabase () {
      try {
        const response = await fetch('http://localhost:3000/api/v1/nomina')
        if (!response.ok) {
          alert('Ocurrió un error al cargar la data')
        }
        const data = await response.json()
        console.log(data)
        return data
      } catch (error) {
        alert('Ocurrió un error al cargar la data')
      }
    }
    function formatNumber (number) {
      return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    function clearTable () {
      const tableBody = table2.querySelector('tbody')
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild)
      }
    }
    async function initalizeApp () {
      teachers = await loadTeachersFromDatabase()
    }
    await initalizeApp()
    function createTable (teachers) {
      clearTable()
      teachers.forEach((teacher) => {
        const row = document.createElement('tr')

        const nombreCell = document.createElement('td')
        nombreCell.innerHTML = teacher.name
        row.appendChild(nombreCell)

        const apellidoCell = document.createElement('td')
        apellidoCell.innerHTML = teacher.lastname
        row.appendChild(apellidoCell)

        const ccCell = document.createElement('td')
        ccCell.innerHTML = teacher.cc
        row.appendChild(ccCell)

        const categoryCell = document.createElement('td')
        categoryCell.innerHTML = teacher.category
        row.appendChild(categoryCell)

        const qualificactionCell = document.createElement('td')
        qualificactionCell.innerHTML = teacher.qualificaction
        row.appendChild(qualificactionCell)

        const seedgroupsCell = document.createElement('td')
        seedgroupsCell.innerHTML = teacher.seedgroups
        row.appendChild(seedgroupsCell)

        const SMMLVCell = document.createElement('td')
        const SMMLV = formatNumber(teacher.SMMLV)
        SMMLVCell.innerHTML = SMMLV
        row.appendChild(SMMLVCell)


        table2.querySelector('tbody').appendChild(row)
      })
    }
    teachers.forEach(teacher => {
       total += teacher.SMMLV
    })

    totalPayroll.innerHTML= `Nomina total: ${formatNumber(total)}`
 
    createTable(teachers)
  })
})
