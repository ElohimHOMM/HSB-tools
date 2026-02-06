const SIZE_ORDER = ['Small', 'Medium', 'Large', 'Extra Large']
const pageKey = 'list.sacks'
let data = []

function updateRowState(row) {
    let highestCheckedIndex = -1

    for (let idx = 0; idx < SIZE_ORDER.length; idx++) {
        let cb = row.querySelector(`input.form-check-input[data-size="${SIZE_ORDER[idx]}"]`)
        if (cb && cb.checked) {
            highestCheckedIndex = idx
        }
    }

    row.querySelectorAll('input.form-check-input[data-size]').forEach(cb => {
        let idx = SIZE_ORDER.indexOf(cb.dataset.size) === -1 ? 100 : SIZE_ORDER.indexOf(cb.dataset.size)

        cb.disabled = idx < highestCheckedIndex
        cb.checked = idx <= highestCheckedIndex
    })
}

$(async function () {
    const saveManager = new SaveManager(pageKey)
    data = await saveManager.loadData()

    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        updateRowState(checkbox.closest('tr'))
        if (SIZE_ORDER.includes(checkbox.dataset.size)) {
            checkbox.addEventListener('change', () => {
                updateRowState(checkbox.closest('tr'))
            })
        }
    })
})