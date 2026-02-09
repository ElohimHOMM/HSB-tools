const pageKey = 'list.enigma'
let data = []

$(async function () {
    const saveManager = new SaveManager(pageKey)
    data = await saveManager.loadData()

    document.querySelectorAll('.enigma-checkbox').forEach((box) => {
        const id = box.dataset.id
        box.checked = !!data[id]

        box.addEventListener('change', async () => {
            data[box.dataset.id] = box.checked
            await saveManager.saveData(data)
        })
    })
})