const SIZE_ORDER = ['Small', 'Medium', 'Large', 'Extra Large']
const pageKey = 'list.sacks'
let data = {}

function updateRowState(row) {
    let highestCheckedIndex = -1

    for (let idx = 0; idx < SIZE_ORDER.length; idx++) {
        const cb = row.querySelector(`input.form-check-input[data-size="${SIZE_ORDER[idx]}"]`)
        if (cb && cb.checked) {
            highestCheckedIndex = idx
        }
    }

    row.querySelectorAll('input.form-check-input[data-size]').forEach(cb => {
        const idx = SIZE_ORDER.indexOf(cb.dataset.size)
        if (idx === -1) return // Unsized / Enchanted

        cb.disabled = idx < highestCheckedIndex
        cb.checked = idx <= highestCheckedIndex
    })
}

$(async function () {
    const saveManager = new SaveManager(pageKey)
    data = await saveManager.loadData()

    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        const key = checkbox.dataset.key
        const row = checkbox.closest('tr')

        checkbox.checked = !!data[key]

        updateRowState(row)

        checkbox.addEventListener('change', async () => {
            if (checkbox.checked) {
                data[key] = true
            } else {
                delete data[key]
            }

            updateRowState(row)
            await saveManager.saveData(data)
        })
    })
})
