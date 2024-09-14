document.getElementById('attendanceForm').addEventListener('submit', async function(e) {
    e.preventDefault()

    const studentName = document.getElementById('student_name').value
    const studentCode = parseInt(document.getElementById('student_code').value)
    const studentGrade = document.getElementById('student_grade').value
    const status = document.getElementById('status').value
    const today = new Date().toISOString().slice(0,10)
    const lastSubmitted = localStorage.getItem('lastSubmittedDate')

    if(lastSubmitted === today) {
        displayMessage('Kamu sudah absensi', false)
        return
    }

    try {
        const response = await fetch('/attendance/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentName, studentCode, studentGrade, status }),
        })

        const result = await response.json()
    
        if (response.ok) {
            await loadAttendance(studentGrade)

            localStorage.setItem('lastSubmittedDate', today)
    
            document.getElementById('student_name').value = ''
            document.getElementById('student_code').value = ''
            document.getElementById('grade').value = ''
            document.getElementById('grade-container').style.display = 'none'

            displayMessage(result.message, true)
        } else {
            displayMessage(result.message, false)
        }    
    } catch(err) {
        console.error(err.message)
    }
})

function displayMessage(message, isSucces = true) {
    const formMessage = document.getElementById('form-message')

    formMessage.textContent = message
    formMessage.style.color = isSucces ? 'green':'red'
    formMessage.style.display = 'block'

    setTimeout(() => {
        formMessage.style.display = 'none'
    }, 2000)
}

async function loadAttendance(studentGrade) {
    const response = await fetch(`/attendance?studentGrade=${studentGrade}`)

    if (response.ok) {
        const data = await response.json()

        localStorage.setItem('attendanceHistory', JSON.stringify(data))

        let table = document.getElementById('attendanceList')
        table.querySelector('tbody').innerHTML = ''

        data.map((record, index) => {
            table.querySelector('tbody').innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${record.student_name}</td>
                <td>${record.date.slice(0,10)}</td>
                <td>${record.status}</td>
            </tr>`
        })
    } else {
        console.error('Failed to load attendance')
    }
}

function loadAttendanceFromStorage() {
    const storedData = localStorage.getItem('attendanceHistory')
    if (storedData.length === 0) {
        document.getElementById('history-container').style.display = 'none'
    } else {
        const data = JSON.parse(storedData)
        let table = document.getElementById('attendanceList')
        table.querySelector('tbody').innerHTML = ''

        data.map((record, index) => {
            table.querySelector('tbody').innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${record.student_name}</td>
                <td>${record.date.slice(0,10)}</td>
                <td>${record.status}</td>
            </tr>`
        }) 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAttendanceFromStorage()

    const btnHistory = document.getElementById('btn-history')
    const historyContainer = document.getElementById('history-container')

    btnHistory.addEventListener('click', function() {
        historyContainer.classList.toggle('displayHistory')
    })
})

document.getElementById('btn-info').addEventListener('click', () => {
    document.getElementById('info-container').classList.toggle('info')
})

const gradeCategory = {
    kelasX: ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9'],
    kelasXI: ['XI-1', 'XI-2', 'XI-3', 'XI-4', 'XI-5', 'XI-6', 'XI-7', 'XI-8', 'XI-9'],
    kelasXII: ['XII-1', 'XII-2', 'XII-3', 'XII-4', 'XII-5', 'XII-6', 'XII-7', 'XII-8', 'XII-9'],
}

document.getElementById('grade').addEventListener('change', () => {
    const category = document.getElementById('grade').value
    const subGradeSelect = document.getElementById('student_grade')
    const subGradeContainer = document.getElementById('grade-container')

    if (category) {
        subGradeContainer.style.display = 'block'
        subGradeSelect.innerHTML = ''

        gradeCategory[category].map(grade => {
            const option = document.createElement('option')
            option.value = grade.replace('-', '')
            option.textContent = grade
            subGradeSelect.appendChild(option)
        })
    } else {
        subGradeContainer.style.display = 'none'
    }
})

